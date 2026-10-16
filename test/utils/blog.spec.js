import { ARTICULOS, obtenerArticulo } from "../../src/utils/blog.js";

describe("utils/blog", () => {
  it("tiene los 2 artículos migrados con los campos necesarios", () => {
    expect(ARTICULOS.length).toBe(2);
    ARTICULOS.forEach((a) => {
      expect(a.titulo).toBeTruthy();
      expect(a.secciones.length).toBe(3);
    });
  });

  it("obtenerArticulo acepta el id como string (viene de useParams)", () => {
    expect(obtenerArticulo("1").id).toBe(1);
    expect(obtenerArticulo(2).id).toBe(2);
  });

  it("obtenerArticulo devuelve null si no existe o el id no es numérico", () => {
    expect(obtenerArticulo("99")).toBeNull();
    expect(obtenerArticulo("abc")).toBeNull();
    expect(obtenerArticulo(undefined)).toBeNull();
  });
});
