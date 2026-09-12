import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDashboard from './pages/DoctorDashboard';
import AddPatient from './pages/AddPatient';
import PatientDetail from './pages/PatientDetail';
import PatientHome from './pages/PatientHome';
import LogReading from './pages/LogReading';
import ChangePassword from './pages/ChangePassword';

function Private({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'doctor' ? '/doctor' : '/me'} replace />;
  }
  return children;
}

function GuestOnly({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'doctor' ? '/doctor' : '/me'} replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/login"
              element={
                <GuestOnly>
                  <Login />
                </GuestOnly>
              }
            />
            <Route
              path="/register"
              element={
                <GuestOnly>
                  <Register />
                </GuestOnly>
              }
            />
            <Route
              path="/doctor"
              element={
                <Private role="doctor">
                  <DoctorDashboard />
                </Private>
              }
            />
            <Route
              path="/add-patient"
              element={
                <Private role="doctor">
                  <AddPatient />
                </Private>
              }
            />
            <Route
              path="/patient/:id"
              element={
                <Private role="doctor">
                  <PatientDetail />
                </Private>
              }
            />
            <Route
              path="/me"
              element={
                <Private role="patient">
                  <PatientHome />
                </Private>
              }
            />
            <Route
              path="/log"
              element={
                <Private role="patient">
                  <LogReading />
                </Private>
              }
            />
            <Route path="/change-password" element={<Private><ChangePassword /></Private>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
