import "./globals.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Mini E-Commerce Manager",
  description: "Microservices-based Mini E-Commerce Management System"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#f5f7fb]">
          <Navbar />
          <div className="mx-auto flex max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:px-8">
            <Sidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
