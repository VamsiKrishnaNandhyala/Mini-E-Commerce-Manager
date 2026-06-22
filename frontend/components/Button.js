"use client";

const styles = {
  primary: "bg-brand text-white hover:bg-blue-700",
  secondary: "border border-line bg-white text-ink hover:bg-slate-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-muted hover:bg-slate-100"
};

export default function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
