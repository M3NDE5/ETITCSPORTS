import { useState, useEffect } from "react";
import { Plus, Search, Calendar as CalendarIcon, MapPin, CheckCircle2, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../components/ui/dialog";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

interface Tournament {
  id: string;
  name: string;
  sport: string;
}

interface Team {
  id: string;
  name: string;
  sport: string;
  tournament: string;
}

interface Match {
  id: string;
  tournamentId: string;
  tournamentName: string;
  sport: string;
  team1Id: string;
  team1: string;
  team2Id: string;
  team2: string;
  date: string;
  time: string;
  location: string;
  status: "Pendiente" | "En juego" | "Finalizado";
  score1: number | null;
  score2: number | null;
  createdAt?: Date;
}

const SPORT_COLORS: { [key: string]: string } = {
  "Microfútbol": "bg-green-100 text-green-800",
  "Baloncesto": "bg-orange-100 text-orange-800",
  "Voleibol": "bg-blue-100 text-blue-800",
  "Tenis de Mesa": "bg-red-100 text-red-800",
};

const CANCHAS = [
  "Cancha Principal ETITC",
  "Cancha Múltiple",
  "Coliseo Cerrado",
  "Salón de Juegos",
  "Cancha Auxiliar",
];

const emptyForm = {
  tournamentId: "",
  team1Id: "",
  team2Id: "",
  date: "",
  time: "",
  location: "",
};

export function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSport, setFilterSport] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [resultMatch, setResultMatch] = useState<Match | null>(null);
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");

  useEffect(() => {
    const loadAll = async () => {
      try {
        const tSnap = await getDocs(query(collection(db, "torneos"), orderBy("createdAt", "desc")));
        const tData: Tournament[] = tSnap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          sport: d.data().sport,
        }));
        setTournaments(tData);

        const eSnap = await getDocs(query(collection(db, "teams"), orderBy("name")));
        const eData: Team[] = eSnap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          sport: d.data().sport,
          tournament: d.data().tournament,
        }));
        setAllTeams(eData);

        await loadMatches();
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const loadMatches = async () => {
    const mSnap = await getDocs(
      query(collection(db, "matches"), orderBy("createdAt", "desc"))
    );
    const mData: Match[] = mSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Match, "id">),
    }));
    setMatches(mData);
  };

  const teamsForTournament = form.tournamentId
    ? allTeams.filter((t) => t.tournament === form.tournamentId)
    : [];

  const selectedTournament = tournaments.find((t) => t.id === form.tournamentId);

  const handleSaveMatch = async () => {
    const { tournamentId, team1Id, team2Id, date, time, location } = form;

    if (!tournamentId || !team1Id || !team2Id || !date || !time || !location) {
      alert("Por favor completa todos los campos");
      return;
    }
    if (team1Id === team2Id) {
      alert("Los dos equipos deben ser diferentes");
      return;
    }

    setSaving(true);
    try {
      const t1 = allTeams.find((t) => t.id === team1Id)!;
      const t2 = allTeams.find((t) => t.id === team2Id)!;
      const tournament = tournaments.find((t) => t.id === tournamentId)!;

      await addDoc(collection(db, "matches"), {
        tournamentId,
        tournamentName: tournament.name,
        sport: tournament.sport,
        team1Id,
        team1: t1.name,
        team2Id,
        team2: t2.name,
        date,
        time,
        location,
        status: "Pendiente",
        score1: null,
        score2: null,
        createdAt: new Date(),
      });

      setForm(emptyForm);
      setIsDialogOpen(false);
      await loadMatches();
    } catch (err) {
      console.error("Error al guardar partido:", err);
      alert("Error al guardar el partido");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveResult = async () => {
    if (!resultMatch) return;
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
      alert("Ingresa marcadores válidos (números ≥ 0)");
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, "matches", resultMatch.id), {
        score1: s1,
        score2: s2,
        status: "Finalizado",
      });
      setResultMatch(null);
      setScore1("");
      setScore2("");
      await loadMatches();
    } catch (err) {
      console.error("Error al guardar resultado:", err);
      alert("Error al guardar el resultado");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (matchId: string) => {
    if (!window.confirm("¿Eliminar este partido?")) return;
    try {
      await deleteDoc(doc(db, "matches", matchId));
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
    } catch (err) {
      console.error("Error al eliminar partido:", err);
    }
  };

  const sports = Array.from(new Set(matches.map((m) => m.sport))).sort();

  const filtered = matches.filter((m) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      m.team1.toLowerCase().includes(search) ||
      m.team2.toLowerCase().includes(search) ||
      m.tournamentName.toLowerCase().includes(search) ||
      m.location.toLowerCase().includes(search);
    const matchesSport = filterSport === "Todos" || m.sport === filterSport;
    const matchesStatus = filterStatus === "Todos" || m.status === filterStatus;
    return matchesSearch && matchesSport && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Partidos</h1>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Programar Partido
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex w-full sm:flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Buscar por equipo, torneo, cancha..."
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={filterSport}
            onChange={(e) => setFilterSport(e.target.value)}
            className="block px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="Todos">Todos los deportes</option>
            {sports.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="Todos">Todos los estados</option>
            <option>Pendiente</option>
            <option>En juego</option>
            <option>Finalizado</option>
          </select>
        </div>
      </div>

      {/* Lista de partidos */}
      {loading ? (
        <div className="flex justify-center py-16 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          <span>Cargando partidos...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 text-center py-16">
          <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay partidos programados</p>
          <p className="text-gray-400 text-sm mt-1">Usa el botón "Programar Partido" para añadir uno</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="border-b border-gray-100 bg-gray-50 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1.5" />
                    {m.date} — {m.time}
                  </div>
                  <div className="hidden sm:flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    {m.location}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium uppercase ${
                      SPORT_COLORS[m.sport] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {m.sport}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      m.status === "Finalizado"
                        ? "bg-gray-100 text-gray-800"
                        : m.status === "En juego"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {m.status}
                  </span>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Eliminar partido"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="px-6 pt-3 text-xs text-gray-400 font-medium uppercase tracking-wide">
                {m.tournamentName}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-gray-400">
                        {m.team1.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 text-center">{m.team1}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center flex-shrink-0 px-8">
                    {m.status === "Finalizado" ? (
                      <div className="flex items-center space-x-4">
                        <span className="text-4xl font-black text-gray-900">{m.score1}</span>
                        <span className="text-gray-400 font-medium">-</span>
                        <span className="text-4xl font-black text-gray-900">{m.score2}</span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-300">VS</span>
                    )}

                    {m.status === "Pendiente" && (
                      <button
                        onClick={() => {
                          setResultMatch(m);
                          setScore1("");
                          setScore2("");
                        }}
                        className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
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

                  <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-gray-400">
                        {m.team2.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 text-center">{m.team2}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Programar Partido */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Programar Partido</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Torneo <span className="text-red-500">*</span>
              </label>
              <select
                value={form.tournamentId}
                onChange={(e) =>
                  setForm({ ...form, tournamentId: e.target.value, team1Id: "", team2Id: "" })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Selecciona un torneo</option>
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.sport}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipo 1 <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.team1Id}
                  onChange={(e) => setForm({ ...form, team1Id: e.target.value })}
                  disabled={!form.tournamentId}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">Seleccionar</option>
                  {teamsForTournament
                    .filter((t) => t.id !== form.team2Id)
                    .map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipo 2 <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.team2Id}
                  onChange={(e) => setForm({ ...form, team2Id: e.target.value })}
                  disabled={!form.tournamentId}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">Seleccionar</option>
                  {teamsForTournament
                    .filter((t) => t.id !== form.team1Id)
                    .map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
              </div>
            </div>

            {form.tournamentId && teamsForTournament.length === 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Este torneo no tiene equipos registrados. Ve a <strong>Equipos</strong> y asigna equipos a este torneo primero.
              </p>
            )}

            {selectedTournament && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deporte</label>
                <input
                  readOnly
                  value={selectedTournament.sport}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cancha / Lugar <span className="text-red-500">*</span>
              </label>
              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Seleccionar cancha</option>
                {CANCHAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveMatch}
                disabled={saving}
                className="flex-1 flex items-center justify-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Guardar Partido
              </button>
              <DialogClose asChild>
                <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm">
                  Cancelar
                </button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Registrar Resultado */}
      <Dialog open={!!resultMatch} onOpenChange={(open) => { if (!open) setResultMatch(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Registrar Resultado</DialogTitle>
          </DialogHeader>

          {resultMatch && (
            <div className="space-y-5 pt-2">
              <p className="text-sm text-gray-500 text-center">
                {resultMatch.date} — {resultMatch.time} · {resultMatch.location}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex-1 text-center">
                  <p className="font-semibold text-gray-900 text-sm mb-2">{resultMatch.team1}</p>
                  <input
                    type="number"
                    min="0"
                    value={score1}
                    onChange={(e) => setScore1(e.target.value)}
                    placeholder="0"
                    className="block w-full text-center text-3xl font-black px-3 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                  />
                </div>

                <span className="text-2xl font-bold text-gray-300 flex-shrink-0">-</span>

                <div className="flex-1 text-center">
                  <p className="font-semibold text-gray-900 text-sm mb-2">{resultMatch.team2}</p>
                  <input
                    type="number"
                    min="0"
                    value={score2}
                    onChange={(e) => setScore2(e.target.value)}
                    placeholder="0"
                    className="block w-full text-center text-3xl font-black px-3 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleSaveResult}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  Confirmar Resultado
                </button>
                <DialogClose asChild>
                  <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm">
                    Cancelar
                  </button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}