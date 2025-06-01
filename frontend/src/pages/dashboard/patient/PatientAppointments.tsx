import { useState } from 'react';
import { format, isAfter, isBefore, isSameDay } from 'date-fns';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Search, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Mock data for appointments
const appointments = [
  {
    id: '1',
    doctorName: 'Dr. Asma Belhadj',
    doctorSpecialty: 'Cardiologie',
    date: new Date(2025, 4, 15, 14, 30), // Future date
    status: 'confirmed',
    location: '15 Rue de Carthage, Tunis',
  },
  {
    id: '2',
    doctorName: 'Dr. Mohamed Karim',
    doctorSpecialty: 'Médecine générale',
    date: new Date(2025, 4, 20, 10, 0), // Future date
    status: 'pending',
    location: '8 Avenue Habib Bourguiba, Sousse',
  },
  {
    id: '3',
    doctorName: 'Dr. Fatma Haddad',
    doctorSpecialty: 'Dermatologie',
    date: new Date(2025, 3, 25, 9, 0), // Past date
    status: 'completed',
    location: '22 Rue Ibn Khaldoun, Tunis',
  },
  {
    id: '4',
    doctorName: 'Dr. Ahmed Ben Salah',
    doctorSpecialty: 'Ophtalmologie',
    date: new Date(2025, 3, 10, 16, 30), // Past date
    status: 'cancelled',
    location: '45 Avenue 14 Janvier, Sfax',
  },
  {
    id: '5',
    doctorName: 'Dr. Nadia Mansour',
    doctorSpecialty: 'Pédiatrie',
    date: new Date(2025, 4, 28, 11, 0), // Future date
    status: 'confirmed',
    location: '3 Rue de France, Monastir',
  },
  // Upcoming appointments (à venir)
  {
    id: '6',
    doctorName: 'Dr. Hichem Ben Romdhane',
    doctorSpecialty: 'Neurologie',
    date: new Date(2025, 4, 31, 15, 0), // Future appointment
    status: 'confirmed',
    location: '12 Rue de Marseille, Tunis',
  },
  {
    id: '7',
    doctorName: 'Dr. Sana Chikhaoui',
    doctorSpecialty: 'Gynécologie',
    date: new Date(2025, 5, 1, 11, 30), // Future appointment
    status: 'pending',
    location: '7 Avenue de la Liberté, Sfax',
  },
  {
    id: '8',
    doctorName: 'Dr. Walid Gharbi',
    doctorSpecialty: 'Biologie',
    date: new Date(2025, 5, 2, 9, 0), // Future appointment
    status: 'confirmed',
    location: '5 Rue Ibn Sina, Tunis',
  },
];

const PatientAppointments = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null);
  
  const now = new Date();
  
  // Filter appointments based on search term and tab
  const filterAppointments = (appointments: typeof appointments, tab: string) => {
    return appointments
      .filter(appointment => {
        // Filter by search term
        const matchesSearch = appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              appointment.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              appointment.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by tab
        if (tab === 'upcoming') {
          return isAfter(appointment.date, now) && appointment.status !== 'cancelled' && matchesSearch;
        } else if (tab === 'past') {
          return (isBefore(appointment.date, now) || appointment.status === 'cancelled') && matchesSearch;
        }
        
        return matchesSearch;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const upcomingAppointments = filterAppointments(appointments, 'upcoming');
  const pastAppointments = filterAppointments(appointments, 'past');

  // Handle appointment cancellation
  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;
    
    // In a real app, this would send a request to the backend
    // For demo purposes, we'll just show a toast
    toast({
      title: "Rendez-vous annulé",
      description: `Votre rendez-vous avec ${selectedAppointment.doctorName} le ${format(selectedAppointment.date, 'EEEE d MMMM', { locale: fr })} a été annulé.`,
    });
    
    setCancelDialogOpen(false);
    setSelectedAppointment(null);
  };

  // Handle opening the cancel dialog
  const openCancelDialog = (appointment: typeof appointments[0]) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  // Get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-600/20 text-green-600 border-green-600">Confirmé</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-600/20 text-blue-600 border-blue-600">En attente</Badge>; 
      case 'completed':
        return <Badge variant="outline" className="bg-primary/20 text-primary border-primary">Effectué</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Mes Rendez-vous</h1>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un rendez-vous..."
            className="pl-8 w-full md:w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            Passés & Annulés
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          {upcomingAppointments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Médecin</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.doctorName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(appointment.date, 'EEEE d MMMM yyyy', { locale: fr })}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{format(appointment.date, 'HH:mm', { locale: fr })}</span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.location}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => openCancelDialog(appointment)}
                          disabled={appointment.status === 'cancelled'}
                        >
                          Annuler
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 border rounded-md">
              <p className="text-muted-foreground">Vous n'avez aucun rendez-vous à venir.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          {pastAppointments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Médecin</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{appointment.doctorName}</p>
                          <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(appointment.date, 'EEEE d MMMM yyyy', { locale: fr })}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{format(appointment.date, 'HH:mm', { locale: fr })}</span>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.location}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        {appointment.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            Noter
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 border rounded-md">
              <p className="text-muted-foreground">Vous n'avez aucun rendez-vous passé ou annulé.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler le rendez-vous</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="py-4">
              <div className="flex items-center justify-center mb-4 text-destructive">
                <AlertTriangle className="h-12 w-12" />
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Médecin</p>
                  <p className="font-medium">{selectedAppointment.doctorName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Date et heure</p>
                  <p>{format(selectedAppointment.date, 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Lieu</p>
                  <p>{selectedAppointment.location}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Retour
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Confirmer l'annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientAppointments;