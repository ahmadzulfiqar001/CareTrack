const router = require('express').Router();
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const { sendReminder } = require('../services/reminder.service');
const { requireRole } = require('../middleware/roles');

// ─────────────────────────────────────────────
// IMPORTANT: /me/profile must be BEFORE /:id
// ─────────────────────────────────────────────
router.get('/me/profile', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*, users!patients_user_id_fkey(full_name, email, phone)')
    .eq('user_id', req.user.id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─────────────────────────────────────────────
// Doctor creates patient
// ─────────────────────────────────────────────
router.post('/', auth, requireRole('doctor'), async (req, res) => {
  const {
    email, password, full_name, phone,
    condition, medications, followup_interval_days, tests
  } = req.body;

  const hash = await bcrypt.hash(password, 8);

  const { data: user, error: uErr } = await supabase
    .from('users')
    .insert([{ email, password: hash, full_name, role: 'patient', phone }])
    .select()
    .single();
  if (uErr) return res.status(400).json({ error: uErr.message });

  const next = new Date();
  next.setDate(next.getDate() + (followup_interval_days || 30));

  const { data: patient, error: pErr } = await supabase
    .from('patients')
    .insert([{
      user_id: user.id,
      doctor_id: req.user.id,
      condition,
      medications: medications || [],
      tests: tests || [],
      followup_interval_days: followup_interval_days || 30,
      next_checkup_date: next.toISOString().split('T')[0]
    }])
    .select()
    .single();
  if (pErr) return res.status(400).json({ error: pErr.message });

  // Welcome message (fire-and-forget — don't block response)
  const welcomeMsg =
    `Welcome to CareTrack, ${full_name}!\n\n` +
    `Your doctor has set up your follow-up care.\n\n` +
    `Login at: https://caretrack.vercel.app\n` +
    `Email: ${email}\n` +
    `Password: ${password}\n\n` +
    `Please log in and change your password soon.`;

  sendReminder({
    patient_id: patient.id,
    type: 'welcome',
    message: welcomeMsg
  }).catch(e => console.log('[welcome] failed:', e.message));

  res.json({ patient, user });
});

// ─────────────────────────────────────────────
// Doctor: list my patients (with joined user info)
// ─────────────────────────────────────────────
router.get('/', auth, requireRole('doctor'), async (req, res) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*, users!patients_user_id_fkey(full_name, email, phone)')
    .eq('doctor_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ─────────────────────────────────────────────
// Get single patient with readings + appointments
// ─────────────────────────────────────────────
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;

  // Determine access scope
  let query = supabase
    .from('patients')
    .select('*, users!patients_user_id_fkey(full_name, email, phone)')
    .eq('id', id);

  if (req.user.role === 'doctor') {
    query = query.eq('doctor_id', req.user.id);
  } else if (req.user.role === 'patient') {
    query = query.eq('user_id', req.user.id);
  } else {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { data: patient, error } = await query.single();
  if (error || !patient) return res.status(404).json({ error: 'Not found' });

  const { data: readings } = await supabase
    .from('readings')
    .select('*')
    .eq('patient_id', id)
    .order('logged_at', { ascending: true });

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', id)
    .order('scheduled_at');

  res.json({
    patient,
    readings: readings || [],
    appointments: appointments || []
  });
});

// ─────────────────────────────────────────────
// Doctor: update patient (medications, tests, condition)
// ─────────────────────────────────────────────
router.patch('/:id', auth, requireRole('doctor'), async (req, res) => {
  const { id } = req.params;
  const allowed = ['condition', 'medications', 'tests', 'followup_interval_days', 'next_checkup_date', 'reading_due_days'];
  const updates = {};

  for (const k of allowed) {
    if (k in req.body) updates[k] = req.body[k];
  }

  // Validate tests array
  if ('tests' in updates) {
    if (!Array.isArray(updates.tests)) {
      return res.status(400).json({ error: 'tests must be an array' });
    }
    for (const t of updates.tests) {
      if (!t || typeof t.name !== 'string' || !t.name.trim()) {
        return res.status(400).json({ error: 'Each test needs a name' });
      }
      if (t.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(t.due_date)) {
        return res.status(400).json({ error: 'due_date must be YYYY-MM-DD' });
      }
    }
  }

  // Validate medications array
  if ('medications' in updates) {
    if (!Array.isArray(updates.medications)) {
      return res.status(400).json({ error: 'medications must be an array' });
    }
    for (const m of updates.medications) {
      if (!m || typeof m.name !== 'string' || !m.name.trim()) {
        return res.status(400).json({ error: 'Each medication needs a name' });
      }
      if (m.times && !Array.isArray(m.times)) {
        return res.status(400).json({ error: 'medication times must be an array' });
      }
    }
  }

  if ('reading_due_days' in updates) {
    const n = Number(updates.reading_due_days);
    if (!Number.isInteger(n) || n < 1 || n > 365) {
      return res.status(400).json({ error: 'reading_due_days must be an integer between 1 and 365' });
    }
    updates.reading_due_days = n;
  }

  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', id)
    .eq('doctor_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;