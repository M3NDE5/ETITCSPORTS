import { Link, Outlet, useLocation } from "react-router";
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

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

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
            />
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