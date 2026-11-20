// Muestra "Cargando..." o el error de una carga del backend (ver hooks/useCarga.js).
// Uso en una página:
//   if (cargando || error) return <EstadoCarga cargando={cargando} error={error} />;
export default function EstadoCarga({ cargando, error, onReintentar }) {
  if (cargando) {
    return (
      <div className="d-flex align-items-center gap-2 py-4 text-muted" role="status">
        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
        Cargando...
      </div>
    );
  }
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error.message}
        {onReintentar && (
          <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={onReintentar}>
            Reintentar
          </button>
        )}
      </div>
    );
  }
  return null;
}
