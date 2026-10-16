import { useState } from "react";
import { listarCategorias } from "../../data/categorias.js";
import { buscarProductos, listarPorCategoria, listarProductos } from "../../data/productos.js";
import { useCart } from "../../context/CartContext.jsx";
import CategoryFilter from "../../components/CategoryFilter.jsx";
import ProductList from "../../components/ProductList.jsx";

export default function Productos() {
  const [texto, setTexto] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const { agregar } = useCart();

  const base = categoriaId ? listarPorCategoria(categoriaId) : listarProductos();
  const visibles = buscarProductos(texto, base);

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Nuestros productos</h1>
        <span className="text-muted">{visibles.length} productos</span>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <CategoryFilter
            categorias={listarCategorias()}
            seleccionada={categoriaId}
            onCambiar={setCategoriaId}
          />
        </div>
      </div>

      <ProductList productos={visibles} onAgregar={(p) => agregar(p, 1)} />
    </section>
  );
}