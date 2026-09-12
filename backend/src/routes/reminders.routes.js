const router = require('express').Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const {
  sendReminder,
  runReminderScan,
  runMedicationScan,
  runTestScan,
  runReadingReminderScan,
  markMissedAppointments
} = require('../services/reminder.service');
const { requireRole } = require('../middleware/roles');
const { resolvePatientAccess } = require('../middleware/ownership');

// ─────────────────────────────────────────────
// STATIC ROUTES FIRST (before /:patientId)
// ─────────────────────────────────────────────

// Return list of patients who are overdue on readings (doctor preview)
router.get('/overdue-readings', auth, requireRole('doctor'), async (req, res) => {
  const { data: patients } = await supabase
    .from('patients')
    .select('id, reading_due_days, reading_reminder_sent_at, users!patients_user_id_fkey(full_name, phone)')
    .eq('doctor_id', req.user.id);

  const now = new Date();
  const overdue = [];

  for (const p of patients || []) {
    const dueDays = p.reading_due_days ?? 7;

    const { data: lastReadings } = await supabase
      .from('readings')
      .select('logged_at')
      .eq('patient_id', p.id)
      .order('logged_at', { ascending: false })
      .limit(1);

    const lastAt = lastReadings?.[0]?.logged_at ? new Date(lastReadings[0].logged_at) : null;
    const daysSince = lastAt ? (now - lastAt) / 86400000 : Infinity;

    if (!lastAt || daysSince >= dueDays) {
      overdue.push({
        patient_id: p.id,
        full_name: p.users?.full_name,
        phone: p.users?.phone,
        days_since_last: lastAt ? Math.floor(daysSince) : null,
      });
    }
  }

  res.json(overdue);
});

// ─────────────────────────────────────────────
// DYNAMIC ROUTES
// ─────────────────────────────────────────────

// List reminders for a patient
router.get('/:patientId', auth, async (req, res) => {
  const access = await resolvePatientAccess(req, req.params.patientId);
  if (!access) return res.status(403).json({ error: 'Forbidden' });

  const { data } = await supabase
    .from('reminders')
    .select('*')
    .eq('patient_id', req.params.patientId)
    .order('scheduled_for', { ascending: false });
  res.json(data || []);
});

// ─────────────────────────────────────────────
// POST ROUTES
// ─────────────────────────────────────────────

// Manually trigger one reminder (demo button)
router.post('/trigger', auth, requireRole('doctor'), async (req, res) => {
  const { patient_id, type, message } = req.body;

  const access = await resolvePatientAccess(req, patient_id);
  if (!access) return res.status(403).json({ error: 'Forbidden' });

  const result = await sendReminder({ patient_id, type, message });
  res.json(result);
});

// Send reading reminders to all overdue patients for this doctor
router.post('/send-overdue-readings', auth, requireRole('doctor'), async (req, res) => {
  const { data: patients } = await supabase
    .from('patients')
    .select('id, reading_due_days, reading_reminder_sent_at, users!patients_user_id_fkey(full_name)')
    .eq('doctor_id', req.user.id);

  const now = new Date();
  let sent = 0;

  for (const p of patients || []) {
    const dueDays = p.reading_due_days ?? 7;

    const { data: lastReadings } = await supabase
      .from('readings')
      .select('logged_at')
      .eq('patient_id', p.id)
      .order('logged_at', { ascending: false })
      .limit(1);

    const lastAt = lastReadings?.[0]?.logged_at ? new Date(lastReadings[0].logged_at) : null;
    const daysSince = lastAt ? (now - lastAt) / 86400000 : Infinity;

    if (lastAt && daysSince < dueDays) continue;

    await sendReminder({
      patient_id: p.id,
      type: 'reading_reminder',
      message:
        `Hi ${p.users?.full_name}, please log your health reading in CareTrack. ` +
        `Your doctor is waiting to review your progress.`
    });

    await supabase
      .from('patients')
      .update({ reading_reminder_sent_at: now.toISOString() })
      .eq('id', p.id);

    sent++;
  }

  res.json({ ok: true, sent });
});

// Force-run each scanner (handy for demo)
router.post('/scan/checkups', auth, requireRole('doctor'), async (req, res) => {
  await runReminderScan();
  res.json({ ok: true, scan: 'checkups' });
});

router.post('/scan/medications', auth, requireRole('doctor'), async (req, res) => {
  await runMedicationScan();
  res.json({ ok: true, scan: 'medications' });
});

router.post('/scan/tests', auth, requireRole('doctor'), async (req, res) => {
  await runTestScan();
  res.json({ ok: true, scan: 'tests' });
});

router.post('/scan/appointments', auth, requireRole('doctor'), async (req, res) => {
  await markMissedAppointments();
  res.json({ ok: true, scan: 'appointments' });
});

module.exports = router;