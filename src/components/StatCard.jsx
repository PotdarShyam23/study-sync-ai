export default function StatCard({ label, value, helper }) {
  return (
    <article className="stat-card">
      <p className="muted">{label}</p>
      <h3>{value}</h3>
      <p>{helper}</p>
    </article>
  );
}
