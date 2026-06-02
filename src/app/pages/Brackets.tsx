import { useState, useEffect } from "react";
import { db, getTournaments, isMatchFinalized } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Tournament {
  id: string;
  name: string;
  sport: string;
  teams: number;
  modality?: string;
  groups?: number;
}

interface BracketMatch {
  id: string;
  tournamentId: string;
  team1: string;
  team1Id: string;
  team2: string;
  team2Id: string;
  score1: number | null;
  score2: number | null;
  status: string;
  date: string;
  time: string;
  location: string;
  phase: string; // "R32" | "R16" | "QF" | "SF" | "F"
  matchNumber: number; // posición dentro de la fase (1-based)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Calcula las fases basado en el número de equipos
const buildPhases = (teamCount: number): string[] => {
  let n = 1;
  while (n < teamCount) n *= 2;

  const phaseMap: Record<number, string[]> = {
    2:  ["F"],
    4:  ["SF", "F"],
    8:  ["QF", "SF", "F"],
    16: ["R16", "QF", "SF", "F"],
    32: ["R32", "R16", "QF", "SF", "F"],
  };
  return phaseMap[n] ?? ["F"];
};

const PHASE_LABELS: Record<string, string> = {
  R32: "32avos de Final",
  R16: "16avos de Final",
  QF:  "Cuartos de Final",
  SF:  "Semifinales",
  F:   "Gran Final",
};

const matchesPerPhase = (phase: string, firstPhaseTeams: number, phases: string[]): number => {
  const idx = phases.indexOf(phase);
  if (idx === 0) return Math.ceil(firstPhaseTeams / 2);
  // cada ronda siguiente tiene la mitad
  const firstCount = Math.ceil(firstPhaseTeams / 2);
  return Math.max(1, Math.ceil(firstCount / Math.pow(2, idx)));
};

const getWinner = (match: BracketMatch): string | null => {
  if (!isMatchFinalized(match)) return null;
  if ((match.score1 ?? 0) > (match.score2 ?? 0)) return match.team1;
  if ((match.score2 ?? 0) > (match.score1 ?? 0)) return match.team2;
  return null; // empate
};

// ─── Componente de tarjeta de partido ─────────────────────────────────────────

function MatchCard({
  match,
  isFinal,
}: {
  match: BracketMatch | null;
  isFinal: boolean;
}) {
  const finalized = match ? isMatchFinalized(match) : false;
  const winner = match ? getWinner(match) : null;

  const teamClass = (team: string) =>
    finalized && winner
      ? winner === team
        ? "font-black text-green-700"
        : "font-medium text-gray-400 line-through"
      : "font-semibold text-gray-800";

  if (isFinal) {
    return (
      <div
        className={`rounded-xl border-2 shadow-lg p-4 w-60 ${
          finalized
            ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-white"
            : "border-yellow-300 bg-yellow-50/60"
        }`}
      >
        <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider mb-3 text-center">
          🏆 Gran Final
        </p>

        {/* Equipo 1 */}
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg mb-1 ${
            finalized && winner === match?.team1
              ? "bg-green-100"
              : "bg-white/70"
          }`}
        >
          <span className={`text-sm truncate max-w-[9rem] ${teamClass(match?.team1 ?? "")}`}>
            {match?.team1 || "Por definir"}
          </span>
          {finalized && (
            <span className="text-lg font-black text-gray-900 ml-2">{match?.score1}</span>
          )}
        </div>

        <div className="text-center text-xs text-gray-400 font-bold my-1">
          {finalized ? "—" : "VS"}
        </div>

        {/* Equipo 2 */}
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg mt-1 ${
            finalized && winner === match?.team2
              ? "bg-green-100"
              : "bg-white/70"
          }`}
        >
          <span className={`text-sm truncate max-w-[9rem] ${teamClass(match?.team2 ?? "")}`}>
            {match?.team2 || "Por definir"}
          </span>
          {finalized && (
            <span className="text-lg font-black text-gray-900 ml-2">{match?.score2}</span>
          )}
        </div>

        {match && (
          <p className="text-xs text-gray-400 text-center mt-3">
            {match.date} {match.time && `· ${match.time}`}
          </p>
        )}

        {finalized && winner && (
          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              🥇 {winner}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border shadow-sm w-56 overflow-hidden ${
        finalized ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"
      }`}
    >
      {/* Equipo 1 */}
      <div
        className={`flex items-center justify-between px-3 py-2 border-b border-gray-200 ${
          finalized && winner === match?.team1 ? "bg-green-50" : ""
        }`}
      >
        <span className={`text-sm truncate max-w-[9rem] ${teamClass(match?.team1 ?? "")}`}>
          {match?.team1 || <span className="text-gray-400 italic text-xs">Por definir</span>}
        </span>
        {finalized && (
          <span className="text-base font-black text-gray-900 ml-2">{match?.score1}</span>
        )}
      </div>

      {/* Equipo 2 */}
      <div
        className={`flex items-center justify-between px-3 py-2 ${
          finalized && winner === match?.team2 ? "bg-green-50" : ""
        }`}
      >
        <span className={`text-sm truncate max-w-[9rem] ${teamClass(match?.team2 ?? "")}`}>
          {match?.team2 || <span className="text-gray-400 italic text-xs">Por definir</span>}
        </span>
        {finalized && (
          <span className="text-base font-black text-gray-900 ml-2">{match?.score2}</span>
        )}
      </div>

      {/* Footer */}
      {match && (
        <div className="px-3 py-1.5 bg-gray-100 border-t border-gray-200">
          <p className="text-xs text-gray-400 truncate">
            {match.date}
            {match.time && ` · ${match.time}`}
            {match.location && ` · ${match.location}`}
          </p>
        </div>
      )}
      {!match && (
        <div className="px-3 py-1.5 bg-gray-100 border-t border-gray-200">
          <p className="text-xs text-gray-400 italic">Sin programar</p>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function Brackets() {
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<BracketMatch[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Cargar torneos
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getTournaments();
        setAllTournaments(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Suscripción en tiempo real a partidos del torneo
  useEffect(() => {
    if (!selectedTournamentId) {
      setMatches([]);
      return;
    }
    setLoading(true);

    const q = query(
      collection(db, "matches"),
      where("tournamentId", "==", selectedTournamentId),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: BracketMatch[] = snap.docs.map((d, i) => ({
          id: d.id,
          tournamentId: d.data().tournamentId,
          team1: d.data().team1 ?? "",
          team1Id: d.data().team1Id ?? "",
          team2: d.data().team2 ?? "",
          team2Id: d.data().team2Id ?? "",
          score1: d.data().score1 ?? null,
          score2: d.data().score2 ?? null,
          status: d.data().status ?? "Pendiente",
          date: d.data().date ?? "",
          time: d.data().time ?? "",
          location: d.data().location ?? "",
          // Usa el campo 'phase' si existe, si no, fallback a "F"
          phase: d.data().phase ?? "F",
          matchNumber: d.data().matchNumber ?? i + 1,
        }));
        setMatches(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => { try { unsub(); } catch (_) {} };
  }, [selectedTournamentId]);

  // Limpiar torneo al cambiar deporte
  useEffect(() => {
    setSelectedTournamentId("");
    setMatches([]);
  }, [selectedSport]);

  const sports = Array.from(new Set(allTournaments.map((t) => t.sport))).sort();
  const filteredTournaments = selectedSport
    ? allTournaments.filter((t) => t.sport === selectedSport)
    : [];
  const selectedTournament = allTournaments.find((t) => t.id === selectedTournamentId) ?? null;

  // Construir fases y distribuir partidos
  const phases = selectedTournament ? buildPhases(selectedTournament.teams) : [];

  // Agrupar partidos por fase
  const matchesByPhase: Record<string, BracketMatch[]> = {};
  for (const phase of phases) {
    // Primero intentar por campo 'phase'
    let phaseMatches = matches.filter((m) => m.phase === phase);

    // Si ningún partido tiene campo 'phase', distribuir por orden cronológico
    if (matches.every((m) => m.phase === "F") && phases.length > 1) {
      const firstPhaseCount = matchesPerPhase(phases[0], selectedTournament!.teams, phases);
      let cursor = 0;
      for (const ph of phases) {
        const count = matchesPerPhase(ph, selectedTournament!.teams, phases);
        matchesByPhase[ph] = matches.slice(cursor, cursor + count);
        cursor += count;
      }
      break;
    }
    matchesByPhase[phase] = phaseMatches.sort((a, b) => a.matchNumber - b.matchNumber);
  }

  // Cuántos slots hay por fase para dibujar las filas
  const slotsPerPhase = (phase: string): number => {
    if (!selectedTournament) return 1;
    return matchesPerPhase(phase, selectedTournament.teams, phases);
  };

  const maxSlots = phases.length > 0 ? slotsPerPhase(phases[0]) : 1;

  // Altura de cada slot en px para calcular conectores SVG
  const SLOT_H = 100; // px por slot de partido
  const PHASE_HEADER_H = 48; // px del encabezado de fase
  const CARD_H = 80; // altura aprox de la tarjeta
  const COL_W = 256; // w-64
  const GAP_W = 48; // gap entre columnas (conector)

  const totalH = maxSlots * SLOT_H + PHASE_HEADER_H + 64;

  return (
    <div className="space-y-6 min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Llaves del Torneo</h1>
          <p className="mt-1 text-sm text-gray-500">
            {selectedTournament
              ? `${selectedTournament.name} · ${selectedTournament.teams} equipos`
              : "Selecciona un deporte y torneo"}
          </p>
        </div>
      </div>

      {/* Selectores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Deporte</label>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar deporte" />
              </SelectTrigger>
              <SelectContent>
                {sports.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Torneo</label>
            <Select
              value={selectedTournamentId}
              onValueChange={setSelectedTournamentId}
              disabled={!selectedSport}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar torneo" />
              </SelectTrigger>
              <SelectContent>
                {filteredTournaments.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bracket */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 overflow-auto">
        {!selectedTournament ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
            <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 48 48">
              <rect x="4" y="8" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
              <rect x="4" y="30" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
              <rect x="28" y="19" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="20" y1="13" x2="28" y2="13" stroke="currentColor" strokeWidth="2"/>
              <line x1="20" y1="35" x2="28" y2="35" stroke="currentColor" strokeWidth="2"/>
              <line x1="24" y1="13" x2="24" y2="35" stroke="currentColor" strokeWidth="2"/>
              <line x1="24" y1="24" x2="28" y2="24" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <p className="text-sm">Selecciona un torneo para ver las llaves</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <span className="animate-pulse text-sm">Cargando partidos...</span>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div
              className="flex items-start gap-0"
              style={{ minWidth: phases.length * (COL_W + GAP_W) }}
            >
              {phases.map((phase, phaseIdx) => {
                const slots = slotsPerPhase(phase);
                const phaseMatches = matchesByPhase[phase] ?? [];
                const isFinal = phase === "F";
                const isLast = phaseIdx === phases.length - 1;

                // Altura total de esta columna para centrar los slots
                const colH = maxSlots * SLOT_H + PHASE_HEADER_H;

                // Espaciado vertical entre slots: los slots se distribuyen uniformemente
                // En la primera fase ocupan todos los slots, en fases siguientes se reducen
                const slotSpacing = maxSlots > 1 ? (colH - PHASE_HEADER_H - CARD_H) / (maxSlots - 1) : 0;
                const groupSize = maxSlots / slots; // cuántos slots del primer nivel "alimentan" este
                const topOffset = (groupSize - 1) * slotSpacing / 2; // centrar dentro del grupo

                return (
                  <div key={phase} className="flex items-start">
                    {/* Columna de fase */}
                    <div style={{ width: COL_W }}>
                      {/* Encabezado */}
                      <div
                        className={`text-center font-bold text-sm mb-4 py-2 px-3 rounded-lg ${
                          isFinal
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                        style={{ height: PHASE_HEADER_H }}
                      >
                        {PHASE_LABELS[phase] ?? phase}
                        <div className="text-xs font-normal text-gray-400 mt-0.5">
                          {slots} {slots === 1 ? "partido" : "partidos"}
                        </div>
                      </div>

                      {/* Slots de partidos */}
                      <div
                        className="relative"
                        style={{ height: colH - PHASE_HEADER_H }}
                      >
                        {Array.from({ length: slots }).map((_, slotIdx) => {
                          const match = phaseMatches[slotIdx] ?? null;
                          const top = isFinal && slots === 1
                            ? (colH - PHASE_HEADER_H - CARD_H) / 2
                            : topOffset + slotIdx * groupSize * slotSpacing;

                          return (
                            <div
                              key={slotIdx}
                              className="absolute"
                              style={{ top, left: 0, width: COL_W }}
                            >
                              <MatchCard match={match} isFinal={isFinal} />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Conectores SVG entre esta fase y la siguiente */}
                    {!isLast && (
                      <svg
                        width={GAP_W}
                        height={colH}
                        style={{ flexShrink: 0, overflow: "visible", marginTop: 0 }}
                      >
                        {Array.from({ length: slots }).map((_, slotIdx) => {
                          const nextSlots = slotsPerPhase(phases[phaseIdx + 1]);
                          // dos matches de esta fase → un match en la siguiente
                          const pairIdx = Math.floor(slotIdx / 2);

                          const thisTop =
                            PHASE_HEADER_H +
                            (isFinal && slots === 1
                              ? (colH - PHASE_HEADER_H - CARD_H) / 2
                              : topOffset + slotIdx * groupSize * slotSpacing) +
                            CARD_H / 2;

                          const nextGroupSize = maxSlots / nextSlots;
                          const nextTopOffset = (nextGroupSize - 1) * slotSpacing / 2;
                          const nextMatchTop =
                            PHASE_HEADER_H +
                            nextTopOffset +
                            pairIdx * nextGroupSize * slotSpacing +
                            CARD_H / 2;

                          const isTop = slotIdx % 2 === 0;
                          const midX = GAP_W / 2;

                          return (
                            <g key={slotIdx}>
                              {/* línea horizontal desde la tarjeta hasta el medio */}
                              <line
                                x1={0}
                                y1={thisTop}
                                x2={midX}
                                y2={thisTop}
                                stroke="#16a34a"
                                strokeWidth={1.5}
                                strokeDasharray={isMatchFinalized(phaseMatches[slotIdx]) ? "none" : "4 3"}
                              />
                              {/* línea vertical que une el par */}
                              {isTop && slotIdx + 1 < slots && (
                                <line
                                  x1={midX}
                                  y1={thisTop}
                                  x2={midX}
                                  y2={
                                    PHASE_HEADER_H +
                                    topOffset +
                                    (slotIdx + 1) * groupSize * slotSpacing +
                                    CARD_H / 2
                                  }
                                  stroke="#16a34a"
                                  strokeWidth={1.5}
                                  strokeDasharray="4 3"
                                />
                              )}
                              {/* línea horizontal desde el medio hacia la siguiente fase */}
                              {isTop && (
                                <line
                                  x1={midX}
                                  y1={nextMatchTop}
                                  x2={GAP_W}
                                  y2={nextMatchTop}
                                  stroke="#16a34a"
                                  strokeWidth={1.5}
                                  strokeDasharray="4 3"
                                />
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Leyenda */}
      {selectedTournament && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 border-t-2 border-green-600" />
            <span>Partido finalizado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 border-t-2 border-green-600 border-dashed" style={{ borderStyle: "dashed" }} />
            <span>Partido pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-400" />
            <span>Equipo ganador</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-400" />
            <span>Gran Final</span>
          </div>
          <div className="ml-auto text-gray-400">
            {matches.filter((m) => isMatchFinalized(m)).length} / {matches.length} partidos finalizados
          </div>
        </div>
      )}
    </div>
  );
}