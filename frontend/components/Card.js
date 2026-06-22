export default function Card({ title, value, children }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      {title && <p className="text-sm font-medium text-muted">{title}</p>}
      {value !== undefined && <p className="mt-2 text-3xl font-bold text-ink">{value}</p>}
      {children}
    </section>
  );
}
