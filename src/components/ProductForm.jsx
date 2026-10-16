// Formulario de producto (crear y editar).
// Es un formulario controlado: cada input toma su valor del estado.
// No guarda nada: si los datos son válidos llama a onGuardar(datos)
// y la página decide si crea o actualiza.
import { useState } from "react";
import { hayErrores, validarProducto } from "../utils/validacionesAdmin.js";

const VACIO = {
  codigo: "",
  nombre: "",
  descripcion: "",
  precio: "",
  precioOferta: "",
  categoriaId: "",
  unidad: "Unidad",
  stock: "",
  stockCritico: "",
  imagen: "",
};

// Convierte un producto guardado (números, null) a valores de formulario (texto).
function aValores(producto) {
  if (!producto) return VACIO;
  return {
    ...VACIO,
    ...producto,
    precio: String(producto.precio),
    precioOferta: producto.precioOferta == null ? "" : String(producto.precioOferta),
    categoriaId: String(producto.categoriaId),
    stock: String(producto.stock),
    stockCritico: String(producto.stockCritico),
  };
}

// Un campo con su label y su mensaje de error (para no repetir el mismo JSX 8 veces).
function Campo({ id, label, error, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      {children}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}

export default function ProductForm({ producto, categorias, onGuardar, textoBoton = "Guardar" }) {
  const [valores, setValores] = useState(() => aValores(producto));
  const [errores, setErrores] = useState({});

  // Un solo handler para todos los inputs: usa el atributo name para saber qué campo cambió.
  function handleChange(e) {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nuevosErrores = validarProducto(valores);
    setErrores(nuevosErrores);
    if (hayErrores(nuevosErrores)) return;

    // Se devuelven los datos con el tipo correcto (números y null), listos para guardar.
    onGuardar({
      codigo: valores.codigo.trim().toUpperCase(),
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      precio: Number(valores.precio),
      precioOferta: valores.precioOferta.trim() === "" ? null : Number(valores.precioOferta),
      categoriaId: Number(valores.categoriaId),
      unidad: valores.unidad,
      stock: Number(valores.stock),
      stockCritico: Number(valores.stockCritico),
      imagen: valores.imagen.trim(),
    });
  }

  // Clase de Bootstrap para pintar el input en rojo si tiene error.
  const clase = (campo, base = "form-control") => (errores[campo] ? `${base} is-invalid` : base);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className="col-md-4">
          <Campo id="producto-codigo" label="Código" error={errores.codigo}>
            <input id="producto-codigo" name="codigo" className={clase("codigo")} value={valores.codigo} onChange={handleChange} />
          </Campo>
        </div>
        <div className="col-md-8">
          <Campo id="producto-nombre" label="Nombre" error={errores.nombre}>
            <input id="producto-nombre" name="nombre" className={clase("nombre")} value={valores.nombre} onChange={handleChange} />
          </Campo>
        </div>
      </div>

      <Campo id="producto-descripcion" label="Descripción (opcional)">
        <textarea
          id="producto-descripcion"
          name="descripcion"
          className="form-control"
          rows="3"
          value={valores.descripcion}
          onChange={handleChange}
        />
      </Campo>

      <div className="row">
        <div className="col-md-6">
          <Campo id="producto-categoria" label="Categoría" error={errores.categoriaId}>
            <select
              id="producto-categoria"
              name="categoriaId"
              className={clase("categoriaId", "form-select")}
              value={valores.categoriaId}
              onChange={handleChange}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </Campo>
        </div>
        <div className="col-md-6">
          <Campo id="producto-unidad" label="Unidad">
            <select id="producto-unidad" name="unidad" className="form-select" value={valores.unidad} onChange={handleChange}>
              <option value="Unidad">Unidad</option>
              <option value="Kit">Kit</option>
            </select>
          </Campo>
        </div>
      </div>

      <div className="row">
        <div className="col-6 col-md-3">
          <Campo id="producto-precio" label="Precio" error={errores.precio}>
            <input id="producto-precio" name="precio" type="number" min="0" className={clase("precio")} value={valores.precio} onChange={handleChange} />
          </Campo>
        </div>
        <div className="col-6 col-md-3">
          <Campo id="producto-oferta" label="Oferta (opcional)" error={errores.precioOferta}>
            <input
              id="producto-oferta"
              name="precioOferta"
              type="number"
              min="0"
              className={clase("precioOferta")}
              value={valores.precioOferta}
              onChange={handleChange}
            />
          </Campo>
        </div>
        <div className="col-6 col-md-3">
          <Campo id="producto-stock" label="Stock" error={errores.stock}>
            <input id="producto-stock" name="stock" type="number" min="0" className={clase("stock")} value={valores.stock} onChange={handleChange} />
          </Campo>
        </div>
        <div className="col-6 col-md-3">
          <Campo id="producto-critico" label="Stock crítico" error={errores.stockCritico}>
            <input
              id="producto-critico"
              name="stockCritico"
              type="number"
              min="0"
              className={clase("stockCritico")}
              value={valores.stockCritico}
              onChange={handleChange}
            />
          </Campo>
        </div>
      </div>

      <Campo id="producto-imagen" label="Ruta de la imagen (opcional)">
        <input
          id="producto-imagen"
          name="imagen"
          className="form-control"
          placeholder="/img/cilindro-11kg.png"
          value={valores.imagen}
          onChange={handleChange}
        />
      </Campo>

      <button type="submit" className="btn btn-primary">
        {textoBoton}
      </button>
    </form>
  );
}
