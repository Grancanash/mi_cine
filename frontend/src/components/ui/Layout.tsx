import Footer from "./Footer";
import Navbar from "./Navbar";
import type { ReactNode } from "react";

function Layout({ isLoggedIn, onLogout, children }: { isLoggedIn: boolean; onLogout: () => void; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* NAVBAR */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1">
        <div className="container mx-auto py-4">{children}</div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Layout;