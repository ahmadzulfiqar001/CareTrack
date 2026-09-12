export function normalizeOverduePayload(payload) {
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.patients)
        ? payload.patients
        : [];

  return raw
    .map((p) => ({
      patient_id: p.patient_id || p.id,
      full_name: p.full_name || p.users?.full_name || 'Patient',
      days_since_last: p.days_since_last ?? null,
    }))
    .filter((p) => p.patient_id);
}

export function readingOverdueFromDashboard(patients = []) {
  const now = Date.now();

  return patients
    .map((p) => {
      const dueDays = Number(p.reading_due_days ?? 7);
      const last = [...(p.latestReadings || [])].sort(
        (a, b) => new Date(b.logged_at) - new Date(a.logged_at)
      )[0];
      const daysSince = last ? (now - new Date(last.logged_at).getTime()) / 86400000 : Infinity;
      const overdue = !last || daysSince >= dueDays;
      if (!overdue) return null;

      return {
        patient_id: p.id,
        full_name: p.users?.full_name || 'Patient',
        days_since_last: last ? Math.floor(daysSince) : null,
      };
    })
    .filter(Boolean);
}

export function readingReminderMessage(name) {
  const who = name || 'there';
  return `Hi ${who}, this is a reminder from CareTrack. Your scheduled follow-up/action is due or overdue. If you have already completed it, please ignore this message. Thank you.`;
}

export function reminderPermissionMessage() {
  return 'Unable to send reminders. You do not have permission to perform this action.';
}

export function isForbiddenError(err) {
  const status = err?.response?.status;
  const text = String(err?.response?.data?.error || err?.response?.data?.message || '');
  return status === 403 || /^forbidden$/i.test(text);
}
