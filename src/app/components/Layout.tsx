import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Trophy,
  Users,
  UserSquare2,
  CalendarDays,
  ListOrdered,
  GitMerge,
  LogOut,
  Menu,
  Bell,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Torneos", href: "/tournaments", icon: Trophy },
  { name: "Equipos", href: "/teams", icon: Users },
  { name: "Jugadores", href: "/players", icon: UserSquare2 },
  { name: "Partidos", href: "/matches", icon: CalendarDays },
  { name: "Posiciones", href: "/standings", icon: ListOrdered },
  { name: "Llaves", href: "/brackets", icon: GitMerge },
];

// Datos globales para búsqueda
const tournaments = [
  { id: 1, name: "Torneo Interfacultades 2026-I", sport: "Fútbol", type: "tournament", href: "/tournaments" },
  { id: 2, name: "Copa ETITC Relámpago", sport: "Baloncesto", type: "tournament", href: "/tournaments" },
  { id: 3, name: "Torneo de Novatos", sport: "Voleibol", type: "tournament", href: "/tournaments" },
  { id: 4, name: "Campeonato Abierto", sport: "Tenis de Mesa", type: "tournament", href: "/tournaments" },
];

const teams = [
  { id: 1, name: "Ingeniería A", sport: "Fútbol", type: "team", href: "/teams" },
  { id: 2, name: "Sistemas B", sport: "Fútbol", type: "team", href: "/teams" },
  { id: 3, name: "Mecatrónica", sport: "Baloncesto", type: "team", href: "/teams" },
  { id: 4, name: "Eléctrica", sport: "Voleibol", type: "team", href: "/teams" },
  { id: 5, name: "Industrial", sport: "Baloncesto", type: "team", href: "/teams" },
  { id: 6, name: "Docentes TM", sport: "Tenis de Mesa", type: "team", href: "/teams" },
];

const players = [
  { id: 1, name: "Carlos Gómez", sport: "Fútbol", team: "Ingeniería A", type: "player", href: "/players" },
  { id: 2, name: "Andrés Silva", sport: "Fútbol", team: "Sistemas B", type: "player", href: "/players" },
  { id: 3, name: "Luis Martínez", sport: "Baloncesto", team: "Mecatrónica", type: "player", href: "/players" },
  { id: 4, name: "Juan Pérez", sport: "Voleibol", team: "Eléctrica", type: "player", href: "/players" },
  { id: 5, name: "Pedro Sánchez", sport: "Baloncesto", team: "Industrial", type: "player", href: "/players" },
  { id: 6, name: "Prof. Ramírez", sport: "Tenis de Mesa", team: "Docentes TM", type: "player", href: "/players" },
  { id: 7, name: "Felipe Osorio", sport: "Fútbol", team: "Ingeniería A", type: "player", href: "/players" },
  { id: 8, name: "Miguel Rojas", sport: "Fútbol", team: "Sistemas B", type: "player", href: "/players" },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Buscar en todos los datos
  const searchResults = searchQuery.trim() === "" ? [] : [
    ...tournaments.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.sport.toLowerCase().includes(searchQuery.toLowerCase())),
    ...teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.sport.toLowerCase().includes(searchQuery.toLowerCase())),
    ...players.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sport.toLowerCase().includes(searchQuery.toLowerCase()) || p.team.toLowerCase().includes(searchQuery.toLowerCase()))
  ].slice(0, 8); // Limitar a 8 resultados

  const handleSearchNavigate = (result: any) => {
    navigate(result.href);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const getResultIcon = (type: string) => {
    switch(type) {
      case "tournament":
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case "team":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "player":
        return <UserSquare2 className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getResultLabel = (type: string) => {
    switch(type) {
      case "tournament": return "Torneo";
      case "team": return "Equipo";
      case "player": return "Jugador";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-green-600">
          <Trophy className="w-6 h-6 text-white" />
          <span className="ml-3 font-bold text-white tracking-wide truncate">
            ETITC Sports
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={`flex-shrink-0 w-5 h-5 mr-3 ${
                    isActive ? "text-green-600" : "text-gray-400"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-8 mt-8 border-t border-gray-200">
            <Link
              to="/login"
              className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <LogOut className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400" />
              Cerrar Sesión
            </Link>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-30">
          <div className="flex items-center flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 mr-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            
          <div className="hidden sm:flex max-w-md w-full relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
              placeholder="Buscar torneo, equipo, jugador o deporte..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.trim() !== "");
              }}
              onFocus={() => searchQuery.trim() !== "" && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />
            
            {/* Dropdown de resultados */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSearchNavigate(result)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3 transition-colors"
                  >
                    {getResultIcon(result.type)}
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-gray-900">{result.name}</p>
                      <p className="text-xs text-gray-500">
                        {result.type === "tournament" && `${result.sport}`}
                        {result.type === "team" && `${result.sport}`}
                        {result.type === "player" && `${result.sport} • ${result.team}`}
                        {' | '}{getResultLabel(result.type)}
                      </p>
                    </div>
                  </button>
                ))}
                {searchResults.length === 0 && searchQuery.trim() !== "" && (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    No se encontraron resultados
                  </div>
                )}
              </div>
            )}
          </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              <Bell className="w-6 h-6" />
            </button>
            
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full border border-gray-200"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar"
              />
              <span className="hidden sm:block ml-3 text-sm font-medium text-gray-700">
                Admin ETITC
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}