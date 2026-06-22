export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <div className="flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium text-muted shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        {label}
      </div>
    </div>
  );
}
