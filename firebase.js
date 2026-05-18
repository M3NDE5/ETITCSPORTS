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
  orderBy
} from 'firebase/firestore';

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
export const db = getFirestore(app);

// Función para crear un torneo
export const createTournament = async (tournamentData) => {
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
export const getTournaments = async () => {
  try {
    const q = query(collection(db, 'torneos'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const tournaments = [];
    querySnapshot.forEach((doc) => {
      tournaments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return tournaments;
  } catch (error) {
    console.error('Error al obtener torneos:', error);
    throw error;
  }
};

// Función para actualizar un torneo
export const updateTournament = async (tournamentId, tournamentData) => {
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
export const deleteTournament = async (tournamentId) => {
  try {
    await deleteDoc(doc(db, 'torneos', tournamentId));
  } catch (error) {
    console.error('Error al eliminar torneo:', error);
    throw error;
  }
};