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

export const getStandings = async (tournamentId?: string, group?: string) => {
  try {
    const q = query(collection(db, 'posiciones'), orderBy('puntos', 'desc'));
    const querySnapshot = await getDocs(q);
    const standings: any[] = [];
    
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (tournamentId && data.tournamentId !== tournamentId) return;
      if (group && data.group !== group) return;
      standings.push({
        id: doc.id,
        ...data
      });
    });
    
    return standings;
  } catch (error) {
    console.error('Error al obtener posiciones:', error);
    return [];
  }
};

export const getStandingsByDeporte = async (deporte: string) => {
  try {
    const q = query(
      collection(db, 'posiciones'),
      orderBy('puntos', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const standings: any[] = [];
    
    querySnapshot.docs.forEach((doc) => {
      if (doc.data().sport === deporte && standings.length < 5) {
        standings.push({
          id: doc.id,
          ...doc.data()
        });
      }
    });
    
    return standings;
  } catch (error) {
    console.error('Error al obtener posiciones por deporte:', error);
    return [];
  }
};
