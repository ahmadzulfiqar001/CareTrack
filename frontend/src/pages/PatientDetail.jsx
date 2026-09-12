import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import TrendChart from '../components/TrendChart';
import FlagBadge, { StatusBadge } from '../components/FlagBadge';
import { Button, Card, EmptyState, Field, LoadingState } from '../components/ui';

export default function PatientDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgTone, setMsgTone] = useState('success');
  const [apptDate, setApptDate] = useState('');
  const [busy, setBusy] = useState(false);

  // test form state
  const [testName, setTestName] = useState('');
  const [testDue, setTestDue] = useState('');
  const [testBusy, setTestBusy] = useState(false);

  // reading window state
  const [readingDays, setReadingDays] = useState('');

  // medication form state
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medTimes, setMedTimes] = useState('');
  const [medBusy, setMedBusy] = useState(false);

  const load = () => api.get(`/patients/${id}`).then((r) => setData(r.data));

  useEffect(() => {
    let active = true;
    api
      .get(`/patients/${id}`)
      .then((r) => {
        if (active) setData(r.data);
      })
      .catch(console.error);
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (data?.patient) {
      setReadingDays(String(data.patient.reading_due_days ?? 7));
    }
  }, [data]);

  const flash = (text, tone = 'success') => {
    setMsg(text);
    setMsgTone(tone);
    setTimeout(() => setMsg(''), 2800);
  };

  // const sendReminder = async () => {
  //   if (!data) return;
  //   setBusy(true);
  //   try {
  //     await api.post('/reminders/trigger', {
  //       patient_id: id,
  //       type: 'checkup',
  //       message: `Hi ${data.patient.users.full_name}, please book your next checkup.`,
  //     });
  //     flash('Reminder sent');
  //   } catch (e) {
  //     flash(e.response?.data?.error || 'Failed to send reminder', 'error');
  //   } finally {
  //     setBusy(false);
  //   }
  // };

  const bookAppt = async () => {
    if (!apptDate) return;
    setBusy(true);
    try {
      await api.post('/appointments', {
        patient_id: id,
        scheduled_at: new Date(apptDate).toISOString(),
        notes: 'Follow-up',
      });
      setApptDate('');
      await load();
      flash('Appointment scheduled');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed to book', 'error');
    } finally {
      setBusy(false);
    }
  };

  const confirmAppt = async (apptId) => {
    try {
      await api.patch(`/appointments/${apptId}`, { status: 'scheduled' });
      await load();
      flash('Appointment confirmed');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed', 'error');
    }
  };

  const cancelAppt = async (apptId) => {
    try {
      await api.delete(`/appointments/${apptId}`);
      await load();
      flash('Appointment cancelled');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed', 'error');
    }
  };

  // ── tests ─────────────────────────────────────
  const addTest = async () => {
    const name = testName.trim();
    if (!name) {
      flash('Test name is required', 'error');
      return;
    }
    setTestBusy(true);
    try {
      const existing = data.patient.tests || [];
      const newTests = [...existing, { name, due_date: testDue || null }];
      await api.patch(`/patients/${id}`, { tests: newTests });
      setTestName('');
      setTestDue('');
      await load();
      flash('Test added');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed to add test', 'error');
    } finally {
      setTestBusy(false);
    }
  };

  const removeTest = async (index) => {
    const existing = data.patient.tests || [];
    const newTests = existing.filter((_, i) => i !== index);
    try {
      await api.patch(`/patients/${id}`, { tests: newTests });
      await load();
      flash('Test removed');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed to remove test', 'error');
    }
  };

  const updateTestDue = async (index, newDue) => {
    const existing = data.patient.tests || [];
    const newTests = existing.map((t, i) =>
      i === index ? { ...t, due_date: newDue || null } : t
    );
    try {
      await api.patch(`/patients/${id}`, { tests: newTests });
      await load();
      flash('Due date updated');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed to update due date', 'error');
    }
  };

  // ── reading window ────────────────────────────
  const saveReadingDays = async () => {
    const n = Number(readingDays);
    if (!Number.isInteger(n) || n < 1 || n > 365) {
      flash('Enter a whole number between 1 and 365', 'error');
      return;
    }
    try {
      await api.patch(`/patients/${id}`, { reading_due_days: n });
      await load();
      flash('Reading window updated');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed to update', 'error');
    }
  };

  // ── medications ───────────────────────────────
  const addMedication = async () => {
    const name = medName.trim();
    if (!name) {
      flash('Medication name is required', 'error');
      return;
    }
    setMedBusy(true);
    try {
      const times = medTimes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const existing = data.patient.medications || [];
      const newMeds = [...existing, { name, dose: medDose.trim(), times }];
      await api.patch(`/patients/${id}`, { medications: newMeds });
      setMedName('');
      setMedDose('');
      setMedTimes('');
      await load();
      flash('Medication added');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed to add medication', 'error');
    } finally {
      setMedBusy(false);
    }
  };

  const removeMedication = async (index) => {
    const existing = data.patient.medications || [];
    const newMeds = existing.filter((_, i) => i !== index);
    try {
      await api.patch(`/patients/${id}`, { medications: newMeds });
      await load();
      flash('Medication removed');
    } catch (e) {
      flash(e.response?.data?.error || 'Failed to remove medication', 'error');
    }
  };

  if (!data) return <LoadingState label="Loading patient…" />;

  const { patient, readings, appointments } = data;
  const flags = (() => {
    if (patient.flags?.length) return patient.flags;
    const computed = [];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const sorted = [...readings].sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
    if (patient.next_checkup_date && new Date(patient.next_checkup_date) < today) {
      computed.push('missed_followup');
    }
    const bp = sorted.filter((r) => r.type === 'bp_sys').slice(0, 3);
    if (bp.length >= 3 && bp.every((r) => Number(r.value) > 140)) computed.push('high_bp_trend');
    const sugar = sorted.filter((r) => r.type === 'sugar').slice(0, 3);
    if (sugar.length >= 3 && sugar.every((r) => Number(r.value) > 180)) computed.push('high_sugar_trend');
    const last = sorted[0];
    if (last && (today - new Date(last.logged_at)) / 86400000 > 14) computed.push('no_recent_logs');
    const overdueTests = (patient.tests || []).filter((t) => t.due_date && t.due_date < todayStr);
    if (overdueTests.length) computed.push('overdue_test');
    if (appointments.some((a) => a.status === 'requested')) computed.push('pending_appointment_request');
    return computed;
  })();
  const latestByType = (type) =>
    [...readings].filter((r) => r.type === type).sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at))[0];

  const statusColor = (s) => {
    if (s === 'requested') return 'text-warning';
    if (s === 'scheduled') return 'text-success';
    if (s === 'completed') return 'text-care-blue';
    if (s === 'cancelled') return 'text-ink-muted';
    if (s === 'missed') return 'text-danger';
    return 'text-navy';
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="ct-container py-8 sm:py-10">
      <Link to="/doctor" className="text-sm font-semibold text-care-blue hover:underline">
        ← Back to dashboard
      </Link>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="ct-display text-3xl sm:text-4xl">{patient.users.full_name}</h1>
            <StatusBadge status={flags.length ? 'attention' : 'on_track'} />
          </div>
          <p className="mt-2 text-sm capitalize text-ink-muted">
            {patient.condition} · Next checkup: <span className="font-semibold text-navy">{patient.next_checkup_date || 'Not set'}</span>
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {patient.users.email} · {patient.users.phone}
          </p>
        </div>
        {/* <div className="flex flex-wrap items-center gap-3">
          <Button onClick={sendReminder} variant="navy" disabled={busy}>
            Send Reminder
          </Button>
          {msg && (
            <span className={`text-sm font-medium ${msgTone === 'error' ? 'text-danger' : 'text-success'}`}>
              {msg}
            </span>
          )}
        </div> */}
        <div className="flex flex-wrap items-center gap-3">
          {msg && (
            <span className={`text-sm font-medium ${msgTone === 'error' ? 'text-danger' : 'text-success'}`}>
              {msg}
            </span>
          )}
        </div>
      </div>

      {flags.length > 0 && (
        <Card className="mt-6 border-amber-200 bg-amber-50/50 p-4">
          <p className="mb-2 text-sm font-semibold text-navy">Attention flags</p>
          <div className="flex flex-wrap">
            {flags.map((f) => (
              <FlagBadge key={f} flag={f} />
            ))}
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Blood sugar', latestByType('sugar'), 'mg/dL'],
          ['BP systolic', latestByType('bp_sys'), 'mmHg'],
          ['BP diastolic', latestByType('bp_dia'), 'mmHg'],
          ['Weight', latestByType('weight'), 'kg'],
        ].map(([label, reading, unit]) => (
          <Card key={label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
            <p className="mt-1 font-display text-2xl text-navy">
              {reading ? reading.value : '—'}
              {reading && <span className="ml-1 text-sm font-sans text-ink-muted">{unit}</span>}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              {reading ? new Date(reading.logged_at).toLocaleString() : 'No reading yet'}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Card className="p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy">Health trends</h2>
          <p className="mt-1 text-sm text-ink-muted">Longitudinal readings for this patient.</p>
          <TrendChart readings={readings} type="sugar" />
          <TrendChart readings={readings} type="bp_sys" />
          <TrendChart readings={readings} type="bp_dia" />
          <TrendChart readings={readings} type="weight" />
        </Card>

        <div className="space-y-6">
          {/* ── Reading reminder window ───────────── */}
          <Card className="p-5">
            <h2 className="font-bold text-navy">Reading reminder window</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Flag this patient if no reading is logged in this many days.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="365"
                className="ct-input !w-24"
                value={readingDays}
                onChange={(e) => setReadingDays(e.target.value)}
              />
              <span className="text-sm text-ink-muted">days</span>
              <button
                type="button"
                onClick={saveReadingDays}
                className="ml-auto rounded-lg bg-care-blue px-3 py-1 text-xs font-semibold text-white"
              >
                Save
              </button>
            </div>
          </Card>

          {/* ── Medications (now editable) ────────── */}
          <Card className="p-5">
            <h2 className="font-bold text-navy">Medications</h2>

            {(patient.medications || []).length === 0 ? (
              <EmptyState title="No medications assigned" description="Add one below." />
            ) : (
              <ul className="mt-3 space-y-2">
                {(patient.medications || []).map((m, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between gap-3 rounded-xl border border-line bg-slate-50 px-3 py-2.5 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-navy">{m.name}</p>
                      <p className="text-ink-muted">
                        {m.dose || '—'} · {(m.times || []).join(', ') || 'no times'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMedication(i)}
                      className="text-xs font-semibold text-danger"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-2 text-sm font-semibold text-navy">Add a medication</p>
              <Field id="med-name" label="Name">
                <input
                  id="med-name"
                  type="text"
                  className="ct-input"
                  placeholder="e.g. Metformin"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                />
              </Field>
              <Field id="med-dose" label="Dose">
                <input
                  id="med-dose"
                  type="text"
                  className="ct-input"
                  placeholder="e.g. 500mg"
                  value={medDose}
                  onChange={(e) => setMedDose(e.target.value)}
                />
              </Field>
              <Field id="med-times" label="Times (comma-separated HH:MM)">
                <input
                  id="med-times"
                  type="text"
                  className="ct-input"
                  placeholder="e.g. 08:00, 20:00"
                  value={medTimes}
                  onChange={(e) => setMedTimes(e.target.value)}
                />
              </Field>
              <Button
                onClick={addMedication}
                variant="primary"
                disabled={!medName.trim() || medBusy}
              >
                {medBusy ? 'Adding…' : 'Add medication'}
              </Button>
            </div>
          </Card>

          {/* ── Tests ─────────────────────────────── */}
          <Card className="p-5">
            <h2 className="font-bold text-navy">Tests</h2>

            {(patient.tests || []).length === 0 ? (
              <EmptyState title="No tests recorded" description="Add a test below to track it." />
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {patient.tests.map((t, i) => {
                  const overdue = t.due_date && t.due_date < todayStr;
                  return (
                    <li
                      key={i}
                      className="flex flex-col gap-2 border-b border-line pb-2 last:border-0"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-navy">{t.name}</span>
                        {overdue && (
                          <span className="text-xs font-bold text-danger">OVERDUE</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          className={`ct-input !py-1 !text-xs ${overdue ? '!border-danger' : ''}`}
                          value={t.due_date || ''}
                          onChange={(e) => updateTestDue(i, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeTest(i)}
                          className="ml-auto text-xs font-semibold text-danger"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-2 text-sm font-semibold text-navy">Add a new test</p>
              <Field id="test-name" label="Test name">
                <input
                  id="test-name"
                  type="text"
                  className="ct-input"
                  placeholder="e.g. HbA1c"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                />
              </Field>
              <Field id="test-due" label="Due date">
                <input
                  id="test-due"
                  type="date"
                  className="ct-input"
                  value={testDue}
                  onChange={(e) => setTestDue(e.target.value)}
                />
              </Field>
              <Button
                onClick={addTest}
                variant="primary"
                disabled={!testName.trim() || testBusy}
              >
                {testBusy ? 'Adding…' : 'Add test'}
              </Button>
            </div>
          </Card>

          {/* ── Appointments ──────────────────────── */}
          <Card className="p-5">
            <h2 className="font-bold text-navy">Appointments</h2>
            {appointments.length === 0 ? (
              <EmptyState title="No appointments yet" description="Schedule a follow-up below." />
            ) : (
              <ul className="mt-3 space-y-3">
                {appointments.map((a) => (
                  <li key={a.id} className="rounded-xl border border-line p-3">
                    <p className="text-sm font-semibold text-navy">
                      {new Date(a.scheduled_at).toLocaleString()}
                    </p>
                    <p className={`text-xs font-bold capitalize ${statusColor(a.status)}`}>{a.status}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {a.status === 'requested' && (
                        <button
                          type="button"
                          onClick={() => confirmAppt(a.id)}
                          className="rounded-lg bg-success px-2.5 py-1 text-xs font-semibold text-white"
                        >
                          Confirm
                        </button>
                      )}
                      {a.status !== 'cancelled' && a.status !== 'completed' && a.status !== 'missed' && (
                        <button
                          type="button"
                          onClick={() => cancelAppt(a.id)}
                          className="text-xs font-semibold text-danger"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 border-t border-line pt-4">
              <p className="mb-2 text-sm font-semibold text-navy">Schedule new appointment</p>
              <Field id="appt-date" label="Date & time">
                <input
                  id="appt-date"
                  type="datetime-local"
                  className="ct-input"
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                />
              </Field>
              <Button onClick={bookAppt} variant="primary" disabled={!apptDate || busy}>
                Book appointment
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}