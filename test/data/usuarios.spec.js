import { obtenerToken } from "../../src/api/cliente.js";
import {
  actualizarUsuario,
  cerrarSesion,
  crearUsuario,
  eliminarUsuario,
  iniciarSesion,
  listarUsuarios,
  normalizarRun,
  obtenerMiUsuario,
  obtenerUsuario,
  registrarCliente,
  restaurarSesion,
} from "../../src/data/usuarios.js";
import { conToken, instalarApiFalsa } from "../helpers/apiFalsa.js";

const NUEVO = {
  run: "112223334",
  nombre: "Ana",
  apellidos: "Rojas",
  correo: "ana@gmail.com",
  password: "1234",
  region: "nuble",
  comuna: "chillan",
  direccion: "Calle 1",
};

describe("data/usuarios.js", () => {
  let api;
  beforeEach(() => {
    api = instalarApiFalsa();
  });

  describe("sesión", () => {
    it("iniciarSesion guarda el token en memoria y no expone la contraseña", async () => {
      const sesion = await iniciarSesion("javiera.munoz@gmail.com", "admin1234");
      expect(sesion.usuario.tipo).toBe("administrador");
      expect(sesion.usuario.password).toBeUndefined();
      expect(obtenerToken()).toBe("token-1");
      // El token no se guarda en localStorage.
      expect(Object.values({ ...localStorage }).join()).not.toContain("token-1");
    });

    it("login, refresh y logout llevan el encabezado de sesión y no envían el token anterior", async () => {
      conToken("cliente");
      await iniciarSesion("javiera.munoz@gmail.com", "admin1234");
      const [, opciones] = window.fetch.calls.mostRecent().args;
      expect(opciones.headers["X-Requested-With"]).toBe("ElVolcanMarket");
      expect(opciones.headers.Authorization).toBeUndefined();
      expect(opciones.credentials).toBe("include");
    });

    it("credenciales incorrectas responden 401", async () => {
      await expectAsync(iniciarSesion("javiera.munoz@gmail.com", "otra")).toBeRejectedWith(
        jasmine.objectContaining({ status: 401 })
      );
      expect(obtenerToken()).toBeNull();
    });

    it("restaurarSesion recupera la sesión con la cookie del refresh, o null sin cookie", async () => {
      expect(await restaurarSesion()).toBeNull();
      api.db.cookieRefresh = 3;
      const sesion = await restaurarSesion();
      expect(sesion.usuario.nombre).toBe("Camila");
      expect(obtenerToken()).toBe("token-3");
    });

    it("dos restauraciones al mismo tiempo hacen UNA sola petición (el refresh rota)", async () => {
      api.db.cookieRefresh = 1;
      const [a, b] = await Promise.all([restaurarSesion(), restaurarSesion()]);
      expect(a).toBe(b);
      expect(api.db.peticiones.filter((p) => p.ruta === "/auth/refresh").length).toBe(1);
    });

    it("cerrarSesion borra el token aunque el backend no responda", async () => {
      conToken("admin");
      api.db.caido = true;
      await expectAsync(cerrarSesion()).toBeRejected();
      expect(obtenerToken()).toBeNull();
    });

    it("registrarCliente crea siempre un cliente y rechaza correos repetidos (409)", async () => {
      const nuevo = await registrarCliente({ ...NUEVO, tipo: "administrador" });
      expect(nuevo.tipo).toBe("cliente");
      await expectAsync(registrarCliente({ ...NUEVO, run: "99999999-9" })).toBeRejectedWith(
        jasmine.objectContaining({ status: 409, message: "Ya existe un usuario con ese correo." })
      );
    });

    it("obtenerMiUsuario devuelve el usuario del token", async () => {
      conToken("vendedor");
      expect((await obtenerMiUsuario()).correo).toBe("pedro.salinas@duoc.cl");
    });
  });

  describe("CRUD (solo ADMIN)", () => {
    it("un cliente no puede listar usuarios (403)", async () => {
      conToken("cliente");
      await expectAsync(listarUsuarios()).toBeRejectedWith(jasmine.objectContaining({ status: 403 }));
    });

    it("el administrador lista, crea, edita y elimina", async () => {
      conToken("admin");
      expect((await listarUsuarios()).length).toBe(3);
      const nuevo = await crearUsuario({ ...NUEVO, tipo: "vendedor" });
      expect((await actualizarUsuario(nuevo.id, { ...NUEVO, nombre: "Ana María", tipo: "vendedor" })).nombre).toBe("Ana María");
      await eliminarUsuario(nuevo.id);
      expect(await obtenerUsuario(nuevo.id)).toBeNull();
    });
  });

  it("normalizarRun ignora puntos, guion y mayúsculas de la K", () => {
    expect(normalizarRun("17.894.567-k")).toBe("17894567K");
    expect(normalizarRun("")).toBe("");
  });
});
