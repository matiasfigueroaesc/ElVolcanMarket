import { ApiError, api, cuandoExpireLaSesion, establecerToken, obtenerToken, textoError } from "../../src/api/cliente.js";
import { conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";

describe("api/cliente.js", () => {
  let backend;
  beforeEach(() => {
    backend = instalarApiFalsa();
    cuandoExpireLaSesion(null);
  });

  it("arma la URL con /api/v1 y omite los parámetros vacíos", async () => {
    await api.get("/productos", { categoriaId: 2, texto: "", oferta: null });
    const [url] = window.fetch.calls.mostRecent().args;
    expect(url).toBe("/api/v1/productos?categoriaId=2");
  });

  it("envía el JSON con Content-Type y el token en Authorization", async () => {
    conToken("admin");
    await api.post("/categorias", { nombre: "Nueva" });
    const [, opciones] = window.fetch.calls.mostRecent().args;
    expect(opciones.headers["Content-Type"]).toBe("application/json");
    expect(opciones.headers.Authorization).toBe("Bearer token-1");
    expect(JSON.parse(opciones.body)).toEqual({ nombre: "Nueva" });
  });

  it("convierte la respuesta de error del backend en ApiError con mensaje y campos", async () => {
    window.fetch.and.callFake(async () =>
      new Response(JSON.stringify({ status: 400, mensaje: "Revisa los campos del formulario.", campos: { precio: "El precio debe ser mayor a 0." } }), { status: 400 })
    );
    const error = await api.post("/productos", {}).catch((e) => e);
    expect(error instanceof ApiError).toBeTrue();
    expect(error.status).toBe(400);
    expect(error.campos.precio).toBe("El precio debe ser mayor a 0.");
    expect(textoError(error)).toBe("Revisa los campos del formulario. El precio debe ser mayor a 0.");
  });

  it("si no hay conexión lanza un ApiError con status 0 y un mensaje claro", async () => {
    backend.db.caido = true;
    await expectAsync(api.get("/productos")).toBeRejectedWith(
      jasmine.objectContaining({ status: 0, message: jasmine.stringContaining("No se pudo conectar") })
    );
  });

  it("un 204 (eliminar) devuelve null", async () => {
    conToken("admin");
    expect(await api.delete("/productos/10")).toBeNull();
  });

  it("con el token vencido renueva con la cookie y repite la petición una vez", async () => {
    backend.db.cookieRefresh = 1; // la cookie sigue vigente
    establecerToken("token-vencido");
    const criticos = await api.get("/productos/criticos");
    expect(criticos.length).toBe(1);
    expect(obtenerToken()).toBe("token-1");
    expect(backend.db.peticiones.map((p) => p.ruta)).toEqual([
      "/productos/criticos",
      "/auth/refresh",
      "/productos/criticos",
    ]);
  });

  it("si el refresh también venció avisa a AuthContext y la ruta privada responde 401", async () => {
    const alExpirar = jasmine.createSpy("alExpirar");
    cuandoExpireLaSesion(alExpirar);
    establecerToken("token-vencido");
    await expectAsync(api.get("/productos/criticos")).toBeRejectedWith(jasmine.objectContaining({ status: 401 }));
    expect(alExpirar).toHaveBeenCalled();
    expect(obtenerToken()).toBeNull();
  });
});
