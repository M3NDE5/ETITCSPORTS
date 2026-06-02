"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Shield, Users, X, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "../components/ui/dialog";
import { db, getTournaments } from "../firebase";
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";

interface Player {
  name: string;
  number: number;
  isCaptain: boolean;
}

interface Team {
  id: string;
  name: string;
  sport: string;
  captain: string;
  players: Player[];
  tournament: string;
  color: string;
}

interface TournamentOption {
  id: string;
  name: string;
}

const SPORTS = ["Microfútbol", "Baloncesto", "Voleibol", "Tenis de Mesa"];

const SPORT_COLORS: { [key: string]: string } = {
  "Microfútbol": "bg-green-100 text-green-800",
  "Baloncesto": "bg-orange-100 text-orange-800",
  "Voleibol": "bg-blue-100 text-blue-800",
  "Tenis de Mesa": "bg-red-100 text-red-800",
};

export function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<TournamentOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("Todos los deportes");
  const [selectedTournament, setSelectedTournament] = useState("Todos los torneos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    sport: "Microfútbol",
    tournament: "",
    players: [{ name: "", number: 1, isCaptain: true }],
  });

  // Cargar equipos y torneos de Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar equipos
        const q = query(collection(db, "teams"), orderBy("name"));
        const querySnapshot = await getDocs(q);
        const loadedTeams: Team[] = [];
        
        querySnapshot.forEach((doc) => {
          loadedTeams.push({
            id: doc.id,
            ...(doc.data() as Omit<Team, 'id'>)
          });
        });
        
        setTeams(loadedTeams);

        // Cargar torneos
        const tournamentsData = await getTournaments();
        const formattedTournaments = tournamentsData.map(t => ({
          id: t.id,
          name: t.name
        }));
        setTournaments(formattedTournaments);

        // Establecer el primer torneo como seleccionado por defecto
        if (formattedTournaments.length > 0) {
          setFormData(prev => ({
            ...prev,
            tournament: formattedTournaments[0].id
          }));
        }
      } catch (error) {
        console.log("Usando datos locales - Firebase no disponible");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addPlayer = () => {
    setFormData({
      ...formData,
      players: [
        ...formData.players,
        { name: "", number: Math.max(...formData.players.map(p => p.number), 0) + 1, isCaptain: false }
      ]
    });
  };

  const removePlayer = (index: number) => {
    if (formData.players.length > 1) {
      setFormData({
        ...formData,
        players: formData.players.filter((_, i) => i !== index)
      });
    }
  };

  const updatePlayer = (index: number, field: string, value: any) => {
    const newPlayers = [...formData.players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    
    // Si se marca como capitán, desmarcar otros
    if (field === "isCaptain" && value) {
      newPlayers.forEach((p, i) => {
        if (i !== index) p.isCaptain = false;
      });
    }
    
    setFormData({ ...formData, players: newPlayers });
  };

  const handleSubmit = async () => {
    if (!formData.name || formData.players.some(p => !p.name)) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    const captain = formData.players.find(p => p.isCaptain);
    if (!captain) {
      alert("Debes seleccionar un capitán");
      return;
    }

    try {
      await addDoc(collection(db, "teams"), {
        name: formData.name,
        sport: formData.sport,
        captain: captain.name,
        players: formData.players,
        tournament: formData.tournament,
        color: SPORT_COLORS[formData.sport],
        createdAt: new Date()
      });

      setFormData({
        name: "",
        sport: "Microfútbol",
        tournament: tournaments.length > 0 ? tournaments[0].id : "",
        players: [{ name: "", number: 1, isCaptain: true }],
      });
      setIsDialogOpen(false);

      // Recargar equipos
      const q = query(collection(db, "teams"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      const loadedTeams: Team[] = [];
      querySnapshot.forEach((doc) => {
        loadedTeams.push({
          id: doc.id,
          ...(doc.data() as Omit<Team, 'id'>)
        });
      });
      setTeams(loadedTeams);
    } catch (error) {
      console.error("Error al crear equipo:", error);
      alert("Error al crear el equipo");
    }
  };

  const deleteTeam = async (teamId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este equipo?")) {
      try {
        await deleteDoc(doc(db, "teams", teamId));
        setTeams(teams.filter(t => t.id !== teamId));
      } catch (error) {
        console.error("Error al eliminar equipo:", error);
        alert("Error al eliminar el equipo");
      }
    }
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === "Todos los deportes" || team.sport === selectedSport;
    const matchesTournament = selectedTournament === "Todos los torneos" || team.tournament === selectedTournament;
    return matchesSearch && matchesSport && matchesTournament;
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Equipos</h1>
        <div className="mt-4 sm:mt-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                <Plus className="w-5 h-5 mr-2" />
                Crear Equipo
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Equipo</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Equipo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Ej: Ingeniería A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deporte
                    </label>
                    <select
                      value={formData.sport}
                      onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      {SPORTS.map(sport => (
                        <option key={sport} value={sport}>{sport}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Torneo
                    </label>
                    <select
                      value={formData.tournament}
                      onChange={(e) => setFormData({ ...formData, tournament: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      {tournaments.length === 0 ? (
                        <option>No hay torneos disponibles</option>
                      ) : (
                        tournaments.map(tournament => (
                          <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Jugadores ({formData.players.length})
                    </label>
                    <button
                      onClick={addPlayer}
                      className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      + Agregar Jugador
                    </button>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {formData.players.map((player, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={player.name}
                            onChange={(e) => updatePlayer(index, "name", e.target.value)}
                            placeholder="Nombre del jugador"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            value={player.number}
                            onChange={(e) => updatePlayer(index, "number", parseInt(e.target.value))}
                            placeholder="Dorsal"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                          />
                        </div>
                        <label className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={player.isCaptain}
                            onChange={(e) => updatePlayer(index, "isCaptain", e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">Capitán</span>
                        </label>
                        {formData.players.length > 1 && (
                          <button
                            onClick={() => removePlayer(index)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Crear Equipo
                  </button>
                  <DialogClose asChild>
                    <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                      Cancelar
                    </button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
            placeholder="Buscar equipos..."
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
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
          <select
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
            className="block px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="Todos los torneos">Todos los torneos</option>
            {tournaments.map(tournament => (
              <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando equipos...</p>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No hay equipos que coincidan con los filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 text-center"
            >
              <div className="mx-auto h-20 w-20 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-100 mb-4">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{team.name}</h3>
              <div className="flex justify-center space-x-2 mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide ${SPORT_COLORS[team.sport]}`}>
                  {team.sport}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                <div className="flex justify-center text-center">
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-xs text-gray-500 mb-1">Capitán</span>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {team.captain}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    {team.players.length} jugadores
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 border-t border-gray-100 pt-4">
                <Dialog open={isViewDialogOpen && selectedTeam?.id === team.id} onOpenChange={(open) => {
                  if (open) {
                    setSelectedTeam(team);
                    setIsViewDialogOpen(true);
                  } else {
                    setIsViewDialogOpen(false);
                  }
                }}>
                  <DialogTrigger asChild>
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium">
                      <Eye className="h-4 w-4" />
                      Ver
                    </button>
                  </DialogTrigger>
                  {selectedTeam?.id === team.id && (
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Jugadores de {team.name}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-3">
                        {team.players.map((player, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{player.name}</p>
                              <p className="text-sm text-gray-500">Dorsal: {player.number}</p>
                            </div>
                            {player.isCaptain && (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                Capitán
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
                <button
                  onClick={() => deleteTeam(team.id)}
                  className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}