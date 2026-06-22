import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/orders", label: "Orders" },
  { href: "/payments", label: "Payments" }
];

export default function Navbar() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-accent">Microservices</p>
            <h1 className="text-xl font-bold text-ink">Mini E-Commerce Manager</h1>
          </div>
          <div className="hidden rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-muted sm:block">
            API Gateway: localhost:3000
          </div>
        </div>
        <nav className="mt-4 flex gap-2 overflow-x-auto md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-md border border-line px-3 py-2 text-sm font-semibold text-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
