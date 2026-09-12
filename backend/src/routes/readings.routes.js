const router = require('express').Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { resolvePatientAccess } = require('../middleware/ownership');

// Patient logs a reading
router.post('/', auth, async (req, res) => {
  const { patient_id, type, value } = req.body;

  const access = await resolvePatientAccess(req, patient_id);
  if (!access) return res.status(403).json({ error: 'Forbidden' });

  const { data, error } = await supabase
    .from('readings')
    .insert([{ patient_id, type, value }])
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Get readings for a patient (optionally filter by type)
router.get('/:patientId', auth, async (req, res) => {
  const access = await resolvePatientAccess(req, req.params.patientId);
  if (!access) return res.status(403).json({ error: 'Forbidden' });

  let q = supabase
    .from('readings')
    .select('*')
    .eq('patient_id', req.params.patientId)
    .order('logged_at');
  if (req.query.type) q = q.eq('type', req.query.type);

  const { data, error } = await q;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;