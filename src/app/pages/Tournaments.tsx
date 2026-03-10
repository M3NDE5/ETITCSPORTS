import { Plus, Search, Calendar, Users, Trophy } from "lucide-react";

export function Tournaments() {
  const tournaments = [
    {
      id: 1,
      name: "Torneo Interfacultades 2026-I",
      status: "Activo",
      sport: "Fútbol",
      teams: 16,
      startDate: "15 Mar 2026",
      endDate: "30 Jun 2026",
      color: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      name: "Copa ETITC Relámpago",
      status: "Inscripciones",
      sport: "Baloncesto",
      teams: 8,
      startDate: "1 Abr 2026",
      endDate: "5 Abr 2026",
      color: "bg-orange-100 text-orange-800"
    },
    {
      id: 3,
      name: "Torneo de Novatos",
      status: "Activo",
      sport: "Voleibol",
      teams: 12,
      startDate: "1 Feb 2026",
      endDate: "15 May 2026",
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 4,
      name: "Campeonato Abierto",
      status: "Activo",
      sport: "Tenis de Mesa",
      teams: 32,
      startDate: "15 Mar 2026",
      endDate: "30 Abr 2026",
      color: "bg-red-100 text-red-800"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Torneos</h1>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Crear Torneo
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
            placeholder="Buscar torneos..."
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
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Inscripciones</option>
            <option>Finalizado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="p-5 flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                  <Trophy className="w-6 h-6" />
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    t.status === "Activo"
                      ? "bg-green-100 text-green-800"
                      : t.status === "Finalizado"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide mb-2 ${t.color}`}>
                {t.sport}
              </span>
              <div className="space-y-2 mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                  {t.teams} Equipos inscritos
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                  {t.startDate} - {t.endDate}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-200 rounded-b-xl flex justify-between items-center">
              <button className="text-sm font-medium text-green-600 hover:text-green-500">
                Ver detalles
              </button>
              <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}