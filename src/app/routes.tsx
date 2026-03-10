import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Tournaments } from "./pages/Tournaments";
import { Teams } from "./pages/Teams";
import { Players } from "./pages/Players";
import { Matches } from "./pages/Matches";
import { Standings } from "./pages/Standings";
import { Brackets } from "./pages/Brackets";

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "tournaments", Component: Tournaments },
      { path: "teams", Component: Teams },
      { path: "players", Component: Players },
      { path: "matches", Component: Matches },
      { path: "standings", Component: Standings },
      { path: "brackets", Component: Brackets },
      { path: "*", element: <Navigate to="/" replace /> }
    ],
  },
]);