import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Button, Card, Field, LoadingState } from '../components/ui';

const TYPES = [
  { value: 'sugar', label: 'Blood sugar', unit: 'mg/dL', hint: 'Typical fasting range varies — enter your meter reading.' },
  { value: 'bp', label: 'Blood pressure', unit: 'mmHg', hint: 'Enter systolic and diastolic, separated by a slash. E.g. 120/90.' },
  { value: 'weight', label: 'Weight', unit: 'kg', hint: 'Use the same scale when possible.' },
];

export default function LogReading() {
  const [profile, setProfile] = useState(null);
  const [type, setType] = useState('sugar');
  const [value, setValue] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    api.get('/patients/me/profile').then((r) => setProfile(r.data)).catch(console.error);
  }, []);

  const meta = TYPES.find((t) => t.value === type) || TYPES[0];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    if (!profile) return;

    if (type === 'bp') {
      // Expect "120/90"
      const raw = value.trim();
      const parts = raw.split('/').map((s) => s.trim());
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        setError('Enter BP as systolic/diastolic, e.g. 120/90.');
        return;
      }
      const sys = Number(parts[0]);
      const dia = Number(parts[1]);
      if (Number.isNaN(sys) || Number.isNaN(dia)) {
        setError('Both BP values must be numbers.');
        return;
      }
      if (sys <= 0 || dia <= 0) {
        setError('Both BP values must be greater than zero.');
        return;
      }
      if (dia >= sys) {
        setError('Diastolic must be lower than systolic.');
        return;
      }

      setLoading(true);
      try {
        await api.post('/readings', { patient_id: profile.id, type: 'bp_sys', value: sys });
        await api.post('/readings', { patient_id: profile.id, type: 'bp_dia', value: dia });
        setMsg('Reading saved successfully.');
        setValue('');
        setTimeout(() => {
          setMsg('');
          nav('/me');
        }, 900);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to save reading');
      } finally {
        setLoading(false);
      }
      return;
    }

    // non-BP types
    const num = Number(value);
    if (value === '' || Number.isNaN(num)) {
      setError('Please enter a valid number.');
      return;
    }
    if (num <= 0) {
      setError('Value must be greater than zero.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/readings', { patient_id: profile.id, type, value: num });
      setMsg('Reading saved successfully.');
      setValue('');
      setTimeout(() => {
        setMsg('');
        nav('/me');
      }, 900);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save reading');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <LoadingState label="Preparing logging form…" />;

  const placeholder =
    type === 'bp' ? 'e.g. 120/90' :
    type === 'weight' ? 'e.g. 72.5' :
    'e.g. 110';

  return (
    <div className="ct-container py-10">
      <div className="mx-auto max-w-lg">
        <Link to="/me" className="text-sm font-semibold text-care-blue hover:underline">
          ← Back to my health
        </Link>

        <Card className="mt-4 p-6 sm:p-8">
          <p className="ct-kicker">Health logging</p>
          <h1 className="ct-display mt-2 text-3xl">Log a reading</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Keep your care team updated between visits. Choose a reading type and enter the value.
          </p>

          {msg && (
            <div className="mt-4 rounded-control border border-green-200 bg-green-50 px-4 py-3 text-sm text-success" role="status">
              {msg}
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-6" noValidate>
            <Field label="Reading type" id="reading-type">
              <select
                id="reading-type"
                className="ct-input"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setValue('');
                  setError('');
                }}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={`Value (${meta.unit})`} id="reading-value" hint={meta.hint}>
              <input
                id="reading-value"
                className="ct-input text-lg"
                type={type === 'bp' ? 'text' : 'number'}
                step={type === 'bp' ? undefined : 'any'}
                inputMode={type === 'bp' ? 'text' : 'decimal'}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </Field>

            <p className="mb-4 text-xs text-ink-muted">
              Date & time are recorded automatically when you save.
            </p>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Saving…' : 'Save reading'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}