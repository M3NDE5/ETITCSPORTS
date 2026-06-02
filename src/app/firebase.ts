import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDocs,
  query,
  orderBy,
  Firestore
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  signOut,
  Auth
} from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkF39Ed0APUZBIaoJ0duDf1DvF30p53Jg",
  authDomain: "etitcsports.firebaseapp.com",
  projectId: "etitcsports",
  storageBucket: "etitcsports.firebasestorage.app",
  messagingSenderId: "280776211987",
  appId: "1:280776211987:web:8fbc94f3a2d467ac0089e6",
  measurementId: "G-PECTXG2KKJ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancia de Firestore
export const db: Firestore = getFirestore(app);

// Obtener instancia de Auth
export const auth: Auth = getAuth(app);

interface TournamentData {
  name: string;
  sport: string;
  teams: number;
  startDate: Date;
  endDate: Date;
  status: string;
  modality: string;
  groups?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Función para crear un torneo
export const createTournament = async (tournamentData: TournamentData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'torneos'), {
      ...tournamentData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al crear torneo:', error);
    throw error;
  }
};

// Función para obtener todos los torneos
export const getTournaments = async (): Promise<any[]> => {
  try {
    const q = query(collection(db, 'torneos'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const tournaments: any[] = [];
    querySnapshot.forEach((doc) => {
      tournaments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return tournaments;
  } catch (error: any) {
    // Si la colección no existe o no hay índice, retornar array vacío
    if (error.code === 'failed-precondition' || error.code === 'permission-denied') {
      console.warn('Colección torneos no existe o sin permisos, retornando array vacío');
      return [];
    }
    console.error('Error al obtener torneos:', error);
    throw error;
  }
};

// Función para actualizar un torneo
export const updateTournament = async (tournamentId: string, tournamentData: Partial<TournamentData>): Promise<void> => {
  try {
    const tournamentRef = doc(db, 'torneos', tournamentId);
    await updateDoc(tournamentRef, {
      ...tournamentData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error al actualizar torneo:', error);
    throw error;
  }
};

// Función para eliminar un torneo
export const deleteTournament = async (tournamentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'torneos', tournamentId));
  } catch (error) {
    console.error('Error al eliminar torneo:', error);
    throw error;
  }
};

// Función para login con email y contraseña
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// Función para logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

// Funciones para obtener datos del Dashboard
export const getDashboardStats = async () => {
  try {
    // Obtener torneos activos
    const tournamentsSnapshot = await getDocs(collection(db, 'torneos'));
    const activeTournaments = tournamentsSnapshot.docs.filter((doc: any) => doc.data().status === 'Activo').length;

    // Obtener equipos
    const teamsSnapshot = await getDocs(collection(db, 'equipos'));
    const totalTeams = teamsSnapshot.size;

    // Obtener partidos próximos
    const matchesSnapshot = await getDocs(collection(db, 'partidos'));
    const nextMatches = matchesSnapshot.docs.filter((doc: any) => doc.data().status === 'programado').length;

    return {
      activeTournaments: activeTournaments || 0,
      totalTeams: totalTeams || 0,
      nextMatches: nextMatches || 0,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      activeTournaments: 0,
      totalTeams: 0,
      nextMatches: 0,
    };
  }
};

export const getStatsByDeporte = async (deporte: string) => {
  try {
    // Obtener torneos activos del deporte
    const tournamentsSnapshot = await getDocs(collection(db, 'torneos'));
    const activeTournaments = tournamentsSnapshot.docs.filter((doc: any) => 
      doc.data().status === 'Activo' && doc.data().sport === deporte
    ).length;

    // Obtener equipos del deporte
    const teamsSnapshot = await getDocs(collection(db, 'teams'));
    const totalTeams = teamsSnapshot.docs.filter((doc: any) => 
      doc.data().sport === deporte
    ).length;

    // Obtener próximos partidos del deporte
    const matchesSnapshot = await getDocs(collection(db, 'partidos'));
    const nextMatches = matchesSnapshot.docs.filter((doc: any) => 
      doc.data().status === 'programado' && doc.data().sport === deporte
    ).length;

    return {
      activeTournaments: activeTournaments || 0,
      totalTeams: totalTeams || 0,
      nextMatches: nextMatches || 0,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas por deporte:', error);
    return {
      activeTournaments: 0,
      totalTeams: 0,
      nextMatches: 0,
    };
  }
};

export const getUpcomingMatches = async (limit: number = 10) => {
  try {
    const q = query(collection(db, 'partidos'), orderBy('fecha', 'asc'));
    const querySnapshot = await getDocs(q);
    const matches: any[] = [];
    
    querySnapshot.docs.slice(0, limit).forEach((doc) => {
      matches.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return matches;
  } catch (error) {
    console.error('Error al obtener partidos próximos:', error);
    return [];
  }
};

export const getUpcomingMatchesByDeporte = async (deporte: string, limit: number = 3) => {
  try {
    const q = query(
      collection(db, 'partidos'), 
      orderBy('fecha', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const matches: any[] = [];
    
    querySnapshot.docs.forEach((doc) => {
      if (doc.data().sport === deporte && matches.length < limit) {
        matches.push({
          id: doc.id,
          ...doc.data()
        });
      }
    });
    
    return matches;
  } catch (error) {
    console.error('Error al obtener partidos próximos por deporte:', error);
    return [];
  }
};

// Normaliza y verifica si un estado de partido representa que está finalizado
export const normalizeStatus = (status: any) => {
  if (status === undefined || status === null) return "";
  return String(status).trim().toLowerCase();
};

export const isMatchFinalized = (statusOrMatch: any) => {
  const s = typeof statusOrMatch === 'object' && statusOrMatch?.status !== undefined
    ? normalizeStatus(statusOrMatch.status)
    : normalizeStatus(statusOrMatch);
  const finals = new Set(['finalizado', 'final', 'finalizada', 'terminado', 'terminada', 'finished', 'ended']);
  return finals.has(s);
};

export const isMatchPending = (statusOrMatch: any) => {
  const s = typeof statusOrMatch === 'object' && statusOrMatch?.status !== undefined
    ? normalizeStatus(statusOrMatch.status)
    : normalizeStatus(statusOrMatch);
  const pendings = new Set(['pendiente', 'programado', 'scheduled', 'upcoming']);
  return pendings.has(s) || !isMatchFinalized(s);
};

const buildStandingsFromMatches = (matches: any[], group?: string) => {
  const hasGroupData = matches.some((match: any) => typeof match.group === 'string');
  const filteredMatches = matches.filter((match: any) => {
    if (group && hasGroupData && match.group !== group) return false;
    if (!match.tournamentId) return false;
    if (!match.team1 || !match.team2) return false;
    if (!match.status || match.status.toString().toLowerCase() !== 'finalizado') return false;
    return true;
  });

  const standingsMap = new Map<string, any>();

  const ensureTeam = (teamId: string, teamName: string) => {
    if (!standingsMap.has(teamId)) {
      standingsMap.set(teamId, {
        id: teamId,
        team: teamName,
        p: 0,
        w: 0,
        d: 0,
        l: 0,
        f: 0,
        a: 0,
        gd: '+0',
        trend: 'same',
      });
    }
  };

  filteredMatches.forEach((match: any) => {
    const score1 = typeof match.score1 === 'number' ? match.score1 : parseInt(match.score1);
    const score2 = typeof match.score2 === 'number' ? match.score2 : parseInt(match.score2);
    if (Number.isNaN(score1) || Number.isNaN(score2)) return;

    const team1Id = match.team1Id || match.team1;
    const team2Id = match.team2Id || match.team2;
    ensureTeam(team1Id, match.team1);
    ensureTeam(team2Id, match.team2);

    const team1 = standingsMap.get(team1Id);
    const team2 = standingsMap.get(team2Id);

    team1.f += score1;
    team1.a += score2;
    team2.f += score2;
    team2.a += score1;

    if (score1 > score2) {
      team1.w += 1;
      team1.p += 3;
      team2.l += 1;
    } else if (score1 < score2) {
      team2.w += 1;
      team2.p += 3;
      team1.l += 1;
    } else {
      team1.d += 1;
      team2.d += 1;
      team1.p += 1;
      team2.p += 1;
    }
  });

  const standings = Array.from(standingsMap.values()).map((team: any) => ({
    ...team,
    gd: `${team.f - team.a >= 0 ? '+' : ''}${team.f - team.a}`,
  }));

  return standings.sort((a, b) => {
    if (b.p !== a.p) return b.p - a.p;
    const gdA = parseInt(a.gd);
    const gdB = parseInt(b.gd);
    if (gdB !== gdA) return gdB - gdA;
    if (b.f !== a.f) return b.f - a.f;
    return a.team.localeCompare(b.team);
  });
};

const getTeamListForTournament = async (tournamentId: string) => {
  const teamsSnapshot = await getDocs(query(collection(db, 'teams'), orderBy('name')));
  const teams: any[] = [];
  teamsSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const isDirectTournament = data.tournament === tournamentId;
    const isEnrolled = Array.isArray(data.enrolledTournaments) && data.enrolledTournaments.includes(tournamentId);
    if (isDirectTournament || isEnrolled) {
      teams.push({ id: doc.id, ...data });
    }
  });
  return teams;
};

const getTeamListBySport = async (deporte: string) => {
  const teamsSnapshot = await getDocs(query(collection(db, 'teams'), orderBy('name')));
  const teams: any[] = [];
  teamsSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.sport === deporte) {
      teams.push({ id: doc.id, ...data });
    }
  });
  return teams;
};

export const getMatchesByTournament = async (tournamentId: string) => {
  try {
    const q = query(collection(db, 'partidos'), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const matches: any[] = [];
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.tournamentId === tournamentId) {
        matches.push({ id: doc.id, ...data });
      }
    });
    return matches;
  } catch (error) {
    console.error('Error al obtener partidos del torneo:', error);
    return [];
  }
};

// Listener en tiempo real para partidos de un torneo
export const subscribeMatchesByTournament = (tournamentId: string, callback: (matches: any[]) => void) => {
  try {
    const q = query(collection(db, 'partidos'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const matches: any[] = [];
      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.tournamentId === tournamentId) {
          matches.push({ id: doc.id, ...data });
        }
      });
      callback(matches);
    }, (error) => {
      console.error('Error en listener de partidos:', error);
      callback([]);
    });

    return unsub;
  } catch (error) {
    console.error('No se pudo suscribir a partidos:', error);
    return () => {};
  }
};

