import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Calendar, Phone, Mail, MapPin, Filter, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock data for patients
const patients = [
  {
    id: '1',
    name: 'Leila Ben Ali',
    email: 'leila.benali@gmail.com',
    phone: '+216 98 123 456',
    address: '15 Rue de Carthage, Tunis',
    dateOfBirth: new Date(1985, 5, 12),
    lastVisit: new Date(2025, 3, 15),
    nextAppointment: new Date(2025, 4, 15),
    status: 'active',
    medicalHistory: [
      { date: new Date(2024, 11, 10), diagnosis: 'Hypertension', treatment: 'Lisinopril 10mg' },
      { date: new Date(2025, 2, 15), diagnosis: 'Suivi hypertension', treatment: 'Maintien traitement' },
      { date: new Date(2025, 3, 15), diagnosis: 'Suivi hypertension', treatment: 'Ajustement dosage' },
    ],
    allergies: ['Pénicilline'],
    notes: 'Antécédents familiaux d\'hypertension',
  },
  {
    id: '2',
    name: 'Youssef Trabelsi',
    email: 'youssef.trabelsi@gmail.com',
    phone: '+216 55 789 123',
    address: '8 Avenue Habib Bourguiba, Sousse',
    dateOfBirth: new Date(1978, 2, 24),
    lastVisit: new Date(2025, 4, 5),
    nextAppointment: new Date(2025, 4, 14),
    status: 'active',
    medicalHistory: [
      { date: new Date(2025, 0, 20), diagnosis: 'Diabète type 2', treatment: 'Metformine 500mg' },
      { date: new Date(2025, 2, 15), diagnosis: 'Suivi diabète', treatment: 'Ajustement régime alimentaire' },
      { date: new Date(2025, 4, 5), diagnosis: 'Suivi post-opératoire', treatment: 'Antibiotiques' },
    ],
    allergies: [],
    notes: 'Patient diabétique, surveiller glycémie',
  },
  {
    id: '3',
    name: 'Amina Khalifa',
    email: 'amina.khalifa@gmail.com',
    phone: '+216 22 456 789',
    address: '22 Rue Ibn Khaldoun, Tunis',
    dateOfBirth: new Date(1992, 8, 5),
    lastVisit: null,
    nextAppointment: new Date(2025, 4, 14),
    status: 'new',
    medicalHistory: [],
    allergies: ['Sulfamides'],
    notes: 'Nouvelle patiente',
  },
  {
    id: '4',
    name: 'Karim Bouazizi',
    email: 'karim.bouazizi@gmail.com',
    phone: '+216 99 789 123',
    address: '10 Rue Ali Bach Hamba, Tunis',
    dateOfBirth: new Date(1965, 4, 17),
    lastVisit: new Date(2025, 2, 10),
    nextAppointment: null,
    status: 'inactive',
    medicalHistory: [
      { date: new Date(2024, 10, 5), diagnosis: 'Arythmie', treatment: 'Bêta-bloquants' },
      { date: new Date(2025, 0, 10), diagnosis: 'Suivi arythmie', treatment: 'Ajustement dosage' },
      { date: new Date(2025, 2, 10), diagnosis: 'Contrôle ECG', treatment: 'Maintien traitement' },
    ],
    allergies: ['Aspirine'],
    notes: 'Antécédents d\'infarctus en 2020',
  },
  {
    id: '5',
    name: 'Sami Abidi',
    email: 'sami.abidi@gmail.com',
    phone: '+216 54 123 456',
    address: '5 Rue de Marseille, Tunis',
    dateOfBirth: new Date(1970, 1, 8),
    lastVisit: new Date(2025, 3, 25),
    nextAppointment: new Date(2025, 4, 15),
    status: 'active',
    medicalHistory: [
      { date: new Date(2025, 0, 15), diagnosis: 'Hypercholestérolémie', treatment: 'Statines' },
      { date: new Date(2025, 3, 25), diagnosis: 'Douleurs thoraciques', treatment: 'Examens complémentaires' },
    ],
    allergies: [],
    notes: 'Patient hypertensif, sous traitement',
  },
  {
    id: '6',
    name: 'Noura Mansour',
    email: 'noura.mansour@gmail.com',
    phone: '+216 23 789 456',
    address: '12 Avenue Mohamed V, Tunis',
    dateOfBirth: new Date(1988, 10, 20),
    lastVisit: new Date(2025, 3, 5),
    nextAppointment: new Date(2025, 4, 15),
    status: 'active',
    medicalHistory: [
      { date: new Date(2025, 1, 10), diagnosis: 'Migraine', treatment: 'Triptans' },
      { date: new Date(2025, 3, 5), diagnosis: 'Suivi migraine', treatment: 'Ajustement traitement' },
    ],
    allergies: ['Paracétamol'],
    notes: 'Migraines chroniques',
  },
];

const DoctorPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'new' | 'inactive'>('all');
  
  // Filter patients based on search term and status filter
  const filteredPatients = patients.filter(patient => {
    // Filter by search term
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.phone.includes(searchTerm);
    
    // Filter by status
    if (activeFilter === 'all') {
      return matchesSearch;
    } else {
      return patient.status === activeFilter && matchesSearch;
    }
  });
  
  // Count patients by status
  const countByStatus = {
    all: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    new: patients.filter(p => p.status === 'new').length,
    inactive: patients.filter(p => p.status === 'inactive').length,
  };
  
  // Handle viewing patient details
  const openDetailsDialog = (patient: typeof patients[0]) => {
    setSelectedPatient(patient);
    setDetailsDialogOpen(true);
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline\" className="bg-success/20 text-success border-success">Actif</Badge>;
      case 'new':
        return <Badge variant="outline" className="bg-primary/20 text-primary border-primary">Nouveau</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-muted/80 text-muted-foreground">Inactif</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  // Format age
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Mes Patients</h1>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un patient..."
            className="pl-8 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card 
          className={`cursor-pointer hover:border-primary transition-colors ${activeFilter === 'all' ? 'bg-primary/5 border-primary' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Tous les patients</p>
              <p className="text-2xl font-bold">{countByStatus.all}</p>
            </div>
            <Filter className={`h-5 w-5 ${activeFilter === 'all' ? 'text-primary' : 'text-muted-foreground'}`} />
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:border-primary transition-colors ${activeFilter === 'active' ? 'bg-primary/5 border-primary' : ''}`}
          onClick={() => setActiveFilter('active')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Patients actifs</p>
              <p className="text-2xl font-bold">{countByStatus.active}</p>
            </div>
            <Filter className={`h-5 w-5 ${activeFilter === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:border-primary transition-colors ${activeFilter === 'new' ? 'bg-primary/5 border-primary' : ''}`}
          onClick={() => setActiveFilter('new')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Nouveaux patients</p>
              <p className="text-2xl font-bold">{countByStatus.new}</p>
            </div>
            <Filter className={`h-5 w-5 ${activeFilter === 'new' ? 'text-primary' : 'text-muted-foreground'}`} />
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer hover:border-primary transition-colors ${activeFilter === 'inactive' ? 'bg-primary/5 border-primary' : ''}`}
          onClick={() => setActiveFilter('inactive')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Patients inactifs</p>
              <p className="text-2xl font-bold">{countByStatus.inactive}</p>
            </div>
            <Filter className={`h-5 w-5 ${activeFilter === 'inactive' ? 'text-primary' : 'text-muted-foreground'}`} />
          </CardContent>
        </Card>
      </div>
      
      {/* Patients Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Dernière visite</TableHead>
              <TableHead>Prochain RDV</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{format(patient.dateOfBirth, 'dd/MM/yyyy')} ({calculateAge(patient.dateOfBirth)} ans)</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {patient.phone}
                      </p>
                      <p className="text-sm flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {patient.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.lastVisit ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(patient.lastVisit, 'dd/MM/yyyy')}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Jamais</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {patient.nextAppointment ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(patient.nextAppointment, 'dd/MM/yyyy')}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Aucun</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(patient.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDetailsDialog(patient)}>
                          Voir dossier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Ajouter rendez-vous
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Ajouter note
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          Modifier informations
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Aucun patient trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Patient Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Dossier patient</DialogTitle>
            <DialogDescription>
              Informations complètes du patient
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Patient Info */}
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Informations personnelles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nom complet</p>
                        <p className="font-medium">{selectedPatient.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date de naissance</p>
                        <p>{format(selectedPatient.dateOfBirth, 'd MMMM yyyy', { locale: fr })} ({calculateAge(selectedPatient.dateOfBirth)} ans)</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Statut</p>
                        <div className="mt-1">{getStatusBadge(selectedPatient.status)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                          {selectedPatient.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                          {selectedPatient.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Adresse</p>
                        <p className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          {selectedPatient.address}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Medical History & Appointments */}
                <div className="md:col-span-2 space-y-6">
                  {/* Appointments */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Rendez-vous</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Dernière visite</p>
                          {selectedPatient.lastVisit ? (
                            <p className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                              {format(selectedPatient.lastVisit, 'EEEE d MMMM yyyy', { locale: fr })}
                            </p>
                          ) : (
                            <p className="text-muted-foreground mt-1">Jamais</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Prochain rendez-vous</p>
                          {selectedPatient.nextAppointment ? (
                            <div className="flex flex-col mt-1">
                              <p className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                {format(selectedPatient.nextAppointment, 'EEEE d MMMM yyyy', { locale: fr })}
                              </p>
                              <p className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                {format(selectedPatient.nextAppointment, 'HH:mm', { locale: fr })}
                              </p>
                            </div>
                          ) : (
                            <p className="text-muted-foreground mt-1">Aucun rendez-vous prévu</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm">
                          Voir tous les rendez-vous
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Medical History */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Historique médical</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedPatient.medicalHistory.length > 0 ? (
                        <div className="space-y-4">
                          {selectedPatient.medicalHistory.map((record, index) => (
                            <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                              <div className="flex justify-between items-center mb-1">
                                <p className="font-medium">{record.diagnosis}</p>
                                <p className="text-sm text-muted-foreground">{format(record.date, 'd MMMM yyyy', { locale: fr })}</p>
                              </div>
                              <p className="text-sm">Traitement: {record.treatment}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Aucun historique médical</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Allergies & Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Allergies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedPatient.allergies.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedPatient.allergies.map((allergy, index) => (
                              <li key={index}>{allergy}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">Aucune allergie connue</p>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedPatient.notes ? (
                          <p>{selectedPatient.notes}</p>
                        ) : (
                          <p className="text-muted-foreground">Aucune note</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Fermer
            </Button>
            <Button>
              Modifier dossier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorPatients;