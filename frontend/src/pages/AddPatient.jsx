import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getApiErrorMessage } from '../api/client';
import { Button, Card, Field } from '../components/ui';

export default function AddPatient() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: 'pass123',
    phone: '',
    condition: 'diabetes',
    followup_interval_days: 30,
    medication_name: 'Metformin',
    dose: '500mg',
    times: '08:00,20:00',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.full_name.trim() || !form.email.trim() || !form.password || !form.phone.trim()) {
      setError('Please complete all required patient information fields.');
      return;
    }

    const interval = Number(form.followup_interval_days);
    if (!Number.isFinite(interval) || interval < 1) {
      setError('Follow-up interval must be at least 1 day.');
      return;
    }

    if (!localStorage.getItem('token')) {
      setError('Your session expired or is unauthorized. Please log in again.');
      return;
    }

    const medications = form.medication_name.trim()
      ? [
          {
            name: form.medication_name.trim(),
            dose: form.dose.trim(),
            times: form.times
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          },
        ]
      : [];

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      condition: form.condition,
      followup_interval_days: interval,
      medications,
    };

    setLoading(true);
    try {
      const { data } = await api.post('/patients', payload);
      const patientId = data?.patient?.id;
      if (!patientId) {
        setError('Patient was created but no patient id was returned.');
        return;
      }
      setSuccess('Patient created successfully. Opening their profile…');
      setTimeout(() => nav(`/patient/${patientId}`), 700);
    } catch (err) {
      console.error('[add-patient]', err.response?.data || err.message || err);
      const status = err.response?.status;
      if (status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (status === 400 && /duplicate|unique|already exists/i.test(err.response?.data?.error || '')) {
        setError('This email is already registered.');
      } else if (status === 400) {
        setError(getApiErrorMessage(err, 'Please check the patient information and try again.'));
      } else if (err.code === 'ERR_NETWORK' || /fetch failed|Network Error/i.test(err.message || '')) {
        setError('Unable to connect to CareTrack. Please make sure the server is running and try again.');
      } else {
        setError(getApiErrorMessage(err, 'Failed to create patient'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.25rem)] bg-slate-50">
      <div className="ct-container py-6 sm:py-8">
        <div className="ct-page-enter mx-auto max-w-3xl">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-ink-muted" aria-label="Breadcrumb">
            <Link to="/doctor" className="font-medium transition hover:text-care-blue">
              Doctor Dashboard
            </Link>
            <span aria-hidden>/</span>
            <span className="font-medium">Patients</span>
            <span aria-hidden>/</span>
            <span className="font-semibold text-navy">Add Patient</span>
          </nav>

          <Card className="overflow-hidden border-line bg-white p-0 shadow-card">
            <div className="border-b border-line bg-care-cream/50 px-5 py-5 sm:px-8 sm:py-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-care-blue">
                Onboard
              </p>
              <h1 className="ct-display mt-1.5 text-3xl text-navy">Add new patient</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
                Create a chronic-care profile with medications and follow-up cadence. The patient can
                then log in and record readings.
              </p>
            </div>

            <form onSubmit={submit} className="px-5 py-6 sm:px-8 sm:py-7" noValidate>
              {error && (
                <div
                  className="ct-feedback mb-5 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger"
                  role="alert"
                >
                  {error}
                </div>
              )}
              {success && (
                <div
                  className="ct-feedback mb-5 rounded-control border border-green-200 bg-green-50 px-4 py-3 text-sm text-success"
                  role="status"
                >
                  {success}
                </div>
              )}

              <section className="mb-7">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white">
                    1
                  </span>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-navy">
                      Patient information
                    </h2>
                    <p className="text-xs text-ink-muted">Portal login details for this patient</p>
                  </div>
                </div>
                <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Full name" id="full_name">
                      <input
                        id="full_name"
                        name="full_name"
                        className="ct-input"
                        placeholder="Patient full name"
                        value={form.full_name}
                        onChange={set('full_name')}
                        required
                      />
                    </Field>
                  </div>
                  <Field label="Email" id="email">
                    <input
                      id="email"
                      name="email"
                      className="ct-input"
                      type="email"
                      placeholder="patient@email.com"
                      value={form.email}
                      onChange={set('email')}
                      required
                    />
                  </Field>
                  <Field label="Password" id="password" hint="Shared with patient for portal access">
                    <input
                      id="password"
                      name="password"
                      className="ct-input"
                      type="text"
                      value={form.password}
                      onChange={set('password')}
                      required
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Phone" id="phone">
                      <input
                        id="phone"
                        name="phone"
                        className="ct-input"
                        placeholder="+92 300 0000000"
                        value={form.phone}
                        onChange={set('phone')}
                        required
                      />
                    </Field>
                  </div>
                </div>
              </section>

              <section className="mb-7 border-t border-line pt-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-care-blue text-xs font-bold text-white">
                    2
                  </span>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-navy">Care plan</h2>
                    <p className="text-xs text-ink-muted">Condition and follow-up schedule</p>
                  </div>
                </div>
                <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                  <Field label="Condition" id="condition">
                    <select
                      id="condition"
                      name="condition"
                      className="ct-input"
                      value={form.condition}
                      onChange={set('condition')}
                    >
                      <option value="diabetes">Diabetes</option>
                      <option value="hypertension">Hypertension</option>
                      <option value="asthma">Asthma</option>
                    </select>
                  </Field>
                  <Field label="Follow-up interval (days)" id="followup">
                    <input
                      id="followup"
                      name="followup_interval_days"
                      className="ct-input"
                      type="number"
                      min="1"
                      value={form.followup_interval_days}
                      onChange={set('followup_interval_days')}
                      required
                    />
                  </Field>
                </div>
              </section>

              <section className="mb-7 border-t border-line pt-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-navy">
                    3
                  </span>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-navy">
                      Medication
                    </h2>
                    <p className="text-xs text-ink-muted">Initial medication (optional)</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-line bg-slate-50/80 p-4 sm:p-5">
                  <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                    <Field label="Medication name" id="med_name">
                      <input
                        id="med_name"
                        className="ct-input"
                        placeholder="e.g. Metformin"
                        value={form.medication_name}
                        onChange={set('medication_name')}
                      />
                    </Field>
                    <Field label="Dose" id="dose">
                      <input
                        id="dose"
                        className="ct-input"
                        placeholder="500mg"
                        value={form.dose}
                        onChange={set('dose')}
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Times" id="times" hint="Comma-separated HH:MM values">
                        <input
                          id="times"
                          className="ct-input"
                          placeholder="08:00,20:00"
                          value={form.times}
                          onChange={set('times')}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/doctor"
                  className="inline-flex items-center justify-center rounded-control px-4 py-3 text-sm font-semibold text-ink-muted transition hover:bg-slate-100 hover:text-navy"
                >
                  Cancel
                </Link>
                <Button type="submit" variant="primary" className="sm:min-w-[200px]" disabled={loading}>
                  {loading ? 'Creating patient…' : 'Create patient'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
