import {
  autenticar,
  crearUsuario,
  guardarSesion,
  obtenerSesion,
  cerrarSesion,
  listarUsuarios,
} from "../../src/data/usuarios.js";

describe("data/usuarios.js", () => {
  beforeEach(() => localStorage.clear());

  it("autentica con credenciales correctas y no expone la contraseña", () => {
    const usuario = autenticar("javiera.munoz@gmail.com", "admin1234");
    expect(usuario).not.toBeNull();
    expect(usuario.tipo).toBe("administrador");
    expect(usuario.password).toBeUndefined();
  });

  it("rechaza contraseña incorrecta o correo inexistente", () => {
    expect(autenticar("javiera.munoz@gmail.com", "otra")).toBeNull();
    expect(autenticar("nadie@gmail.com", "admin1234")).toBeNull();
  });

  it("el correo no distingue mayúsculas", () => {
    expect(autenticar("CAMILA.TORO@gmail.com", "cliente1234")).not.toBeNull();
  });

  it("no permite registrar dos usuarios con el mismo correo", () => {
    expect(() => crearUsuario({ nombre: "X", correo: "camila.toro@gmail.com", password: "123456" })).toThrowError(
      /Ya existe/
    );
  });

  it("registra clientes nuevos por defecto", () => {
    const nuevo = crearUsuario({ nombre: "Ana", correo: "ana@gmail.com", password: "123456" });
    expect(nuevo.tipo).toBe("cliente");
    expect(listarUsuarios().length).toBe(4);
  });

  it("guarda y cierra la sesión", () => {
    guardarSesion({ id: 1, nombre: "Javiera", correo: "j@x.cl", password: "secreta", tipo: "administrador" });
    expect(obtenerSesion().password).toBeUndefined();
    cerrarSesion();
    expect(obtenerSesion()).toBeNull();
  });
});
