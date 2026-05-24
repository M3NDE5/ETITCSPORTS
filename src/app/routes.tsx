import { createBrowserRouter, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Tournaments } from "./pages/Tournaments";
import { Teams } from "./pages/Teams";
import { Players } from "./pages/Players";
import { Matches } from "./pages/Matches";
import { Standings } from "./pages/Standings";
import { Brackets } from "./pages/Brackets";

// Componente para proteger rutas
function ProtectedRoute({ Component }: { Component: React.ComponentType }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
}

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: () => <ProtectedRoute Component={Dashboard} /> },
      { path: "tournaments", Component: () => <ProtectedRoute Component={Tournaments} /> },
      { path: "teams", Component: () => <ProtectedRoute Component={Teams} /> },
      { path: "players", Component: () => <ProtectedRoute Component={Players} /> },
      { path: "matches", Component: () => <ProtectedRoute Component={Matches} /> },
      { path: "standings", Component: () => <ProtectedRoute Component={Standings} /> },
      { path: "brackets", Component: () => <ProtectedRoute Component={Brackets} /> },
      { path: "*", element: <Navigate to="/" replace /> }
    ],
  },
]);