import { ZONAS_DESPACHO, textoCobertura, zonasDeComuna } from "../../src/utils/zonasDespacho.js";

const zona = (id) => ZONAS_DESPACHO.find((z) => z.id === id);

describe("utils/zonasDespacho", () => {
  // Tipo: render (datos que alimentan la tabla)
  it("tiene las 5 zonas de la Eval 1", () => {
    expect(ZONAS_DESPACHO.map((z) => z.nombre)).toEqual([
      "Zona Centro",
      "Zona Oriente",
      "Zona Rural",
      "Zona Sur",
      "Zona Comercial",
    ]);
  });

  // Tipo: props (entrada -> salida de una función pura)
  it("textoCobertura muestra el nombre de la comuna y su sector", () => {
    expect(textoCobertura(zona("centro"))).toBe("Chillán (sectores centro, norte y sur)");
    expect(textoCobertura(zona("oriente"))).toBe("Chillán (sector oriente), Chillán Viejo");
    expect(textoCobertura(zona("sur"))).toBe("Bulnes, Quillón");
  });

  // Tipo: props
  it("textoCobertura usa el detalle cuando la zona no se define por comunas", () => {
    expect(textoCobertura(zona("comercial"))).toBe("Parques industriales y locales comerciales");
  });

  // Tipo: props
  it("zonasDeComuna devuelve todas las zonas que llegan a una comuna", () => {
    expect(zonasDeComuna("chillan").map((z) => z.id)).toEqual(["centro", "oriente"]);
    expect(zonasDeComuna("quillon").map((z) => z.id)).toEqual(["sur"]);
  });

  // Tipo: props
  it("zonasDeComuna devuelve [] si no hay cobertura", () => {
    expect(zonasDeComuna("concepcion")).toEqual([]);
  });
});
