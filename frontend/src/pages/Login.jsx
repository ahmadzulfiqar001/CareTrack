import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button } from '../components/ui';
import authImg from '../assets/auth-consult.jpg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      nav(data.user.role === 'doctor' ? '/doctor' : '/me');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ct-container flex items-center py-4 lg:min-h-[calc(100vh-4.25rem)] lg:py-6">
      <div className="grid w-full overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card lg:grid-cols-2">
        <div className="relative hidden min-h-[480px] max-h-[calc(100vh-6rem)] bg-navy lg:block">
          <img
            src={authImg}
            alt="Doctor consulting with a patient"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/10" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-teal-200">
              Care that continues
            </p>
            <h1 className="font-display mt-2 text-3xl leading-tight">
              Stay on track.
              <br />
              Stay healthier.
            </h1>
            <p className="mt-2 max-w-sm text-sm text-slate-200">
              Doctors and patients share one follow-up loop between visits.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-7 sm:px-8 lg:px-10 lg:py-8">
          <Logo to="/" size="md" />
          <p className="ct-kicker mt-5">Secure access</p>
          <h2 className="ct-display mt-1.5 text-2xl sm:text-3xl">Welcome back</h2>
          <p className="mt-1.5 text-sm text-ink-muted">
            Log in with email and password to continue.
          </p>

          {error && (
            <div className="mt-4 rounded-control border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-5 space-y-3.5" noValidate>
            <div>
              <label className="ct-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className="ct-input !py-2.5"
                type="email"
                autoComplete="email"
                placeholder="you@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="ct-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="ct-input !py-2.5"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="navy" className="w-full !py-2.5" disabled={loading}>
              {loading ? 'Signing in…' : 'Log in'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-muted">
            No clinic account?{' '}
            <Link to="/register" className="font-semibold text-care-blue hover:underline">
              Register as doctor
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-ink-muted">
            Patients: use the email and password provided by your clinic.
          </p>
        </div>
      </div>
    </div>
  );
}
