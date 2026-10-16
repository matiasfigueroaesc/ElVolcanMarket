export default function CategoryFilter({ categorias, seleccionada, onCambiar }) {
  return (
    <select
      className="form-select"
      aria-label="Filtrar por categoría"
      value={seleccionada}
      onChange={(e) => onCambiar(e.target.value)}
    >
      <option value="">Todas las categorías</option>
      {categorias.map((c) => (
        <option key={c.id} value={c.id}>{c.nombre}</option>
      ))}
    </select>
  );
}