// Suscripción en tiempo real que entrega posiciones calculadas a partir de los partidos
export const subscribeStandingsByTournament = (tournamentId: string, group: string | undefined, callback: (standings: any[]) => void) => {
  try {
    const unsub = subscribeMatchesByTournament(tournamentId, async (matches) => {
      try {
        const filteredMatches = group ? matches.filter((m) => m.group === group) : matches;
        const calculated = buildStandingsFromMatches(filteredMatches, group);

        // Obtener equipos inscritos y asegurar que aparezcan en la tabla (aunque no tengan partidos)
        const teams = await getTeamListForTournament(tournamentId);
        const teamsMap = new Map(calculated.map((t: any) => [t.id, t]));

        teams.forEach((team: any) => {
          if (!teamsMap.has(team.id)) {
            teamsMap.set(team.id, {
              id: team.id,
              team: team.name || 'Equipo',
              p: 0,
              w: 0,
              d: 0,
              l: 0,
              f: 0,
              a: 0,
              gd: '+0',
              trend: 'same',
            });
          }
        });

        const merged = Array.from(teamsMap.values());

        // Reordenar usando las mismas reglas que buildStandingsFromMatches
        merged.sort((a: any, b: any) => {
          if (b.p !== a.p) return b.p - a.p;
          const gdA = parseInt(a.gd);
          const gdB = parseInt(b.gd);
          if (gdB !== gdA) return gdB - gdA;
          if (b.f !== a.f) return b.f - a.f;
          return a.team.localeCompare(b.team);
        });

        callback(merged);
      } catch (err) {
        console.error('Error preparando posiciones en suscripción:', err);
        callback([]);
      }
    });
    return unsub;
  } catch (error) {
    console.error('Error suscribiendo posiciones:', error);
    return () => {};
  }
};

