import { Plus, Search, Calendar, Users, Trophy, X, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export function Tournaments() {
  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      name: "Torneo Interfacultades 2026-I",
      status: "Activo",
      sport: "Fútbol",
      teams: 16,
      startDate: "15 Mar 2026",
      endDate: "30 Jun 2026",
      color: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      name: "Copa ETITC Relámpago",
      status: "Inscripciones",
      sport: "Baloncesto",
      teams: 8,
      startDate: "1 Abr 2026",
      endDate: "5 Abr 2026",
      color: "bg-orange-100 text-orange-800"
    },
    {
      id: 3,
      name: "Torneo de Novatos",
      status: "Activo",
      sport: "Voleibol",
      teams: 12,
      startDate: "1 Feb 2026",
      endDate: "15 May 2026",
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 4,
      name: "Campeonato Abierto",
      status: "Activo",
      sport: "Tenis de Mesa",
      teams: 32,
      startDate: "15 Mar 2026",
      endDate: "30 Abr 2026",
      color: "bg-red-100 text-red-800"
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [sportFilter, setSportFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    teams: 0,
    startDate: "",
    endDate: "",
    status: "Inscripciones"
  });

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sport || !formData.startDate || !formData.endDate) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    const newTournament = {
      id: tournaments.length + 1,
      name: formData.name,
      status: formData.status,
      sport: formData.sport,
      teams: formData.teams,
      startDate: new Date(formData.startDate).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
      endDate: new Date(formData.endDate).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
      color: "bg-purple-100 text-purple-800"
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
  };

  const handleEditTournament = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sport || !formData.startDate || !formData.endDate) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    setTournaments(tournaments.map(t => 
      t.id === editingId 
        ? {
            ...t,
            name: formData.name,
            status: formData.status,
            sport: formData.sport,
            teams: formData.teams,
            startDate: new Date(formData.startDate).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
            endDate: new Date(formData.endDate).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })
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
  };

  const openEditDialog = (tournament: any) => {
    setEditingId(tournament.id);
    setFormData({
      name: tournament.name,
      sport: tournament.sport,
      teams: tournament.teams,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      status: tournament.status
    });
    setIsEditDialogOpen(true);
  };

  const openDetailsDialog = (tournament: any) => {
    setSelectedTournament(tournament);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteTournament = (id: number) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este torneo?")) {
      setTournaments(tournaments.filter(t => t.id !== id));
      setIsDetailsDialogOpen(false);
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
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide mb-2 ${t.color}`}>
                {t.sport}
              </span>
              <div className="space-y-2 mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                  {t.teams} Equipos inscritos
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                  {t.startDate} - {t.endDate}
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
                  <p className="text-gray-900 font-medium">{selectedTournament.startDate}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium uppercase text-gray-500">Fecha Fin</Label>
                  <p className="text-gray-900 font-medium">{selectedTournament.endDate}</p>
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
    </div>
  );
}