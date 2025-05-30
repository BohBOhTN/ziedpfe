import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

// Pages
import LandingPage from '@/pages/LandingPage';
import SignupPage from '@/pages/SignupPage';
import LoginPage from '@/pages/LoginPage';
import PatientDashboard from '@/pages/dashboard/patient/PatientDashboard';
import DoctorDashboard from '@/pages/dashboard/doctor/DoctorDashboard';
import NotFoundPage from '@/pages/NotFoundPage';

// Context
import { AuthProvider } from '@/context/AuthContext';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Patient Dashboard Routes */}
            <Route path="/dashboard/patient" element={<PatientDashboard />} />
            <Route path="/dashboard/patient/*" element={<PatientDashboard />} />
            
            {/* Doctor Dashboard Routes */}
            <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
            <Route path="/dashboard/doctor/*" element={<DoctorDashboard />} />
            
            {/* 404 and fallback */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404\" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;