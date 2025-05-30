import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ArrowLeft, 
  Clock, 
  Calendar as CalendarIcon, 
  Star, 
  Check 
} from 'lucide-react';

// Mock data for doctors
const doctors = [
  {
    id: '1',
    name: 'Dr. Asma Belhadj',
    specialty: 'Cardiologie',
    description: 'Cardiologue spécialisée dans les maladies cardiovasculaires avec plus de 15 ans d\'expérience. Diplômée de la Faculté de Médecine de Tunis et formée en France.',
    address: '15 Rue de Carthage, Tunis',
    city: 'Tunis',
    phone: '+216 71 123 456',
    email: 'asma.belhadj@medirdv.tn',
    rating: 4.8,
    reviewCount: 127,
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Tunis', year: '2003' },
      { degree: 'Spécialisation en Cardiologie', institution: 'CHU La Pitié-Salpêtrière, Paris', year: '2008' }
    ],
    languages: ['Arabe', 'Français', 'Anglais'],
    availableDays: [1, 2, 3, 5], // Monday, Tuesday, Wednesday, Friday
    timeSlots: [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ],
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    name: 'Dr. Mohamed Karim',
    specialty: 'Médecine générale',
    description: 'Médecin généraliste attentif et à l\'écoute, avec 10 ans de pratique. Spécialisé dans la médecine préventive et le suivi des maladies chroniques.',
    address: '8 Avenue Habib Bourguiba, Sousse',
    city: 'Sousse',
    phone: '+216 73 456 789',
    email: 'mohamed.karim@medirdv.tn',
    rating: 4.6,
    reviewCount: 85,
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Sousse', year: '2010' }
    ],
    languages: ['Arabe', 'Français'],
    availableDays: [0, 2, 4], // Sunday, Tuesday, Thursday
    timeSlots: [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
      '11:00', '11:30', '14:00', '14:30', '15:00'
    ],
    image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    name: 'Dr. Fatma Haddad',
    specialty: 'Dermatologie',
    description: 'Dermatologue spécialisée dans le traitement de l\'acné, des maladies de peau et la dermatologie esthétique. Pratique moderne et approche personnalisée.',
    address: '22 Rue Ibn Khaldoun, Tunis',
    city: 'Tunis',
    phone: '+216 71 987 654',
    email: 'fatma.haddad@medirdv.tn',
    rating: 4.9,
    reviewCount: 156,
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Tunis', year: '2008' },
      { degree: 'Spécialisation en Dermatologie', institution: 'Hôpital Saint-Louis, Paris', year: '2013' }
    ],
    languages: ['Arabe', 'Français', 'Anglais', 'Italien'],
    availableDays: [1, 3, 5, 6], // Monday, Wednesday, Friday, Saturday
    timeSlots: [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
      '14:00', '14:30', '15:00', '15:30'
    ],
    image: 'https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
];

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const doctor = doctors.find(doc => doc.id === id);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold">Médecin non trouvé</h1>
        <p className="text-muted-foreground">
          Le médecin que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Button asChild>
          <Link to="/dashboard/patient/search">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la recherche
          </Link>
        </Button>
      </div>
    );
  }

  // Generate available days for the next 30 days
  const today = new Date();
  const next30Days = Array.from({ length: 30 }, (_, i) => addDays(today, i))
    .filter(date => doctor.availableDays.includes(date.getDay()));

  // Helper function to check if a day is selectable
  const isDateSelectable = (date: Date) => {
    return doctor.availableDays.includes(date.getDay());
  };

  // Generate available slots for the selected date
  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    
    // In a real app, this would come from a backend API
    // For demo purposes, we'll use the timeSlots array from doctor data
    // and randomly mark some as unavailable
    return doctor.timeSlots.map(time => ({
      time,
      available: Math.random() > 0.3 // 70% chance of being available
    }));
  };

  const availableSlots = getAvailableSlots();

  // Handle appointment booking
  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) return;
    
    // Close dialog
    setIsDialogOpen(false);
    
    // Show success toast
    toast({
      title: "Rendez-vous confirmé",
      description: `Votre rendez-vous avec ${doctor.name} le ${format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })} à ${selectedTime} a été confirmé.`,
      variant: "default",
    });
    
    // Reset selections
    setSelectedDate(undefined);
    setSelectedTime(null);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/dashboard/patient/search" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la recherche
        </Link>
      </Button>
      
      {/* Doctor Profile Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={doctor.image} 
              alt={doctor.name} 
              className="w-full h-auto object-cover" 
            />
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-2xl font-bold">{doctor.name}</h1>
          <Badge variant="outline" className="font-normal">
            {doctor.specialty}
          </Badge>
          
          <p className="text-muted-foreground">{doctor.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm">{doctor.address}</p>
                <p className="text-sm text-muted-foreground">{doctor.city}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm">{doctor.phone}</p>
                <p className="text-sm text-muted-foreground">Téléphone</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm">{doctor.email}</p>
                <p className="text-sm text-muted-foreground">Email</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm">{doctor.rating} / 5 ({doctor.reviewCount} avis)</p>
                <p className="text-sm text-muted-foreground">Avis patients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Appointment Booking Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Formation</h2>
              <ul className="space-y-2">
                {doctor.education.map((edu, index) => (
                  <li key={index} className="text-sm">
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-muted-foreground">{edu.institution}, {edu.year}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Langues parlées</h2>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((language, index) => (
                  <Badge key={index} variant="secondary">
                    {language}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Jours de consultation</h2>
              <ul className="space-y-1 text-sm">
                {['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((day, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {doctor.availableDays.includes(index) ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <span className="h-4 w-4" />
                    )}
                    <span className={!doctor.availableDays.includes(index) ? 'text-muted-foreground' : ''}>
                      {day}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Prendre rendez-vous</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Choisissez une date
                  </h3>
                  <div className="border rounded-md p-4">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => {
                        // Disable dates in the past and dates that are not selectable
                        return date < new Date() || !isDateSelectable(date);
                      }}
                      className="rounded-md border"
                      locale={fr}
                    />
                    
                    {!selectedDate && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Prochaines disponibilités: {next30Days.length > 0 
                          ? format(next30Days[0], 'EEEE d MMMM', { locale: fr }) 
                          : 'Aucune disponibilité'}
                      </p>
                    )}
                  </div>
                </div>
                
                {selectedDate && (
                  <div>
                    <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Choisissez un horaire pour le {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
                    </h3>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {availableSlots.map((slot, index) => (
                        <Button
                          key={index}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          className={`${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full mt-4" 
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setIsDialogOpen(true)}
                >
                  Prendre rendez-vous
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer votre rendez-vous</DialogTitle>
            <DialogDescription>
              Veuillez vérifier les détails de votre rendez-vous avant de confirmer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Médecin</span>
              <span className="font-medium">{doctor.name}</span>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Spécialité</span>
              <span>{doctor.specialty}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Date</span>
                <span>{selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Heure</span>
                <span>{selectedTime}</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">Adresse</span>
              <span>{doctor.address}, {doctor.city}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleBookAppointment}>
              Confirmer le rendez-vous
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorProfile;