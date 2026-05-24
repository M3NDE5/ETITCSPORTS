import { useEffect, useState } from "react";
import { Trophy, Users, CalendarDays, Activity } from "lucide-react";
import { getStatsByDeporte, getUpcomingMatchesByDeporte, getStandingsByDeporte } from "../firebase";

const DEPORTES = [
  { id: "microfutbol", nombre: "Microfútbol"},
  { id: "baloncesto", nombre: "Baloncesto"},
  { id: "voleibol", nombre: "Voleibol"},
  { id: "tenis-de-mesa", nombre: "Tenis de Mesa"},
];

interface DeporteStat {
  deporte: string;
  stats: {
    activeTournaments: number;
    totalTeams: number;
    nextMatches: number;
  };
  matches: any[];
  standings: any[];
  loading: boolean;
}

export function Dashboard() {
  const [selectedDeporte, setSelectedDeporte] = useState("microfutbol");
  const [deportesData, setDeportesData] = useState<{ [key: string]: DeporteStat }>({});
  const [loadingDeporte, setLoadingDeporte] = useState(true);

  // Cargar datos de todos los deportes
  useEffect(() => {
    const loadAllData = async () => {
      const newDeportesData: { [key: string]: DeporteStat } = {};

      for (const deporte of DEPORTES) {
        try {
          const stats = await getStatsByDeporte(deporte.nombre);
          const matches = await getUpcomingMatchesByDeporte(deporte.nombre, 3);
          const standings = await getStandingsByDeporte(deporte.nombre);

          newDeportesData[deporte.id] = {
            deporte: deporte.id,
            stats,
            matches,
            standings,
            loading: false
          };
        } catch (error) {
          console.error(`Error al cargar ${deporte.nombre}:`, error);
          newDeportesData[deporte.id] = {
            deporte: deporte.id,
            stats: { activeTournaments: 0, totalTeams: 0, nextMatches: 0 },
            matches: [],
            standings: [],
            loading: false
          };
        }
      }

      setDeportesData(newDeportesData);
      setLoadingDeporte(false);
    };

    loadAllData();
  }, []);

  const getDeporteInfo = (deporteId: string) => {
    return DEPORTES.find(d => d.id === deporteId);
  };

  const currentDeporte = getDeporteInfo(selectedDeporte);
  const currentData = deportesData[selectedDeporte] || {
    deporte: selectedDeporte,
    stats: { activeTournaments: 0, totalTeams: 0, nextMatches: 0 },
    matches: [],
    standings: [],
    loading: true
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard de Deportes</h1>
      </div>

      {/* Navegación de Deportes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-0 overflow-hidden">
        <div className="flex flex-wrap gap-0 sm:gap-2 p-3 sm:p-4">
          {DEPORTES.map((deporte) => (
            <button
              key={deporte.id}
              onClick={() => setSelectedDeporte(deporte.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedDeporte === deporte.id
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="hidden sm:inline">{deporte.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del Deporte Seleccionado */}
      {currentDeporte && (
        <div className="space-y-6">
          {/* Header del Deporte */}
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-gray-900">{currentDeporte.nombre}</h2>
          </div>

          {/* Stats por Deporte */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Trophy className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Torneos Activos
                    </dt>
                    <dd>
                      <div className="text-2xl font-bold text-gray-900">
                        {currentData.loading ? "-" : currentData.stats.activeTournaments}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Equipos
                    </dt>
                    <dd>
                      <div className="text-2xl font-bold text-gray-900">
                        {currentData.loading ? "-" : currentData.stats.totalTeams}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarDays className="h-6 w-6 text-purple-600" aria-hidden="true" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Próximos Partidos
                    </dt>
                    <dd>
                      <div className="text-2xl font-bold text-gray-900">
                        {currentData.loading ? "-" : currentData.stats.nextMatches}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Próximos Partidos y Tabla */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Próximos Partidos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Próximos Partidos
              </h3>
              <div className="space-y-4">
                {loadingDeporte ? (
                  <div className="text-center py-8 text-gray-500">Cargando partidos...</div>
                ) : currentData.matches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No hay partidos próximos</div>
                ) : (
                  currentData.matches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-center min-w-max">
                          <div className="text-sm font-bold text-gray-900">
                            {match.hora || match.time || "Por definir"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {match.fecha || "Fecha"}
                          </div>
                        </div>
                        <div className="h-8 w-px bg-gray-300"></div>
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900 text-sm">
                              {match.equipo1 || match.team1 || "Equipo 1"}
                            </span>
                            <span className="text-xs text-gray-500 font-bold">vs</span>
                            <span className="font-medium text-gray-900 text-sm">
                              {match.equipo2 || match.team2 || "Equipo 2"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm hidden sm:block whitespace-nowrap">
                        {match.cancha || "Cancha"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tabla de Posiciones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tabla de Posiciones
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pos
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Equipo
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PJ
                      </th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pts
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadingDeporte ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-2 text-center text-gray-500">
                          Cargando...
                        </td>
                      </tr>
                    ) : currentData.standings.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-2 text-center text-gray-500">
                          No hay datos
                        </td>
                      </tr>
                    ) : (
                      currentData.standings.map((team, index) => (
                        <tr key={team.id}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {team.equipo || team.nombre || team.team || "Equipo"}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                            {team.pj || team.partidosJugados || "-"}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                            {team.puntos || team.pts || 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}