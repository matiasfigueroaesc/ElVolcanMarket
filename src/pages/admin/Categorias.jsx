// Listado de categorías del panel: /admin/categorias
import { useState } from "react";
import { Link } from "react-router-dom";
import CategoryTable from "../../components/CategoryTable.jsx";
import EstadoCarga from "../../components/EstadoCarga.jsx";
import { eliminarCategoria, listarCategorias } from "../../data/categorias.js";
import { listarProductos } from "../../data/productos.js";
import { useCarga } from "../../hooks/useCarga.js";

// Cuenta cuántos productos tiene cada categoría: { 1: 4, 2: 3, ... }
function contarProductos(productos) {
  const conteo = {};
  productos.forEach((p) => {
    conteo[p.categoriaId] = (conteo[p.categoriaId] ?? 0) + 1;
  });
  return conteo;
}

export default function Categorias() {
  // Categorías y productos (para el conteo) se piden al backend en paralelo.
  const { datos, cargando, error, recargar } = useCarga(() =>
    Promise.all([listarCategorias(), listarProductos()])
  );
  // Mensaje de resultado: { tipo: "success" | "danger", texto }
  const [aviso, setAviso] = useState(null);
  const [categorias, productos] = datos ?? [[], []];
  const conteo = contarProductos(productos);

  async function handleEliminar(categoria) {
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
    try {
      // El backend aplica la misma regla (409) por si otro admin agregó productos recién.
      await eliminarCategoria(categoria.id);
      recargar();
      setAviso({ tipo: "success", texto: `Categoría "${categoria.nombre}" eliminada.` });
    } catch (e) {
      setAviso({ tipo: "danger", texto: e.message });
    }
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

      {datos === null ? (
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar} />
      ) : (
        <CategoryTable categorias={categorias} conteo={conteo} onEliminar={handleEliminar} />
      )}
    </div>
  );
}
