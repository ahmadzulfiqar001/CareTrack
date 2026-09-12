import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getApiErrorMessage } from '../api/client';
import PatientCard from '../components/PatientCard';
import { useAuth } from '../context/AuthContext';
import { Button, Card, EmptyState, LoadingState, StatCard } from '../components/ui';
import { formatReadingTypeLabel } from '../utils/readings';
import {
  isForbiddenError,
  normalizeOverduePayload,
  readingOverdueFromDashboard,
  readingReminderMessage,
  reminderPermissionMessage,
} from '../utils/reminders';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // reminder modal state
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [overdue, setOverdue] = useState([]);
  const [modalError, setModalError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await api.get('/dashboard');
      setPatients(res.data || []);
    } catch (e) {
      setError(getApiErrorMessage(e, 'Failed to refresh'));
    } finally {
      setRefreshing(false);
    }
  };
  // ── open modal, fetch preview ────────────────
  const openReminderModal = async () => {
    setModalOpen(true);
    setModalLoading(true);
    setModalError('');
    setOverdue([]);
    const fallback = readingOverdueFromDashboard(patients);
    try {
      const preview = await api.get('/reminders/overdue-readings');
      const list = normalizeOverduePayload(preview.data);
      setOverdue(list.length ? list : fallback);
    } catch (e) {
      // GET /reminders/:patientId also matches "overdue-readings" on some backends
      // and returns 403. Fall back to the already-loaded dashboard patient list.
      if (isForbiddenError(e) || e.response?.status === 404) {
        setOverdue(fallback);
      } else {
        setOverdue(fallback);
        if (!fallback.length) {
          setModalError(getApiErrorMessage(e, 'Failed to load overdue patients'));
        }
      }
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setOverdue([]);
    setModalError('');
  };

  const sendViaTrigger = async (targets) => {
    let sent = 0;
    let lastError = null;
    for (const p of targets) {
      try {
        await api.post('/reminders/trigger', {
          patient_id: p.patient_id,
          type: 'reading_reminder',
          message: readingReminderMessage(p.full_name),
        });
        sent += 1;
      } catch (e) {
        lastError = e;
      }
    }
    if (sent === 0 && lastError) throw lastError;
    return sent;
  };

  // ── confirm & send ───────────────────────────
  const confirmSend = async () => {
    if (!overdue.length) {
      setModalError('No patients currently need a reading reminder.');
      return;
    }

    setSending(true);
    setModalError('');
    try {
      let count;
      try {
        const res = await api.post('/reminders/send-overdue-readings');
        count = typeof res.data?.sent === 'number' ? res.data.sent : overdue.length;
      } catch (bulkErr) {
        const status = bulkErr.response?.status;
        if (status === 404 || status === 405) {
          count = await sendViaTrigger(overdue);
        } else if (isForbiddenError(bulkErr)) {
          throw bulkErr;
        } else {
          throw bulkErr;
        }
      }

      setSentMsg(
        typeof count === 'number'
          ? `Reminders sent to ${count} patient${count === 1 ? '' : 's'}.`
          : 'Reminders sent successfully.'
      );
      setTimeout(() => setSentMsg(''), 4000);
      closeModal();
    } catch (e) {
      setModalError(
        isForbiddenError(e)
          ? reminderPermissionMessage()
          : getApiErrorMessage(e, 'Failed to send reminders')
      );
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    api
      .get('/dashboard')
      .then((res) => setPatients(res.data || []))
      .catch((e) => {
        console.error('[dashboard]', e);
        setError(getApiErrorMessage(e, 'Failed to load dashboard'));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading clinic dashboard…" />;

  const flagged = patients.filter((p) => p.flags?.length);
  const ok = patients.filter((p) => !p.flags?.length);
  const missed = patients.filter((p) => p.flags?.includes('missed_followup'));
  const pendingAppts = patients.reduce((n, p) => n + (p.pendingAppts?.length || 0), 0);
  const recentReadings = patients
    .flatMap((p) =>
      (p.latestReadings || []).map((r) => ({
        ...r,
        patientName: p.users?.full_name,
        condition: p.condition,
      }))
    )
    .sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at))
    .slice(0, 6);

  const firstName = user?.full_name?.split(' ')[0] || 'Doctor';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-[calc(100vh-4.25rem)] bg-slate-50">
      <div className="ct-container ct-page-enter py-8 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-line bg-white p-6 shadow-card sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-care-blue">
              Clinic workspace
            </p>
            <h1 className="ct-display mt-1.5 text-3xl sm:text-4xl">
              {greeting}, {firstName}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink-muted">
              Here&apos;s what needs your attention across chronic-care follow-up.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Button as={Link} to="/add-patient" variant="primary" className="shrink-0">
              + Add Patient
            </Button>
            <Button type="button" variant="navy" className="shrink-0" onClick={openReminderModal} disabled={sending}>
              Send Reminders
            </Button>
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className="rounded-control border border-line bg-white px-4 py-3 text-sm font-semibold text-navy transition hover:bg-slate-50 disabled:opacity-50"
            >
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        {sentMsg && (
          <div className="ct-feedback mb-6 rounded-control border border-green-200 bg-green-50 px-4 py-3 text-sm text-success" role="status">
            {sentMsg}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger" role="alert">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total patients" value={patients.length} hint="In your clinic" />
          <StatCard
            label="Needs attention"
            value={flagged.length}
            hint={flagged.length ? 'Review flagged patients' : 'All clear right now'}
            tone={flagged.length ? 'warning' : 'default'}
          />
          <StatCard
            label="Missed follow-ups"
            value={missed.length}
            hint="Overdue checkups"
            tone={missed.length ? 'danger' : 'default'}
          />
          <StatCard
            label="Appointment requests"
            value={pendingAppts}
            hint="Awaiting confirmation"
            tone={pendingAppts ? 'info' : 'default'}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            {flagged.length > 0 && (
              <section className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-navy">Needs attention</h2>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    {flagged.length} flagged
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {flagged.map((p) => (
                    <PatientCard key={p.id} patient={p} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy">On track</h2>
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-success">
                  {ok.length} patients
                </span>
              </div>
              {patients.length === 0 ? (
                <EmptyState
                  title="No patients yet"
                  description="Your patient list is ready for your first onboarding."
                  action={
                    <Button as={Link} to="/add-patient" variant="primary">
                      Add your first patient
                    </Button>
                  }
                />
              ) : ok.length === 0 ? (
                <EmptyState
                  title="All patients currently need attention"
                  description="Review flagged patients above, or onboard someone new."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {ok.map((p) => (
                    <PatientCard key={p.id} patient={p} />
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold text-navy">Recent health readings</h3>
              {recentReadings.length === 0 ? (
                <p className="mt-3 text-sm text-ink-muted">
                  Readings will appear here once patients start logging.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {recentReadings.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-navy">{r.patientName}</p>
                        <p className="text-xs text-ink-muted">
                          {formatReadingTypeLabel(r.type)} · {new Date(r.logged_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-navy">
                        {r.type === 'bp_sys' || r.type === 'bp_dia' ? `${r.value} mmHg` : r.value}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="overflow-hidden border-navy bg-navy p-0 text-white">
              <div className="p-5">
                <h3 className="font-semibold">Quick actions</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  Workflow: Onboard → Remind → Log → Monitor → Flag → Act
                </p>
                <Button as={Link} to="/add-patient" variant="primary" className="mt-4 w-full">
                  Onboard patient
                </Button>
                <Link
                  to="/"
                  className="mt-3 block text-center text-xs font-semibold text-slate-300 transition hover:text-white"
                >
                  View CareTrack home →
                </Link>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {/* ── Reminder modal ──────────────────────── */}
      {modalOpen && (
        <div
          className="ct-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4"
          onClick={closeModal}
        >
          <div
            className="ct-modal-panel w-full max-w-lg rounded-2xl bg-white shadow-soft"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="reminder-modal-title"
          >
            <div className="border-b border-line px-6 py-4">
              <h2 id="reminder-modal-title" className="text-lg font-bold text-navy">
                Send Reminders
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Send reminders to patients with due or missed follow-up readings?
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                Patients who have already completed the action can ignore the message.
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto px-6 py-4">
              {modalLoading && (
                <p className="text-sm text-ink-muted">Checking patients who may need a reminder…</p>
              )}

              {!modalLoading && modalError && (
                <div className="ct-feedback rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
                  {modalError}
                </div>
              )}

              {!modalLoading && !modalError && overdue.length === 0 && (
                <div className="rounded-control border border-green-200 bg-green-50 px-4 py-3 text-sm text-success">
                  No patients currently need a reading reminder.
                </div>
              )}

              {!modalLoading && !modalError && overdue.length > 0 && (
                <ul className="space-y-2">
                  {overdue.map((p) => (
                    <li
                      key={p.patient_id}
                      className="flex items-center justify-between rounded-xl border border-line px-3 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-navy">{p.full_name}</p>
                        <p className="text-xs text-ink-muted">Due or overdue reading</p>
                      </div>
                      <span className="text-xs font-semibold text-warning">
                        {p.days_since_last == null
                          ? 'No reading yet'
                          : `${p.days_since_last}d ago`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-control px-4 py-2 text-sm font-semibold text-ink-muted transition hover:bg-slate-100"
                disabled={sending}
              >
                Cancel
              </button>
              <Button
                type="button"
                variant="navy"
                onClick={confirmSend}
                disabled={sending || modalLoading || overdue.length === 0}
              >
                {sending
                  ? 'Sending reminders...'
                  : overdue.length === 0
                    ? 'No patients to remind'
                    : `Send to ${overdue.length} patient${overdue.length === 1 ? '' : 's'}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}