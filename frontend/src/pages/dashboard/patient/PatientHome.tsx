import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Clock, Calendar, User } from 'lucide-react';

// Mock data for upcoming appointments
const upcomingAppointments = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Belhadj',
    specialty: 'Dermatologie',
    date: new Date(2025, 4, 15, 14, 30),
    status: 'confirmed',
  },
  {
    id: '2',
    doctorName: 'Dr. Mohamed Karim',
    specialty: 'Médecine générale',
    date: new Date(2025, 4, 20, 10, 0),
    status: 'pending',
  },
];

const PatientHome = () => {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0];
  const currentDate = new Date();
  const formattedDate = format(currentDate, "EEEE d MMMM yyyy", { locale: fr });
  
  // Capitalize first letter of formatted date
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bonjour, {firstName}</h1>
          <p className="text-muted-foreground">{capitalizedDate}</p>
        </div>
        <Button className="w-full md:w-auto" asChild>
          <Link to="/dashboard/patient/search">
            <Search className="mr-2 h-4 w-4" />
            Trouver un médecin
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochains rendez-vous</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Prochain: {upcomingAppointments.length > 0 
                ? format(upcomingAppointments[0].date, "d MMMM", { locale: fr }) 
                : "Aucun"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendez-vous passés</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Dernier: 25 avril
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médecins consultés</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Dans différentes spécialités
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Prochains rendez-vous</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <CardTitle>{appointment.doctorName}</CardTitle>
                  <CardDescription>{appointment.specialty}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(appointment.date, "EEEE d MMMM yyyy", { locale: fr })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{format(appointment.date, "HH:mm", { locale: fr })}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className={appointment.status === 'confirmed' 
                    ? "text-xs px-2 py-1 rounded-full bg-success/20 text-success"
                    : "text-xs px-2 py-1 rounded-full bg-warning/20 text-warning"
                  }>
                    {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/dashboard/patient/appointments`}>
                      Détails
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="mb-2">Vous n'avez aucun rendez-vous à venir.</p>
              <Button asChild className="mt-2">
                <Link to="/dashboard/patient/search">
                  Rechercher un médecin
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Accès rapide</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trouver un spécialiste</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Recherchez des médecins par spécialité, localisation ou disponibilité.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard/patient/search">
                  Rechercher
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gérer vos rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Consultez, modifiez ou annulez vos rendez-vous programmés.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard/patient/appointments">
                  Voir rendez-vous
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aide et support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Besoin d'aide ? Consultez notre FAQ ou contactez notre support.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Support
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientHome;