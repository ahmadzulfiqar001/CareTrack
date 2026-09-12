import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import TrendChart from '../components/TrendChart';
import { StatusBadge } from '../components/FlagBadge';
import {
  Button,
  Card,
  EmptyState,
  Field,
  HealthMetricCard,
  LoadingState,
} from '../components/ui';
import {
  formatReadingTypeLabel,
  latestBloodPressure,
  latestOfType,
  pairReadingsForDisplay,
} from '../utils/readings';

export default function PatientHome() {
  const [profile, setProfile] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [appts, setAppts] = useState([]);
  const [readings, setReadings] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [reschedId, setReschedId] = useState(null);
  const [reschedDate, setReschedDate] = useState('');
  const [msg, setMsg] = useState('');
  const [msgTone, setMsgTone] = useState('success');

  useEffect(() => {
    api
      .get('/patients/me/profile')
      .then((r) => {
        setProfile(r.data);
        return Promise.all([
          api.get(`/reminders/${r.data.id}`),
          api.get(`/appointments/patient/${r.data.id}`),
          api.get(`/readings/${r.data.id}`),
        ]);
      })
      .then(([remRes, apptRes, readRes]) => {
        setReminders(remRes.data || []);
        setAppts(apptRes.data || []);
        setReadings(readRes.data || []);
      })
      .catch(console.error);
  }, []);

  const reloadAppts = async () => {
    if (!profile) return;
    const r = await api.get(`/appointments/patient/${profile.id}`);
    setAppts(r.data || []);
  };

  const flash = (text, tone = 'success') => {
    setMsg(text);
    setMsgTone(tone);
    setTimeout(() => setMsg(''), 2500);
  };

  const book = async () => {
    if (!newDate) return;
    try {
      await api.post('/appointments', {
        scheduled_at: new Date(newDate).toISOString(),
        notes: 'Patient requested',
      });
      setNewDate('');
      await reloadAppts();
      flash('Appointment requested');
    } catch (e) {
      flash(e.response?.data?.error || 'Booking failed', 'error');
    }
  };

  const reschedule = async (id) => {
    if (!reschedDate) return;
    try {
      await api.patch(`/appointments/${id}`, {
        scheduled_at: new Date(reschedDate).toISOString(),
      });
      setReschedId(null);
      setReschedDate('');
      await reloadAppts();
      flash('Reschedule requested');
    } catch (e) {
      flash(e.response?.data?.error || 'Reschedule failed', 'error');
    }
  };

  const cancel = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      await reloadAppts();
      flash('Appointment cancelled');
    } catch (e) {
      flash(e.response?.data?.error || 'Cancel failed', 'error');
    }
  };

  if (!profile) return <LoadingState label="Loading your health portal…" />;

  const sugar = latestOfType(readings, 'sugar');
  const bp = latestBloodPressure(readings);
  const weight = latestOfType(readings, 'weight');
  const recentLogs = pairReadingsForDisplay(readings).slice(0, 8);
  const upcoming = [...appts]
    .filter((a) => a.status === 'scheduled' || a.status === 'requested')
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))[0];

  const overdue =
    profile.next_checkup_date && new Date(profile.next_checkup_date) < new Date();

  const statusColor = (s) => {
    if (s === 'requested') return 'text-warning';
    if (s === 'scheduled') return 'text-success';
    if (s === 'completed') return 'text-care-blue';
    if (s === 'cancelled') return 'text-ink-muted';
    if (s === 'missed') return 'text-danger';
    return 'text-navy';
  };

  return (
    <div className="ct-container ct-page-enter py-8 sm:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="ct-kicker">Patient portal</p>
          <h1 className="ct-display mt-1 text-3xl sm:text-4xl">
            Hello, {profile.users?.full_name?.split(' ')[0] || 'there'}
          </h1>
          <p className="mt-2 text-sm capitalize text-ink-muted">
            {profile.condition} · Next checkup:{' '}
            <span className="font-semibold text-navy">{profile.next_checkup_date || 'Not set'}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={overdue ? 'overdue' : 'on_track'} />
          <Button as={Link} to="/log" variant="primary">
            Log a Reading
          </Button>
        </div>
      </div>

      {msg && (
        <p className={`ct-feedback mb-4 text-sm font-medium ${msgTone === 'error' ? 'text-danger' : 'text-success'}`}>
          {msg}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <HealthMetricCard
          label="Blood sugar"
          value={sugar?.value}
          unit="mg/dL"
          hint={sugar ? `Logged ${new Date(sugar.logged_at).toLocaleDateString()}` : 'No reading yet'}
        />
        <HealthMetricCard
          label="Blood pressure"
          value={bp.display}
          unit="mmHg"
          hint={bp.logged_at ? `Logged ${new Date(bp.logged_at).toLocaleDateString()}` : 'No reading yet'}
        />
        <HealthMetricCard
          label="Weight"
          value={weight?.value}
          unit="kg"
          hint={weight ? `Logged ${new Date(weight.logged_at).toLocaleDateString()}` : 'No reading yet'}
        />
        <HealthMetricCard
          label="Upcoming visit"
          value={
            upcoming
              ? new Date(upcoming.scheduled_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
              : '—'
          }
          hint={upcoming ? upcoming.status : 'No visit scheduled'}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-navy">Health trends</h2>
              <Button as={Link} to="/log" variant="secondary" className="!px-3 !py-2 !text-xs">
                Add reading
              </Button>
            </div>
            <TrendChart readings={readings} type="sugar" />
            <TrendChart readings={readings} type="bp" />
            <TrendChart readings={readings} type="weight" />
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-navy">Recent logs</h2>
            {readings.length === 0 ? (
              <EmptyState
                title="No readings yet"
                description="Your trend will appear here once readings are logged."
                action={
                  <Button as={Link} to="/log" variant="navy">
                    Log your first reading
                  </Button>
                }
              />
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {recentLogs.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-navy">{formatReadingTypeLabel(r.type)}</p>
                      <p className="text-xs text-ink-muted">{new Date(r.logged_at).toLocaleString()}</p>
                    </div>
                    <p className="font-bold text-navy">
                      {r.valueLabel}
                      {r.type === 'bp' ? <span className="ml-1 text-xs font-medium text-ink-muted">mmHg</span> : null}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-bold text-navy">My medications</h2>
            {(profile.medications || []).length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">No medications assigned.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {(profile.medications || []).map((m, i) => (
                  <li key={i} className="rounded-xl border border-line bg-blue-50/60 px-3 py-3 text-sm">
                    <p className="font-semibold text-navy">{m.name}</p>
                    <p className="text-ink-muted">
                      {m.dose} at {(m.times || []).join(', ')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-navy">My appointments</h2>
            {appts.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">No appointments yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {appts.map((a) => (
                  <li key={a.id} className="rounded-xl border border-line p-3 text-sm">
                    <p className="font-semibold text-navy">{new Date(a.scheduled_at).toLocaleString()}</p>
                    <p className={`text-xs font-bold capitalize ${statusColor(a.status)}`}>{a.status}</p>
                    {a.status !== 'cancelled' && a.status !== 'completed' && (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {reschedId === a.id ? (
                          <>
                            <input
                              type="datetime-local"
                              className="ct-input !py-2 text-xs"
                              value={reschedDate}
                              onChange={(e) => setReschedDate(e.target.value)}
                            />
                            <button type="button" onClick={() => reschedule(a.id)} className="rounded-lg bg-care-blue px-2 py-1 text-xs font-semibold text-white">
                              Save
                            </button>
                            <button type="button" onClick={() => setReschedId(null)} className="text-xs text-ink-muted">
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setReschedId(a.id);
                                setReschedDate('');
                              }}
                              className="text-xs font-semibold text-care-blue"
                            >
                              Reschedule
                            </button>
                            <button type="button" onClick={() => cancel(a.id)} className="text-xs font-semibold text-danger">
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-2 text-sm font-semibold text-navy">Request a new appointment</p>
              <Field id="new-appt" label="Preferred date & time">
                <input
                  id="new-appt"
                  type="datetime-local"
                  className="ct-input"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </Field>
              <Button onClick={book} variant="navy" disabled={!newDate}>
                Request appointment
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-navy">Recent reminders</h2>
            {reminders.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">No reminders yet.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {reminders.slice(0, 10).map((r) => (
                  <li key={r.id} className="rounded-xl border border-line px-3 py-2">
                    <p className="text-xs text-ink-muted">{new Date(r.scheduled_for).toLocaleString()}</p>
                    <p className="text-navy">{r.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
