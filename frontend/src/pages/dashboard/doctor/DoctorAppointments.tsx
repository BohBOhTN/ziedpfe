import { useState } from 'react';
import { format, isSameDay, isAfter, isBefore, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
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
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Clock, Search, MoreHorizontal, CalendarIcon, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Mock data for appointments
const appointmentsData = [
  {
    id: '1',
    patientName: 'Leila Ben Ali',
    patientPhone: '+216 98 123 456',
    date: new Date(2025, 4, 14, 9, 0),
    status: 'confirmed',
    reason: 'Consultation de routine',
    notes: '',
    isNewPatient: false,
  },
  {
    id: '2',
    patientName: 'Youssef Trabelsi',
    patientPhone: '+216 55 789 123',
    date: new Date(2025, 4, 14, 10, 30),
    status: 'confirmed',
    reason: 'Suivi post-opératoire',
    notes: 'Vérifier les résultats d\'analyse',
    isNewPatient: false,
  },
  {
    id: '3',
    patientName: 'Amina Khalifa',
    patientPhone: '+216 22 456 789',
    date: new Date(2025, 4, 14, 14, 0),
    status: 'confirmed',
    reason: 'Première consultation',
    notes: '',
    isNewPatient: true,
  },
  {
    id: '4',
    patientName: 'Karim Bouazizi',
    patientPhone: '+216 99 789 123',
    date: new Date(2025, 4, 14, 16, 30),
    status: 'cancelled',
    reason: 'Consultation de routine',
    notes: 'Patient a annulé pour raisons personnelles',
    isNewPatient: false,
  },
  {
    id: '5',
    patientName: 'Sami Abidi',
    patientPhone: '+216 54 123 456',
    date: new Date(2025, 4, 15, 11, 0),
    status: 'confirmed',
    reason: 'Douleurs thoraciques',
    notes: 'Patient hypertensif',
    isNewPatient: false,
  },
  {
    id: '6',
    patientName: 'Noura Mansour',
    patientPhone: '+216 23 789 456',
    date: new Date(2025, 4, 15, 15, 30),
    status: 'confirmed',
    reason: 'Suivi traitement',
    notes: '',
    isNewPatient: false,
  },
  {
    id: '7',
    patientName: 'Mehdi Khelifi',
    patientPhone: '+216 97 456 123',
    date: new Date(2025, 4, 10, 9, 30), // Past appointment
    status: 'completed',
    reason: 'Contrôle annuel',
    notes: 'RAS',
    isNewPatient: false,
  },
  {
    id: '8',
    patientName: 'Fatma Riahi',
    patientPhone: '+216 52 789 123',
    date: new Date(2025, 4, 10, 14, 0), // Past appointment
    status: 'no-show',
    reason: 'Suivi traitement',
    notes: 'Patient ne s\'est pas présenté sans prévenir',
    isNewPatient: false,
  },
  // Upcoming appointments (à venir)
  {
    id: '9',
    patientName: 'Imen Jaziri',
    patientPhone: '+216 21 654 987',
    date: new Date(2025, 4, 31, 10, 0), // Future appointment
    status: 'confirmed',
    reason: 'Consultation nutrition',
    notes: '',
    isNewPatient: true,
  },
  {
    id: '10',
    patientName: 'Walid Gharbi',
    patientPhone: '+216 20 123 321',
    date: new Date(2025, 5, 1, 9, 30), // Future appointment
    status: 'confirmed',
    reason: 'Bilan sanguin',
    notes: '',
    isNewPatient: false,
  },
  {
    id: '11',
    patientName: 'Sonia Messaoudi',
    patientPhone: '+216 29 888 777',
    date: new Date(2025, 5, 2, 11, 0), // Future appointment
    status: 'confirmed',
    reason: 'Consultation générale',
    notes: '',
    isNewPatient: false,
  },
];

const DoctorAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointmentsData[0] | null>(null);
  
  const { toast } = useToast();
  const now = new Date();
  
  // Filter appointments based on search term, selected date, and tab
  const filterAppointments = (appointments: typeof appointmentsData, tab: string) => {
    return appointments
      .filter(appointment => {
        // Filter by search term
        const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by selected date
        const matchesDate = !selectedDate || isSameDay(appointment.date, selectedDate);
        
        // Filter by tab
        if (tab === 'upcoming') {
          return isAfter(appointment.date, now) && appointment.status !== 'cancelled' && matchesSearch && matchesDate;
        } else if (tab === 'past') {
          return (isBefore(appointment.date, now) || appointment.status === 'cancelled' || appointment.status === 'no-show') && matchesSearch && matchesDate;
        }
        
        return matchesSearch && matchesDate;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };
  
  const upcomingAppointments = filterAppointments(appointmentsData, 'upcoming');
  const pastAppointments = filterAppointments(appointmentsData, 'past');

  // Handle viewing appointment details
  const openDetailsDialog = (appointment: typeof appointmentsData[0]) => {
    setSelectedAppointment(appointment);
    setDetailsDialogOpen(true);
  };
  
  // Handle marking appointment as completed
  const markAsCompleted = (appointmentId: string) => {
    // In a real app, this would send a request to the backend
    toast({
      title: "Rendez-vous terminé",
      description: "Le statut du rendez-vous a été mis à jour avec succès.",
    });
  };
  
  // Handle marking patient as no-show
  const markAsNoShow = (appointmentId: string) => {
    // In a real app, this would send a request to the backend
    toast({
      title: "Patient absent",
      description: "Le patient a été marqué comme absent.",
    });
  };
  
  // Handle cancelling appointment
  const cancelAppointment = (appointmentId: string) => {
    // In a real app, this would send a request to the backend
    toast({
      title: "Rendez-vous annulé",
      description: "Le rendez-vous a été annulé avec succès.",
    });
  };

  // Get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="outline\" className="bg-success/20 text-success border-success">Confirmé</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-primary/20 text-primary border-primary">Effectué</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive">Annulé</Badge>;
      case 'no-show':
        return <Badge variant="outline" className="bg-warning/20 text-warning border-warning">Absent</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Mes Rendez-vous</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Button
              variant="outline"
              className="w-full sm:w-auto flex items-center gap-2"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <CalendarIcon className="h-4 w-4" />
              {selectedDate ? format(selectedDate, "d MMM yyyy", { locale: fr }) : "Toutes les dates"}
            </Button>
            
            {isCalendarOpen && (
              <div className="absolute z-10 mt-2 right-0 bg-card rounded-md border shadow-md p-2">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }}
                  className="rounded-md border"
                />
                {selectedDate && (
                  <div className="flex justify-between mt-2 px-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedDate(undefined);
                        setIsCalendarOpen(false);
                      }}
                    >
                      Réinitialiser
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => setIsCalendarOpen(false)}
                    >
                      Appliquer
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming" className="relative">
            À venir
            {upcomingAppointments.length > 0 && (
              <span className="ml-2 rounded-full bg-primary text-primary-foreground h-5 min-w-5 px-1 text-xs flex items-center justify-center">
                {upcomingAppointments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">
            Passés, Annulés & Absents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          {upcomingAppointments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{appointment.patientName}</p>
                            {appointment.isNewPatient && (
                              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary text-[10px]">
                                Nouveau
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{appointment.patientPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(appointment.date, 'EEEE d MMMM', { locale: fr })}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{format(appointment.date, 'HH:mm', { locale: fr })}</span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.reason}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetailsDialog(appointment)}>
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => markAsCompleted(appointment.id)}>
                              Marquer comme effectué
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => markAsNoShow(appointment.id)}>
                              Marquer comme absent
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => cancelAppointment(appointment.id)} className="text-destructive">
                              Annuler rendez-vous
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 border rounded-md">
              <p className="text-muted-foreground">Aucun rendez-vous à venir trouvé.</p>
              {selectedDate && (
                <Button 
                  variant="link" 
                  onClick={() => setSelectedDate(undefined)}
                  className="mt-2"
                >
                  Voir tous les rendez-vous
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          {pastAppointments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.patientPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(appointment.date, 'EEEE d MMMM', { locale: fr })}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{format(appointment.date, 'HH:mm', { locale: fr })}</span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.reason}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDetailsDialog(appointment)}
                        >
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 border rounded-md">
              <p className="text-muted-foreground">Aucun rendez-vous passé trouvé.</p>
              {selectedDate && (
                <Button 
                  variant="link" 
                  onClick={() => setSelectedDate(undefined)}
                  className="mt-2"
                >
                  Voir tous les rendez-vous
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Appointment Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du rendez-vous</DialogTitle>
            <DialogDescription>
              Informations complètes sur le rendez-vous
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="py-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informations patient
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{selectedAppointment.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p>{selectedAppointment.patientPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Informations rendez-vous
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p>{format(selectedAppointment.date, 'EEEE d MMMM yyyy', { locale: fr })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Heure</p>
                    <p>{format(selectedAppointment.date, 'HH:mm', { locale: fr })}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Motif</p>
                    <p>{selectedAppointment.reason}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p>{selectedAppointment.notes || 'Aucune note'}</p>
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
              Voir dossier patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAppointments;