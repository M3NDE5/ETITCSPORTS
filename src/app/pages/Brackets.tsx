import { useState, useEffect } from "react";
import { GitMerge } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { getTournaments } from "../firebase";

interface Tournament {
  id: string;
  name: string;
  sport: string;
  teams: number;
  modality?: string;
  groups?: number;
}

export function Brackets() {
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Cargar todos los torneos
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const tournaments = await getTournaments();
        setAllTournaments(tournaments);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando torneos:", error);
        setLoading(false);
      }
    };
    fetchTournaments();
  }, []);

  // Calcular deportes únicos
  const sports = Array.from(new Set(allTournaments.map(t => t.sport))).sort();

  // Filtrar torneos por deporte seleccionado
  const filteredTournaments = selectedSport 
    ? allTournaments.filter(t => t.sport === selectedSport)
    : [];

  // Obtener torneo seleccionado
  const selectedTournament = selectedTournamentId 
    ? allTournaments.find(t => t.id === selectedTournamentId) 
    : null;

  // Calcular fases dinámicamente basado en número de equipos
  const calculatePhases = (teamCount: number) => {
    const phases = [];
    let teams = teamCount;

    // Redondear a la potencia de 2 más cercana
    let roundedTeams = 1;
    while (roundedTeams < teams) {
      roundedTeams *= 2;
    }

    // Generar fases según cantidad de equipos
    if (roundedTeams === 2) {
      phases.push({ name: "Gran Final", teams: 2, actualTeams: teams, bracket: "final" });
    } else if (roundedTeams === 4) {
      phases.push({ name: "Cuartos de Final", teams: 4, actualTeams: teams, bracket: "quarters" });
      phases.push({ name: "Semifinales", teams: 2, actualTeams: 2, bracket: "semis" });
      phases.push({ name: "Gran Final", teams: 2, actualTeams: 2, bracket: "final" });
    } else if (roundedTeams === 8) {
      phases.push({ name: "8avos de Final", teams: 8, actualTeams: teams, bracket: "eighths" });
      phases.push({ name: "Cuartos de Final", teams: 4, actualTeams: 4, bracket: "quarters" });
      phases.push({ name: "Semifinales", teams: 2, actualTeams: 2, bracket: "semis" });
      phases.push({ name: "Gran Final", teams: 2, actualTeams: 2, bracket: "final" });
    } else if (roundedTeams === 16) {
      phases.push({ name: "16avos de Final", teams: 16, actualTeams: teams, bracket: "sixteenths" });
      phases.push({ name: "8avos de Final", teams: 8, actualTeams: 8, bracket: "eighths" });
      phases.push({ name: "Cuartos de Final", teams: 4, actualTeams: 4, bracket: "quarters" });
      phases.push({ name: "Semifinales", teams: 2, actualTeams: 2, bracket: "semis" });
      phases.push({ name: "Gran Final", teams: 2, actualTeams: 2, bracket: "final" });
    } else if (roundedTeams === 32) {
      phases.push({ name: "32avos de Final", teams: 32, actualTeams: teams, bracket: "thirtytwos" });
      phases.push({ name: "16avos de Final", teams: 16, actualTeams: 16, bracket: "sixteenths" });
      phases.push({ name: "8avos de Final", teams: 8, actualTeams: 8, bracket: "eighths" });
      phases.push({ name: "Cuartos de Final", teams: 4, actualTeams: 4, bracket: "quarters" });
      phases.push({ name: "Semifinales", teams: 2, actualTeams: 2, bracket: "semis" });
      phases.push({ name: "Gran Final", teams: 2, actualTeams: 2, bracket: "final" });
    }

    return phases;
  };

  const phases = selectedTournament ? calculatePhases(selectedTournament.teams) : [];

  return (
    <div className="space-y-6 min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Llaves del Torneo</h1>
          <p className="mt-1 text-sm text-gray-500">Torneo Interfacultades 2026-I - Fase Final</p>
        </div>
      </div>

      {/* Selectores de Deporte y Torneo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Deporte</label>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar deporte" />
              </SelectTrigger>
              <SelectContent>
                {sports.map(sport => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Torneo</label>
            <Select value={selectedTournamentId} onValueChange={setSelectedTournamentId} disabled={!selectedSport}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar torneo" />
              </SelectTrigger>
              <SelectContent>
                {filteredTournaments.map(tournament => (
                  <SelectItem key={tournament.id} value={tournament.id}>{tournament.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 overflow-x-auto relative min-w-[800px]">
        {!selectedTournament ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>Selecciona un torneo para ver las llaves</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              <p><strong>{selectedTournament.name}</strong> - {selectedTournament.teams} equipos</p>
            </div>
            
            {/* Dynamic Bracket representation */}
            <div className="flex h-full py-8 px-4 justify-between min-w-max w-full">
              {phases.map((phase, phaseIndex) => (
                <div key={phaseIndex}>
                  {/* Phase Column */}
                  <div className={`flex flex-col justify-around w-64 ${phaseIndex > 0 ? 'space-y-12' : 'space-y-4'}`}>
                    <h3 className="text-center font-bold text-gray-500 mb-4">{phase.name}</h3>
                    
                    {phase.name === "Gran Final" ? (
                      <div className="flex flex-col justify-center">
                        <div className="relative">
                          <div className="bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-400 rounded-xl p-3 flex flex-col shadow-lg">
                            <div className="flex justify-center items-center py-3 px-3 border-b border-yellow-100 text-gray-400 italic">
                              <span>Ganador Semifinal 1</span>
                            </div>
                            <div className="flex justify-center items-center py-3 px-3 text-gray-400 italic">
                              <span>Ganador Semifinal 2</span>
                            </div>
                          </div>
                          {phaseIndex < phases.length - 1 && (
                            <div className="absolute left-[-2rem] top-1/2 w-8 border-b-2 border-gray-300"></div>
                          )}
                        </div>
                        
                        <div className="mt-8 flex justify-center">
                          <div className="bg-yellow-100 p-4 rounded-full border-4 border-yellow-400 shadow-inner">
                            <GitMerge className="w-12 h-12 text-yellow-500" />
                          </div>
                        </div>
                        <p className="text-center mt-4 text-sm font-medium text-gray-500">Campeón por definir</p>
                      </div>
                    ) : (
                      Array.from({ length: Math.ceil(phase.actualTeams / 2) }).map((_, matchIndex) => (
                        <div key={matchIndex} className="relative">
                          <div className={`bg-gray-50 border border-gray-200 rounded-lg p-2 flex flex-col shadow-sm ${phaseIndex === phases.length - 1 ? 'border-2 border-green-500' : ''}`}>
                            <div className="flex justify-between items-center py-2 px-3 border-b border-gray-200 font-bold text-gray-900">
                              <span>Equipo {matchIndex * 2 + 1}</span>
                              <span>-</span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 text-gray-500">
                              <span>Equipo {matchIndex * 2 + 2}</span>
                              <span>-</span>
                            </div>
                          </div>
                          <div className="absolute right-[-1rem] top-1/2 w-4 border-b-2 border-green-500"></div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Connectors between phases */}
                  {phaseIndex < phases.length - 1 && (
                    <div className="flex flex-col justify-around w-8 relative">
                      {phase.name !== "Semifinales" && (
                        <>
                          <div className="absolute right-0 top-1/4 bottom-3/4 w-8 border-t-2 border-r-2 border-b-2 border-green-500 rounded-r-lg"></div>
                          <div className="absolute right-0 top-1/2 w-8 border-b-2 border-green-500"></div>
                        </>
                      )}
                      {phase.name === "Semifinales" && (
                        <div className="absolute right-0 top-1/2 w-8 border-b-2 border-gray-300"></div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}