// Tarjeta de métrica del dashboard admin.
export default function StatCard({ titulo, valor, detalle, color = "primary" }) {
  return (
    <article className={`card text-bg-${color} h-100 border-0`}>
      <div className="card-body">
        <h2 className="h6 card-title mb-1">{titulo}</h2>
        <p className="display-6 fw-bold mb-1" data-testid="stat-valor">
          {valor}
        </p>
        {detalle && <p className="card-text small mb-0">{detalle}</p>}
      </div>
    </article>
  );
}
