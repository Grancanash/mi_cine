import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookies";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./pages/auth/LoginForm";
import TitlesPage from "./pages/TitlesPage";
import Layout from "./ui/Layout";
import TitlePage from "./pages/TitlePage";
import ActorsPage from "./pages/ActorsPage";
import ActorPage from "./pages/ActorPage";
import { CONFIG } from "../constants";

function AppInner() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        fetch(CONFIG.API_URL + "/session/", {
            method: "GET",
            credentials: "include",
        })
        .then(async (res) => {
            if (!res.ok) {
                setIsLoggedIn(false);
                return;
            }
            const data = await res.json();
            setIsLoggedIn(data.is_authenticated === true);
        })
        .catch((err) => {
            console.error("Error inicial de auth:", err);
            setIsLoggedIn(false);
        });
    }, []);

  const handleLogout = async () => {
    try {
      const csrftoken = getCookie("csrftoken");
      const res = await fetch(CONFIG.API_URL + "/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrftoken ?? "",
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Error logout:", data || res.status);
      }
    } catch (err) {
      console.error("Error logout:", err);
    } finally {
      // Da igual si el backend falla, limpiamos estado en frontend
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn === null) {
    return (
      <div className="p-4">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <Routes location={location}>
      {/* LOGIN: SIN NAVBAR NI FOOTER */}
      <Route
        path="/login"
        element={ isLoggedIn ? <Navigate to="/" replace /> : <LoginForm onLoggedIn={() => setIsLoggedIn(true)} /> }
      />

      {/* "PÁGINAS" (COMPONENTES) PROTEGIDAS CON LAYOUT COMPLETO */}
    
      {/* Home */}
      <Route
        path="/"
        element={
          <RequireAuth isLoggedIn={isLoggedIn}>
            <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
                <Dashboard />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Lista de títulos */}
      <Route
        path="/titles"
        element={
          <RequireAuth isLoggedIn={isLoggedIn}>
            <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
                <TitlesPage key={location.key} />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Nuevo título */}
      <Route
        path="/titles/new"
        element={
          <RequireAuth isLoggedIn={isLoggedIn}>
            <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
              <TitlePage />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Editar título */}
      <Route
        path="/titles/:id"
        element={
          <RequireAuth isLoggedIn={isLoggedIn}>
            <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
              <TitlePage />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Lista de actores */}
      <Route
        path="/actors"
        element={
          <RequireAuth isLoggedIn={isLoggedIn}>
            <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
                <ActorsPage key={location.key} />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Editar actor */}
      <Route
        path="/actors/:id"
        element={
          <RequireAuth isLoggedIn={isLoggedIn}>
            <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
              <ActorPage />
            </Layout>
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppInner;