import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { getApiErrorMessage } from '../api/client';
import Logo from '../components/Logo';
import { Button } from '../components/ui';
import authImg from '../assets/auth-consult.jpg';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.full_name.trim() || !form.email.trim() || !form.password || !form.phone.trim()) {
      setError('Please complete all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', {
        email: form.email.trim(),
        password: form.password,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        role: 'doctor',
      });
      nav('/login', {
        replace: true,
        state: { registered: true },
      });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="ct-container flex items-center py-4 lg:min-h-[calc(100vh-4.25rem)] lg:py-5">
      <div className="ct-page-enter grid w-full overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card lg:grid-cols-2">
        <div className="relative hidden min-h-[500px] max-h-[calc(100vh-5.75rem)] bg-navy lg:block">
          <img
            src={authImg}
            alt="Doctor consulting with a patient"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-80 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/10" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-teal-200">
              For clinics
            </p>
            <h1 className="font-display mt-2 text-3xl leading-tight">
              Start your clinic workspace.
            </h1>
            <p className="mt-2 max-w-sm text-sm text-slate-200">
              Onboard patients, send reminders, and see who needs attention between visits.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-6 sm:px-8 lg:px-10 lg:py-7">
          <Logo to="/" size="md" />
          <p className="ct-kicker mt-4">Get started</p>
          <h2 className="ct-display mt-1.5 text-2xl sm:text-3xl">Register as Doctor</h2>
          <p className="mt-1.5 text-sm text-ink-muted">
            Create your clinic account. Patients are onboarded by their doctor.
          </p>

          {error && (
            <div className="ct-feedback mt-3 rounded-control border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2" noValidate>
            <div className="sm:col-span-2">
              <label className="ct-label" htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                name="full_name"
                autoComplete="name"
                className="ct-input !py-2.5"
                placeholder="Dr. Sara Ahmed"
                value={form.full_name}
                onChange={set('full_name')}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="ct-label" htmlFor="reg-email">Email address</label>
              <input id="reg-email" className="ct-input !py-2.5" type="email" placeholder="you@clinic.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="ct-label" htmlFor="reg-password">Password</label>
              <input id="reg-password" className="ct-input !py-2.5" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required />
            </div>
            <div>
              <label className="ct-label" htmlFor="reg-phone">Phone</label>
              <input id="reg-phone" className="ct-input !py-2.5" placeholder="+92 300 0000000" value={form.phone} onChange={set('phone')} required />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="primary" className="w-full !py-2.5" disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-ink-muted">
            Have an account?{' '}
            <Link to="/login" className="font-semibold text-care-blue hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
