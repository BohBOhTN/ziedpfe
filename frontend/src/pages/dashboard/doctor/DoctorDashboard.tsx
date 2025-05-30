import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DoctorHome from '@/pages/dashboard/doctor/DoctorHome';
import DoctorAppointments from '@/pages/dashboard/doctor/DoctorAppointments';
import DoctorPatients from '@/pages/dashboard/doctor/DoctorPatients';
import DoctorAvailability from '@/pages/dashboard/doctor/DoctorAvailability';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    {
      title: 'Accueil',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/dashboard/doctor',
      exact: true,
    },
    {
      title: 'Mes Rendez-vous',
      icon: <Calendar className="h-5 w-5" />,
      href: '/dashboard/doctor/appointments',
    },
    {
      title: 'Mes Patients',
      icon: <Users className="h-5 w-5" />,
      href: '/dashboard/doctor/patients',
    },
    {
      title: 'Mes Disponibilités',
      icon: <Clock className="h-5 w-5" />,
      href: '/dashboard/doctor/availability',
    },
  ];

  // Redirect if user is not authenticated or is not a doctor
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'doctor')) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // If still loading, show nothing
  if (isLoading) {
    return null;
  }

  // If not authenticated or not a doctor, don't render anything (redirect will happen)
  if (!isAuthenticated || user?.role !== 'doctor') {
    return null;
  }

  return (
    <DashboardLayout navItems={navItems} userRole="doctor">
      <Routes>
        <Route path="/" element={<DoctorHome />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="availability" element={<DoctorAvailability />} />
        <Route path="*" element={<Navigate to="/dashboard/doctor\" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DoctorDashboard;