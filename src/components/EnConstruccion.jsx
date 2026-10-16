// Marcador temporal para las vistas que aún no se migran.
// Muestra quién es responsable y qué archivo de la Eval 1 sirve de referencia.
export default function EnConstruccion({ titulo, responsable, referencia }) {
  return (
    <section className="container py-5">
      <h1 className="h2">{titulo}</h1>
      <div className="alert alert-warning mt-3" role="status">
        <p className="mb-1">Vista pendiente de migrar a React.</p>
        <p className="mb-1">
          <strong>Responsable:</strong> {responsable}
        </p>
        {referencia && (
          <p className="mb-0">
            <strong>Referencia Eval 1:</strong> <code>{referencia}</code>
          </p>
        )}
      </div>
    </section>
  );
}
