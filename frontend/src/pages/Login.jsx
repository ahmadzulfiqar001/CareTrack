import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api, { getApiErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Button } from '../components/ui';
import authImg from '../assets/auth-consult.jpg';

export default function Login() {
  const location = useLocation();
  const registered = location.state?.registered === true;
  const [loginRole, setLoginRole] = useState(registered ? 'doctor' : 'patient');
  const [email, setEmail] = useState(() => (
    registered && typeof location.state.email === 'string' ? location.state.email : ''
  ));
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
      const { data } = await api.post('/auth/login', { email: email.trim(), password });
      login(data.token, data.user);
      nav(data.user.role === 'doctor' ? '/doctor' : '/me', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ct-container flex items-center py-4 lg:min-h-[calc(100vh-4.25rem)] lg:py-6">
      <div className="ct-page-enter grid w-full overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card lg:grid-cols-2">
        <div className="relative hidden min-h-[480px] max-h-[calc(100vh-6rem)] bg-navy lg:block">
          <img
            src={authImg}
            alt="Doctor consulting with a patient"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-80 transition duration-700"
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

          <div className="mt-6 flex gap-3" role="group" aria-label="Login account type">
            {[
              { role: 'patient', label: 'Patient Login' },
              { role: 'doctor', label: 'Doctor Portal / Login' },
            ].map(({ role, label }) => (
              <button
                key={role}
                type="button"
                aria-pressed={loginRole === role}
                onClick={() => setLoginRole(role)}
                className={`flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-[17px] border-2 px-2 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 ${
                  loginRole === role
                    ? 'border-white bg-gradient-to-r from-[#007765] to-[#066b94] text-white ring-2 ring-teal-700'
                    : 'border-[#c5dbd9] bg-white text-[#568f88]'
                }`}
              >
                {role === 'patient' && (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="6" y="2" width="12" height="20" rx="2" />
                    <path d="M11 5h2" />
                  </svg>
                )}
                <span>{label}</span>
                {role === 'doctor' && (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {registered && (
            <div className="ct-feedback mt-4 rounded-control border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm text-teal-800" role="status">
              Account created successfully. Log in to open your clinic dashboard.
            </div>
          )}

          {error && (
            <div className="ct-feedback mt-4 rounded-control border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-danger" role="alert">
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
