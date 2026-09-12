const router = require('express').Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');

// ─────────────────────────────────────────────
// Helper: resolve logged-in patient's record
// ─────────────────────────────────────────────
async function resolvePatient(req) {
  if (req.user.role !== 'patient') return null;
  const { data } = await supabase
    .from('patients')
    .select('id, user_id, doctor_id')
    .eq('user_id', req.user.id)
    .single();
  return data;
}

// ─────────────────────────────────────────────
// Helper: does this doctor own this patient?
// ─────────────────────────────────────────────
async function doctorOwnsPatient(doctorId, patientId) {
  const { data } = await supabase
    .from('patients')
    .select('id')
    .eq('id', patientId)
    .eq('doctor_id', doctorId)
    .single();
  return !!data;
}

// ─────────────────────────────────────────────
// POST /api/appointments
// Doctor: passes patient_id → status = 'scheduled'
// Patient: patient_id auto-resolved → status = 'requested'
// ─────────────────────────────────────────────
router.post('/', auth, async (req, res) => {
  let { patient_id, scheduled_at, notes } = req.body;

  if (!scheduled_at) {
    return res.status(400).json({ error: 'scheduled_at required' });
  }

  let status = 'scheduled';
  const created_by = req.user.id;

  if (req.user.role === 'patient') {
    const me = await resolvePatient(req);
    if (!me) return res.status(404).json({ error: 'Patient profile not found' });
    patient_id = me.id;
    status = 'requested';
  } else if (req.user.role === 'doctor') {
    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id required' });
    }
    const owns = await doctorOwnsPatient(req.user.id, patient_id);
    if (!owns) return res.status(403).json({ error: 'Forbidden' });
  } else {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert([{ patient_id, scheduled_at, notes, status, created_by }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  // Doctor-created → immediately bump next_checkup_date
  if (status === 'scheduled') {
    await supabase
      .from('patients')
      .update({ next_checkup_date: scheduled_at.split('T')[0] })
      .eq('id', patient_id);
  }

  res.json(data);
});

// ─────────────────────────────────────────────
// GET /api/appointments/patient/:patientId
// Doctor: must own the patient
// Patient: must be the patient
// ─────────────────────────────────────────────
router.get('/patient/:patientId', auth, async (req, res) => {
  const { patientId } = req.params;

  if (req.user.role === 'doctor') {
    const owns = await doctorOwnsPatient(req.user.id, patientId);
    if (!owns) return res.status(403).json({ error: 'Forbidden' });
  } else if (req.user.role === 'patient') {
    const me = await resolvePatient(req);
    if (!me || me.id !== patientId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  } else {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .order('scheduled_at');

  if (error) return res.status(400).json({ error: error.message });
  res.json(data || []);
});

// ─────────────────────────────────────────────
// PATCH /api/appointments/:id
// Doctor: can change scheduled_at, notes, status
// Patient: can only reschedule (scheduled_at, notes)
//          → status reset to 'requested'
// ─────────────────────────────────────────────
router.patch('/:id', auth, async (req, res) => {
  const { id } = req.params;

  const { data: existing } = await supabase
    .from('appointments')
    .select('*, patients!inner(id, user_id, doctor_id)')
    .eq('id', id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Not found' });

  // Ownership check
  if (req.user.role === 'doctor') {
    if (existing.patients.doctor_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  } else if (req.user.role === 'patient') {
    if (existing.patients.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  } else {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const updates = {};

  if (req.user.role === 'doctor') {
    if ('scheduled_at' in req.body) updates.scheduled_at = req.body.scheduled_at;
    if ('notes' in req.body) updates.notes = req.body.notes;
    if ('status' in req.body) updates.status = req.body.status;
  } else {
    if ('scheduled_at' in req.body) updates.scheduled_at = req.body.scheduled_at;
    if ('notes' in req.body) updates.notes = req.body.notes;
    // Any patient edit resets status back to 'requested'
    updates.status = 'requested';
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  // Doctor confirmed a scheduled appointment → bump next_checkup_date
  if (
    req.user.role === 'doctor' &&
    updates.status === 'scheduled' &&
    (updates.scheduled_at || existing.scheduled_at)
  ) {
    const when = updates.scheduled_at || existing.scheduled_at;
    await supabase
      .from('patients')
      .update({ next_checkup_date: when.split('T')[0] })
      .eq('id', existing.patient_id);
  }

  res.json(data);
});

// ─────────────────────────────────────────────
// DELETE /api/appointments/:id
// Soft cancel (status = 'cancelled')
// Doctor: must own patient
// Patient: must be the patient
// ─────────────────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  const { data: existing } = await supabase
    .from('appointments')
    .select('*, patients!inner(user_id, doctor_id)')
    .eq('id', id)
    .single();

  if (!existing) return res.status(404).json({ error: 'Not found' });

  const allowed =
    (req.user.role === 'doctor' && existing.patients.doctor_id === req.user.id) ||
    (req.user.role === 'patient' && existing.patients.user_id === req.user.id);

  if (!allowed) return res.status(403).json({ error: 'Forbidden' });

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});

module.exports = router;