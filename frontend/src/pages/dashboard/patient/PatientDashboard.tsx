import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PatientHome from '@/pages/dashboard/patient/PatientHome';
import DoctorSearch from '@/pages/dashboard/patient/DoctorSearch';
import DoctorProfile from '@/pages/dashboard/patient/DoctorProfile';
import PatientAppointments from '@/pages/dashboard/patient/PatientAppointments';
import {
  LayoutDashboard,
  Search,
  Calendar
} from 'lucide-react';

const PatientDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      title: 'Accueil',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/dashboard/patient',
      exact: true,
    },
    {
      title: 'Rechercher un médecin',
      icon: <Search className="h-5 w-5" />,
      href: '/dashboard/patient/search',
    },
    {
      title: 'Mes Rendez-vous',
      icon: <Calendar className="h-5 w-5" />,
      href: '/dashboard/patient/appointments',
    },
  ];

  // Redirect if user is not authenticated or is a doctor
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'patient')) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // If still loading, show nothing
  if (isLoading) {
    return null;
  }

  // If not authenticated or not a patient, don't render anything (redirect will happen)
  if (!isAuthenticated || user?.role !== 'patient') {
    return null;
  }

  return (
    <DashboardLayout navItems={navItems} userRole="patient">
      <Routes>
        <Route path="/" element={<PatientHome />} />
        <Route path="search" element={<DoctorSearch />} />
        <Route path="doctor/:id" element={<DoctorProfile />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="*" element={<Navigate to="/dashboard/patient\" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default PatientDashboard;