import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { getStandings, getTournaments } from "../firebase";

interface Tournament {
  id: string;
  name: string;
  sport: string;
  modality?: string;
  groups?: number;
}

interface Standing {
  id: string;
  team: string;
  p: number;
  w: number;
  d: number;
  l: number;
  f: number;
  a: number;
  gd: string;
  trend: "up" | "down" | "same";
}

const defaultStandings: Standing[] = [
  { id: "1", team: "Ingeniería A", p: 13, w: 4, d: 1, l: 0, f: 12, a: 4, gd: "+8", trend: "up" },
  { id: "2", team: "Sistemas B", p: 12, w: 4, d: 0, l: 1, f: 10, a: 5, gd: "+5", trend: "same" },
  { id: "3", team: "Mecatrónica", p: 9, w: 2, d: 3, l: 0, f: 8, a: 6, gd: "+2", trend: "up" },
  { id: "4", team: "Eléctrica", p: 7, w: 2, d: 1, l: 2, f: 5, a: 6, gd: "-1", trend: "down" },
  { id: "5", team: "Industrial", p: 4, w: 1, d: 1, l: 3, f: 4, a: 8, gd: "-4", trend: "down" },
];

export function Standings() {
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("Grupo A");
  const [standings, setStandings] = useState<Standing[]>(defaultStandings);
  const [loading, setLoading] = useState(true);

  const selectedTournament = allTournaments.find((t) => t.id === selectedTournamentId);

  const sports = Array.from(new Set(allTournaments.map((t) => t.sport))).sort();
  
  const filteredTournaments = selectedSport
    ? allTournaments.filter((t) => t.sport === selectedSport)
    : [];

  const groupOptions = () => {
    const count = selectedTournament?.groups || 1;
    return Array.from({ length: count }, (_, index) => `Grupo ${String.fromCharCode(65 + index)}`);
  };

  const sectionLabel = () => {
    if (!selectedTournament) return "Posiciones";
    if (selectedTournament.modality === "Eliminatoria directa") return "Fase Eliminatoria";
    return selectedGroup ? `${selectedGroup} - Fase de Grupos` : "Fase de Grupos";
  };

  useEffect(() => {
    const loadTournaments = async () => {
      setLoading(true);
      try {
        const data = await getTournaments();
        const formatted = data.map((t) => ({
          id: t.id,
          name: t.name,
          sport: t.sport || "Sin deporte",
          modality: t.modality || "Grupos + Eliminatoria",
          groups: typeof t.groups === "number" ? t.groups : 1,
        }));
        setAllTournaments(formatted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTournaments();
  }, []);

  useEffect(() => {
    const loadStandings = async () => {
      if (!selectedTournamentId) return;
      setLoading(true);
      try {
        const group = selectedTournament?.modality?.includes("Grupos") ? selectedGroup : undefined;
        const data = await getStandings(selectedTournamentId, group);
        if (data.length > 0) {
          setStandings(data.map((row: any, index: number) => ({
            id: row.id,
            team: row.team || `Equipo ${index + 1}`,
            p: row.puntos ?? row.p ?? 0,
            w: row.ganados ?? row.w ?? 0,
            d: row.empatados ?? row.d ?? 0,
            l: row.perdidos ?? row.l ?? 0,
            f: row.gf ?? row.f ?? 0,
            a: row.gc ?? row.a ?? 0,
            gd: row.dg ?? row.gd ?? "+0",
            trend: row.trend || "same",
          })));
        } else {
          setStandings(defaultStandings);
        }
      } catch (error) {
        console.error(error);
        setStandings(defaultStandings);
      } finally {
        setLoading(false);
      }
    };

    loadStandings();
  }, [selectedTournamentId, selectedGroup, selectedTournament]);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tabla de Posiciones</h1>
          <p className="mt-1 text-sm text-gray-500">{selectedTournament ? `${selectedTournament.name} - ${sectionLabel()}` : "Selecciona un deporte y torneo para ver las posiciones"}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-3">
          <label htmlFor="sport-select" className="sr-only">Seleccionar deporte</label>
          <select
            id="sport-select"
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm"
            value={selectedSport}
            onChange={(e) => {
              const sport = e.target.value;
              setSelectedSport(sport);
              setSelectedTournamentId("");
              setSelectedGroup("Grupo A");
            }}
          >
            <option value="">Selecciona deporte</option>
            {sports.map((sport) => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>
          <label htmlFor="tournament-select" className="sr-only">Seleccionar torneo</label>
          <select
            id="tournament-select"
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm"
            value={selectedTournamentId}
            onChange={(e) => {
              setSelectedTournamentId(e.target.value);
              setSelectedGroup("Grupo A");
            }}
            disabled={filteredTournaments.length === 0}
          >
            <option value="">Selecciona torneo</option>
            {filteredTournaments.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          {selectedTournament && selectedTournament.modality?.includes("Grupos") && (
            <select
              id="group-select"
              className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              {groupOptions().map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipo
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Partidos Jugados">
                  PJ
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Partidos Ganados">
                  PG
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Partidos Empatados">
                  PE
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Partidos Perdidos">
                  PP
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Goles a Favor">
                  GF
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Goles en Contra">
                  GC
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" title="Diferencia de Goles">
                  DG
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider" title="Puntos">
                  PTS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">Cargando posiciones...</td>
                </tr>
              ) : standings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">No hay datos de posiciones para este torneo.</td>
                </tr>
              ) : (
                standings.map((team, index) => (
                  <tr key={team.id} className={index < 2 ? "bg-green-50/50" : "hover:bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? "bg-green-600 text-white" : "text-gray-900"}`}>
                          {index + 1}
                        </span>
                        {team.trend === "up" && <TrendingUp className="ml-2 w-4 h-4 text-green-500" />}
                        {team.trend === "down" && <TrendingDown className="ml-2 w-4 h-4 text-red-500" />}
                        {team.trend === "same" && <Minus className="ml-2 w-4 h-4 text-gray-400" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                          {index === 0 ? <Trophy className="w-4 h-4 text-green-600" /> : <span className="text-xs font-bold text-gray-400">{team.team.substring(0, 2).toUpperCase()}</span>}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{team.team}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.w + team.d + team.l}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.w}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.d}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.l}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.f}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{team.a}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 text-center">{team.gd}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900 text-center">{team.p}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap gap-4 text-sm text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-200 mr-2"></div>
          <span>Clasifican a cuartos de final (1ro y 2do)</span>
        </div>
        <div className="flex items-center ml-auto space-x-4">
          <span><strong className="text-gray-700">PJ:</strong> Partidos Jugados</span>
          <span><strong className="text-gray-700">PG:</strong> Partidos Ganados</span>
          <span><strong className="text-gray-700">PE:</strong> Partidos Empatados</span>
          <span><strong className="text-gray-700">PP:</strong> Partidos Perdidos</span>
          <span><strong className="text-gray-700">DG:</strong> Diferencia de Goles</span>
        </div>
      </div>
    </div>
  );
}