"use client";

import { Search, User, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Player {
  name: string;
  number: number;
  isCaptain: boolean;
}

interface TeamData {
  name: string;
  sport: string;
  players: Player[];
}

interface DisplayPlayer {
  id: string;
  name: string;
  sport: string;
  number: number;
  team: string;
  isCaptain: boolean;
}

const SPORTS = ["Microfútbol", "Baloncesto", "Voleibol", "Tenis de Mesa"];

const SPORT_COLORS: { [key: string]: string } = {
  "Microfútbol": "bg-green-100 text-green-800",
  "Baloncesto": "bg-orange-100 text-orange-800",
  "Voleibol": "bg-blue-100 text-blue-800",
  "Tenis de Mesa": "bg-red-100 text-red-800",
};

export function Players() {
  const [players, setPlayers] = useState<DisplayPlayer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("Todos los deportes");
  const [loading, setLoading] = useState(true);

  // Cargar jugadores desde Firebase
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const q = query(collection(db, "teams"), orderBy("name"));
        const querySnapshot = await getDocs(q);
        const allPlayers: DisplayPlayer[] = [];

        querySnapshot.forEach((doc) => {
          const teamData = doc.data() as TeamData;
          if (teamData.players && Array.isArray(teamData.players)) {
            teamData.players.forEach((player) => {
              allPlayers.push({
                id: `${doc.id}-${player.number}`,
                name: player.name,
                sport: teamData.sport,
                number: player.number,
                team: teamData.name,
                isCaptain: player.isCaptain || false,
              });
            });
          }
        });

        // Ordenar alfabéticamente por nombre
        allPlayers.sort((a, b) => a.name.localeCompare(b.name));
        setPlayers(allPlayers);
      } catch (error) {
        console.error("Error al cargar jugadores:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === "Todos los deportes" || player.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Jugadores</h1>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
            <Filter className="w-5 h-5 mr-2 text-gray-500" />
            Filtros
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex w-full sm:w-auto flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
            placeholder="Buscar por nombre o equipo..."
          />
        </div>
        <div>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="block px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option>Todos los deportes</option>
            {SPORTS.map(sport => (
              <option key={sport} value={sport}>{sport}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Cargando jugadores...</p>
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">No hay jugadores que coincidan con los filtros</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Jugador
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Deporte
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dorsal
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Equipo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rol
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {player.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-md ${SPORT_COLORS[player.sport]}`}>
                        {player.sport}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        #{player.number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {player.team}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {player.isCaptain && (
                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-md bg-yellow-100 text-yellow-800">
                          Capitán
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}