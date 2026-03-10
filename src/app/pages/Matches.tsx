import { Plus, Search, Calendar as CalendarIcon, MapPin, CheckCircle2 } from "lucide-react";

export function Matches() {
  const matches = [
    {
      id: 1,
      date: "Hoy",
      time: "14:00",
      location: "Cancha Principal ETITC",
      team1: "Ingeniería A",
      team2: "Sistemas B",
      status: "Pendiente",
      sport: "Fútbol",
      sportColor: "bg-green-100 text-green-800",
      score1: null,
      score2: null,
    },
    {
      id: 2,
      date: "Mañana",
      time: "16:00",
      location: "Cancha Múltiple",
      team1: "Mecatrónica",
      team2: "Eléctrica",
      status: "Pendiente",
      sport: "Baloncesto",
      sportColor: "bg-orange-100 text-orange-800",
      score1: null,
      score2: null,
    },
    {
      id: 3,
      date: "10 Mar 2026",
      time: "10:00",
      location: "Coliseo Cerrado",
      team1: "Industrial",
      team2: "Docentes",
      status: "Finalizado",
      sport: "Voleibol",
      sportColor: "bg-blue-100 text-blue-800",
      score1: 2,
      score2: 1,
    },
    {
      id: 4,
      date: "10 Mar 2026",
      time: "12:00",
      location: "Salón de Juegos",
      team1: "Andrés Silva",
      team2: "Carlos Gómez",
      status: "Finalizado",
      sport: "Tenis de Mesa",
      sportColor: "bg-red-100 text-red-800",
      score1: 3,
      score2: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Partidos</h1>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Programar Partido
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
            placeholder="Buscar por equipo, fecha..."
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
            <option>Pendientes</option>
            <option>Finalizados</option>
            <option>En juego</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {matches.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1.5" />
                  {m.date} - {m.time}
                </div>
                <div className="hidden sm:flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {m.location}
                </div>
              </div>
              <div className="flex space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium uppercase ${m.sportColor}`}
                >
                  {m.sport}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    m.status === "Finalizado"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {m.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                {/* Equipo Local */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-gray-400">
                      {m.team1.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 text-center">
                    {m.team1}
                  </span>
                </div>

                {/* Marcador */}
                <div className="flex flex-col items-center justify-center flex-shrink-0 px-8">
                  {m.status === "Finalizado" ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl font-black text-gray-900">
                        {m.score1}
                      </span>
                      <span className="text-gray-400 font-medium">-</span>
                      <span className="text-4xl font-black text-gray-900">
                        {m.score2}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-300">
                        VS
                      </span>
                    </div>
                  )}
                  {m.status === "Pendiente" && (
                    <button className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      Registrar Resultado
                    </button>
                  )}
                  {m.status === "Finalizado" && (
                    <div className="mt-3 flex items-center text-sm text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Resultado Oficial
                    </div>
                  )}
                </div>

                {/* Equipo Visitante */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-gray-400">
                      {m.team2.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 text-center">
                    {m.team2}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}