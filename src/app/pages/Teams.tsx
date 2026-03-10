import { Plus, Search, Shield, Users } from "lucide-react";

export function Teams() {
  const teams = [
    { id: 1, name: "Ingeniería A", sport: "Fútbol", captain: "Carlos Gómez", players: 15, group: "Grupo A", color: "bg-green-100 text-green-800" },
    { id: 2, name: "Sistemas B", sport: "Fútbol", captain: "Andrés Silva", players: 14, group: "Grupo A", color: "bg-green-100 text-green-800" },
    { id: 3, name: "Mecatrónica", sport: "Baloncesto", captain: "Luis Martínez", players: 10, group: "Grupo B", color: "bg-orange-100 text-orange-800" },
    { id: 4, name: "Eléctrica", sport: "Voleibol", captain: "Juan Pérez", players: 12, group: "Grupo B", color: "bg-blue-100 text-blue-800" },
    { id: 5, name: "Industrial", sport: "Baloncesto", captain: "Pedro Sánchez", players: 12, group: "Grupo C", color: "bg-orange-100 text-orange-800" },
    { id: 6, name: "Docentes TM", sport: "Tenis de Mesa", captain: "Prof. Ramírez", players: 4, group: "Grupo C", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Equipos</h1>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Crear Equipo
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex w-full max-w-sm relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
            placeholder="Buscar equipos..."
          />
        </div>
        <div className="hidden sm:flex space-x-2">
          <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
            <option>Todos los deportes</option>
            <option>Fútbol</option>
            <option>Baloncesto</option>
            <option>Voleibol</option>
            <option>Tenis de Mesa</option>
          </select>
          <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
            <option>Todos los torneos</option>
            <option>Torneo Interfacultades 2026-I</option>
            <option>Copa ETITC Relámpago</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teams.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 text-center"
          >
            <div className="mx-auto h-20 w-20 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-100 mb-4">
              <Shield className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{t.name}</h3>
            <div className="flex justify-center space-x-2 mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide ${t.color}`}>
                {t.sport}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide bg-gray-100 text-gray-800">
                {t.group}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center px-2">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">Capitán</span>
                <span className="text-sm font-medium text-gray-900 truncate w-24">
                  {t.captain}
                </span>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">Plantilla</span>
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <Users className="h-4 w-4 mr-1 text-gray-400" />
                  {t.players}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}