export const getStandings = async (tournamentId?: string, group?: string) => {
  try {
    const q = query(collection(db, 'partidos'), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const matches: any[] = [];
    querySnapshot.docs.forEach((doc) => {
      matches.push({ id: doc.id, ...doc.data() });
    });

    const filteredMatches = tournamentId
      ? matches.filter((match) => match.tournamentId === tournamentId)
      : matches;

    const standings = buildStandingsFromMatches(filteredMatches, group);
    if (standings.length > 0) {
      return standings;
    }

    if (tournamentId) {
      const teams = await getTeamListForTournament(tournamentId);
      return teams.map((team: any) => ({
        id: team.id,
        team: team.name || 'Equipo',
        p: 0,
        w: 0,
        d: 0,
        l: 0,
        f: 0,
        a: 0,
        gd: '+0',
        trend: 'same',
      }));
    }

    return [];
  } catch (error) {
    console.error('Error al obtener posiciones:', error);
    return [];
  }
};

export const getStandingsByDeporte = async (deporte: string) => {
  try {
    const q = query(collection(db, 'partidos'), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const matches: any[] = [];
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.sport === deporte) {
        matches.push({ id: doc.id, ...data });
      }
    });

    const standings = buildStandingsFromMatches(matches).slice(0, 5);
    if (standings.length > 0) {
      return standings;
    }

    const teams = await getTeamListBySport(deporte);
    return teams.slice(0, 5).map((team: any) => ({
      id: team.id,
      team: team.name || 'Equipo',
      p: 0,
      w: 0,
      d: 0,
      l: 0,
      f: 0,
      a: 0,
      gd: '+0',
      trend: 'same',
    }));
  } catch (error) {
    console.error('Error al obtener posiciones por deporte:', error);
    return [];
  }
};
