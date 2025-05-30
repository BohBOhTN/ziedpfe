import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, CheckCircle, Users, AlertTriangle, ChevronRight } from 'lucide-react';

// Mock data for today's appointments
const todayAppointments = [
  {
    id: '1',
    patientName: 'Leila Ben Ali',
    time: new Date(2025, 4, 14, 9, 0),
    status: 'confirmed',
    reason: 'Consultation de routine',
    isNewPatient: false,
  },
  {
    id: '2',
    patientName: 'Youssef Trabelsi',
    time: new Date(2025, 4, 14, 10, 30),
    status: 'confirmed',
    reason: 'Suivi post-opératoire',
    isNewPatient: false,
  },
  {
    id: '3',
    patientName: 'Amina Khalifa',
    time: new Date(2025, 4, 14, 14, 0),
    status: 'confirmed',
    reason: 'Première consultation',
    isNewPatient: true,
  },
  {
    id: '4',
    patientName: 'Karim Bouazizi',
    time: new Date(2025, 4, 14, 16, 30),
    status: 'cancelled',
    reason: 'Consultation de routine',
    isNewPatient: false,
  },
];

const DoctorHome = () => {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0];
  const currentDate = new Date();
  const formattedDate = format(currentDate, "EEEE d MMMM yyyy", { locale: fr });
  
  // Capitalize first letter of formatted date
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Calculate some statistics
  const activeAppointments = todayAppointments.filter(a => a.status === 'confirmed').length;
  const cancelledAppointments = todayAppointments.filter(a => a.status === 'cancelled').length;
  const newPatients = todayAppointments.filter(a => a.isNewPatient).length;
  
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bonjour, Dr. {firstName}</h1>
          <p className="text-muted-foreground">{capitalizedDate}</p>
        </div>
        <Button className="w-full md:w-auto" asChild>
          <Link to="/dashboard/doctor/availability">
            <Clock className="mr-2 h-4 w-4" />
            Gérer mes disponibilités
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendez-vous aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {cancelledAppointments > 0 && `${cancelledAppointments} annulé${cancelledAppointments > 1 ? 's' : ''}`}
              {cancelledAppointments === 0 && 'Aucun rendez-vous annulé'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newPatients}</div>
            <p className="text-xs text-muted-foreground">
              Aujourd'hui
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+4</span> ce mois-ci
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de présence</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-muted-foreground">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Rendez-vous d'aujourd'hui</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/doctor/appointments" className="flex items-center">
              Voir tous
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {activeAppointments > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todayAppointments
              .filter(appointment => appointment.status === 'confirmed')
              .sort((a, b) => a.time.getTime() - b.time.getTime())
              .map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
                    <CardDescription>{appointment.reason}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{format(appointment.time, "HH:mm", { locale: fr })}</span>
                    </div>
                    {appointment.isNewPatient && (
                      <div className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary inline-block">
                        Nouveau patient
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm">Dossier patient</Button>
                    <Button size="sm">Débuter</Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Aucun rendez-vous aujourd'hui</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Vous n'avez pas de rendez-vous programmés pour aujourd'hui.
              </p>
              <Button variant="outline" asChild>
                <Link to="/dashboard/doctor/availability">
                  Gérer mes disponibilités
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Cancelled Appointments */}
      {cancelledAppointments > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Rendez-vous annulés aujourd'hui</h2>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                <CardTitle className="text-base">Annulations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {todayAppointments
                  .filter(appointment => appointment.status === 'cancelled')
                  .map((appointment) => (
                    <li key={appointment.id} className="flex justify-between items-center text-sm py-1 border-b last:border-0">
                      <div>
                        <span className="font-medium">{appointment.patientName}</span>
                        <span className="text-muted-foreground ml-2">
                          {format(appointment.time, "HH:mm", { locale: fr })}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">Recontacter</Button>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Access */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Accès rapide</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gérer les rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Consultez, modifiez ou annulez vos rendez-vous programmés.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard/doctor/appointments">
                  Voir rendez-vous
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Liste des patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Consultez la liste de vos patients et accédez à leurs dossiers.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard/doctor/patients">
                  Voir patients
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gérer vos disponibilités</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Définissez vos horaires de consultation et jours de congé.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard/doctor/availability">
                  Gérer disponibilités
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;