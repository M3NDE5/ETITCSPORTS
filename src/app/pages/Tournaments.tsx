import { Plus, Search, Calendar, Users, Trophy, X, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { createTournament, updateTournament, deleteTournament, getTournaments } from "../../../firebase";
interface Tournament {
  id: string;
  name: string;
  status: string;
  sport: string;
  teams: number;
  startDate: string | Date;
  endDate: string | Date;
}

interface FormData {
  name: string;
  sport: string;
  teams: number;
  startDate: string;
  endDate: string;
  status: string;
}
export function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilter, setSportFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    sport: "",
    teams: 0,
    startDate: "",
    endDate: "",
    status: "Inscripciones"
  });

  // Cargar torneos desde Firebase
  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const data = await getTournaments();
      const formattedTournaments = data.map(t => {
        // Manejar timestamps de Firestore
        let startDate = t.startDate;
        let endDate = t.endDate;
        
        // Si son timestamps de Firestore, convertir a Date
        if (t.startDate && typeof t.startDate.toDate === 'function') {
          startDate = t.startDate.toDate();
        } else if (typeof t.startDate === 'string') {
          startDate = new Date(t.startDate);
        }
        
        if (t.endDate && typeof t.endDate.toDate === 'function') {
          endDate = t.endDate.toDate();
        } else if (typeof t.endDate === 'string') {
          endDate = new Date(t.endDate);
        }
        
        return {
          ...t,
          startDate: startDate,
          endDate: endDate
        };
      });
      setTournaments(formattedTournaments);
    } catch (error: any) {
      console.error('Error al cargar torneos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date | any): string => {
    if (!date) return 'Sin fecha';
    
    let dateObj: Date;
    
    // Manejar Timestamps de Firestore
    if (date && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      return 'Sin fecha';
    }
    
    // Verificar que sea una fecha válida
    if (isNaN(dateObj.getTime())) {
      return 'Sin fecha';
    }
    
    return dateObj.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatDateForInput = (dateString: string | Date | any): string => {
    if (!dateString) return '';
    
    let dateObj: Date;
    
    // Manejar Timestamps de Firestore
    if (dateString && typeof dateString.toDate === 'function') {
      dateObj = dateString.toDate();
    } else if (dateString instanceof Date) {
      dateObj = dateString;
    } else if (typeof dateString === 'string') {
      dateObj = new Date(dateString);
    } else {
      return '';
    }
    
    // Verificar que sea una fecha válida
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toISOString().split('T')[0];
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sport || !formData.startDate || !formData.endDate) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      const startDateObj = new Date(formData.startDate);
      const endDateObj = new Date(formData.endDate);

      const tournamentData = {
        name: formData.name,
        status: formData.status,
        sport: formData.sport,
        teams: formData.teams,
        startDate: startDateObj,
        endDate: endDateObj
      };

      // Guardar en Firebase
      const docId = await createTournament(tournamentData);

      // Actualizar estado local
      const newTournament = {
        id: docId,
        ...tournamentData,
        startDate: formatDate(startDateObj),
        endDate: formatDate(endDateObj)
      };

      setTournaments([...tournaments, newTournament]);
      setFormData({
        name: "",
        sport: "",
        teams: 0,
        startDate: "",
        endDate: "",
        status: "Inscripciones"
      });
      setIsDialogOpen(false);
      alert("Torneo creado exitosamente");
    } catch (error: any) {
      console.error('Error detallado:', error);
      alert(`Error al crear el torneo: ${error?.message || error}`);
    }
  };

  const handleEditTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sport || !formData.startDate || !formData.endDate) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      const startDateObj = new Date(formData.startDate);
      const endDateObj = new Date(formData.endDate);

      const tournamentData = {
        name: formData.name,
        status: formData.status,
        sport: formData.sport,
        teams: formData.teams,
        startDate: startDateObj,
        endDate: endDateObj
      };

      // Actualizar en Firebase
      await updateTournament(editingId!, tournamentData);

      // Actualizar estado local
      setTournaments(tournaments.map(t => 
        t.id === editingId 
          ? {
              ...t,
              ...tournamentData,
              startDate: formatDate(startDateObj),
              endDate: formatDate(endDateObj)
            }
          : t
      ));

      setFormData({
        name: "",
        sport: "",
        teams: 0,
        startDate: "",
        endDate: "",
        status: "Inscripciones"
      });
      setEditingId(null);
      setIsEditDialogOpen(false);
      alert("Torneo actualizado exitosamente");
    } catch (error: any) {
      console.error('Error detallado:', error);
      alert(`Error al actualizar el torneo: ${error?.message || error}`);
    }
  };

  const openEditDialog = (tournament: Tournament) => {
    setEditingId(tournament.id);
    const startDate = formatDateForInput(tournament.startDate);
    const endDate = formatDateForInput(tournament.endDate);
    
    setFormData({
      name: tournament.name,
      sport: tournament.sport,
      teams: tournament.teams,
      startDate: startDate,
      endDate: endDate,
      status: tournament.status
    });
    setIsEditDialogOpen(true);
  };

  const openDetailsDialog = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteTournament = async (id: string) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este torneo?")) {
      try {
        // Eliminar de Firebase
        await deleteTournament(id);
        
        // Actualizar estado local
        setTournaments(tournaments.filter(t => t.id !== id));
        setIsDetailsDialogOpen(false);
        alert("Torneo eliminado exitosamente");
      } catch (error: any) {
        console.error('Error detallado:', error);
        alert(`Error al eliminar el torneo: ${error?.message || error}`);
      }
    }
  };

  // Filtrar torneos
  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.sport.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = sportFilter === "Todos" || t.sport === sportFilter;
    const matchesStatus = statusFilter === "Todos" || t.status === statusFilter;
    
    return matchesSearch && matchesSport && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Cargando torneos...</p>
        </div>
      )}
      
      {!loading && (
      <>
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Torneos</h1>
        <div className="mt-4 sm:mt-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                <Plus className="w-5 h-5 mr-2" />
                Crear Torneo
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Torneo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTournament} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tournament-name">Nombre del Torneo*</Label>
                  <Input
                    id="tournament-name"
                    placeholder="Ej: Torneo Interfacultades"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sport">Deporte*</Label>
                  <Select value={formData.sport} onValueChange={(value) => setFormData({...formData, sport: value})}>
                    <SelectTrigger id="sport">
                      <SelectValue placeholder="Selecciona un deporte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fútbol">Fútbol</SelectItem>
                      <SelectItem value="Baloncesto">Baloncesto</SelectItem>
                      <SelectItem value="Voleibol">Voleibol</SelectItem>
                      <SelectItem value="Tenis de Mesa">Tenis de Mesa</SelectItem>
                      <SelectItem value="Badminton">Badminton</SelectItem>
                      <SelectItem value="Atletismo">Atletismo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teams">Número de Equipos</Label>
                  <Input
                    id="teams"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.teams === 0 ? "" : formData.teams}
                    onChange={(e) => setFormData({...formData, teams: e.target.value === "" ? 0 : parseInt(e.target.value) || 0})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Fecha de Inicio*</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Fecha de Fin*</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inscripciones">Inscripciones</SelectItem>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Finalizado">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">Crear Torneo</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex w-full max-w-sm relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
            placeholder="Buscar torneos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden sm:flex space-x-2">
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
          >
            <option>Todos</option>
            <option>Fútbol</option>
            <option>Baloncesto</option>
            <option>Voleibol</option>
            <option>Tenis de Mesa</option>
            <option>Badminton</option>
            <option>Atletismo</option>
          </select>
          <select 
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>Todos</option>
            <option>Activo</option>
            <option>Inscripciones</option>
            <option>Finalizado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTournaments.length > 0 ? (
          filteredTournaments.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="p-5 flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                  <Trophy className="w-6 h-6" />
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    t.status === "Activo"
                      ? "bg-green-100 text-green-800"
                      : t.status === "Finalizado"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.name}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide mb-2 bg-purple-100 text-purple-800">
                {t.sport}
              </span>
              <div className="space-y-2 mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                  {t.teams} Equipos inscritos
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                  {formatDate(t.startDate)} - {formatDate(t.endDate)}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-200 rounded-b-xl flex justify-between items-center">
              <button 
                onClick={() => openDetailsDialog(t)}
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                Ver detalles
              </button>
              <button 
                onClick={() => openEditDialog(t)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Editar
              </button>
            </div>
          </div>
        ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron torneos</p>
          </div>
        )}
      </div>

      {/* Diálogo para ver detalles */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles del Torneo</DialogTitle>
          </DialogHeader>
          {selectedTournament && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium uppercase text-gray-500">Nombre</Label>
                <p className="text-lg font-bold text-gray-900">{selectedTournament.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium uppercase text-gray-500">Deporte</Label>
                  <p className="text-gray-900 font-medium">{selectedTournament.sport}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium uppercase text-gray-500">Estado</Label>
                  <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedTournament.status === "Activo"
                      ? "bg-green-100 text-green-800"
                      : selectedTournament.status === "Finalizado"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {selectedTournament.status}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium uppercase text-gray-500">Equipos Inscritos</Label>
                <p className="text-gray-900 font-medium">{selectedTournament.teams}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-medium uppercase text-gray-500">Fecha Inicio</Label>
                  <p className="text-gray-900 font-medium">{formatDate(selectedTournament.startDate)}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium uppercase text-gray-500">Fecha Fin</Label>
                  <p className="text-gray-900 font-medium">{formatDate(selectedTournament.endDate)}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  onClick={() => {
                    openEditDialog(selectedTournament);
                    setIsDetailsDialogOpen(false);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button 
                  type="button" 
                  onClick={() => handleDeleteTournament(selectedTournament.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cerrar</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Torneo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditTournament} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tournament-name">Nombre del Torneo*</Label>
              <Input
                id="edit-tournament-name"
                placeholder="Ej: Torneo Interfacultades"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-sport">Deporte*</Label>
              <Select value={formData.sport} onValueChange={(value) => setFormData({...formData, sport: value})}>
                <SelectTrigger id="edit-sport">
                  <SelectValue placeholder="Selecciona un deporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fútbol">Fútbol</SelectItem>
                  <SelectItem value="Baloncesto">Baloncesto</SelectItem>
                  <SelectItem value="Voleibol">Voleibol</SelectItem>
                  <SelectItem value="Tenis de Mesa">Tenis de Mesa</SelectItem>
                  <SelectItem value="Badminton">Badminton</SelectItem>
                  <SelectItem value="Atletismo">Atletismo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-teams">Número de Equipos</Label>
              <Input
                id="edit-teams"
                type="number"
                placeholder="0"
                min="0"
                value={formData.teams === 0 ? "" : formData.teams}
                onChange={(e) => setFormData({...formData, teams: e.target.value === "" ? 0 : parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start-date">Fecha de Inicio*</Label>
                <Input
                  id="edit-start-date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end-date">Fecha de Fin*</Label>
                <Input
                  id="edit-end-date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inscripciones">Inscripciones</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Guardar Cambios</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      </>
      )}
    </div>
  );
}