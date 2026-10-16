// Listado de categorías del panel: /admin/categorias
import { useState } from "react";
import { Link } from "react-router-dom";
import CategoryTable from "../../components/CategoryTable.jsx";
import { eliminarCategoria, listarCategorias } from "../../data/categorias.js";
import { listarProductos } from "../../data/productos.js";

// Cuenta cuántos productos tiene cada categoría: { 1: 4, 2: 3, ... }
function contarProductos() {
  const conteo = {};
  listarProductos().forEach((p) => {
    conteo[p.categoriaId] = (conteo[p.categoriaId] ?? 0) + 1;
  });
  return conteo;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState(() => listarCategorias());
  // Mensaje de resultado: { tipo: "success" | "danger", texto }
  const [aviso, setAviso] = useState(null);
  const conteo = contarProductos();

  function handleEliminar(categoria) {
    // Regla de negocio: no se borra una categoría que todavía tiene productos,
    // porque esos productos quedarían "Sin categoría" y desaparecerían de la tienda.
    if (conteo[categoria.id] > 0) {
      setAviso({
        tipo: "danger",
        texto: `No se puede eliminar "${categoria.nombre}": tiene ${conteo[categoria.id]} producto(s). Muévelos a otra categoría primero.`,
      });
      return;
    }
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;
    eliminarCategoria(categoria.id);
    setCategorias(listarCategorias());
    setAviso({ tipo: "success", texto: `Categoría "${categoria.nombre}" eliminada.` });
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="mb-0">Categorías</h1>
        <Link to="/admin/categorias/nueva" className="btn btn-primary">
          Nueva categoría
        </Link>
      </div>

      {aviso && (
        <div className={`alert alert-${aviso.tipo}`} role="status">
          {aviso.texto}
        </div>
      )}

      <CategoryTable categorias={categorias} conteo={conteo} onEliminar={handleEliminar} />
    </div>
  );
}
