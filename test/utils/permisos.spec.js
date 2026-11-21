import { INICIO_VENDEDOR, vendedorPuedeVer } from "../../src/utils/permisos.js";

describe("utils/permisos", () => {
  it("el vendedor puede ver listas y detalles de órdenes y productos", () => {
    ["/admin/ordenes", "/admin/ordenes/3", "/admin/productos", "/admin/productos/4", "/admin/productos/criticos"].forEach(
      (ruta) => expect(vendedorPuedeVer(ruta)).withContext(ruta).toBeTrue()
    );
  });

  it("el vendedor no puede abrir formularios ni otras secciones", () => {
    [
      "/admin",
      "/admin/productos/nuevo",
      "/admin/productos/4/editar",
      "/admin/categorias",
      "/admin/usuarios",
      "/admin/usuarios/3/compras",
      "/admin/reportes",
      "/admin/perfil",
    ].forEach((ruta) => expect(vendedorPuedeVer(ruta)).withContext(ruta).toBeFalse());
  });

  it("la página de inicio del vendedor está permitida", () => {
    expect(vendedorPuedeVer(INICIO_VENDEDOR)).toBeTrue();
  });
});
