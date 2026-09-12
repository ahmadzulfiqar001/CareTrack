const router = require('express').Router();
const supabase = require('../config/supabase');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

router.get('/', auth, requireRole('doctor'), async (req, res) => {
  const { data: patients, error } = await supabase
    .from('patients')
    .select('*, users!patients_user_id_fkey(full_name, email, phone)')
    .eq('doctor_id', req.user.id);

  if (error) return res.status(400).json({ error: error.message });

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const enriched = [];

  for (const p of patients || []) {
    // ── readings (last 20) ─────────────────────
    const { data: readings } = await supabase
      .from('readings')
      .select('*')
      .eq('patient_id', p.id)
      .order('logged_at', { ascending: false })
      .limit(20);

    // ── pending appointment requests ───────────
    const { data: pendingAppts } = await supabase
      .from('appointments')
      .select('id, scheduled_at, status, notes')
      .eq('patient_id', p.id)
      .eq('status', 'requested')
      .order('scheduled_at');

    const flags = [];

    // Missed follow-up?
    if (p.next_checkup_date && new Date(p.next_checkup_date) < today) {
      flags.push('missed_followup');
    }

    // Risky BP trend (last 3 systolic > 140)
    const bp = (readings || []).filter(r => r.type === 'bp_sys').slice(0, 3);
    if (bp.length >= 3 && bp.every(r => r.value > 140)) flags.push('high_bp_trend');

    // Risky sugar trend (last 3 > 180)
    const sugar = (readings || []).filter(r => r.type === 'sugar').slice(0, 3);
    if (sugar.length >= 3 && sugar.every(r => r.value > 180)) flags.push('high_sugar_trend');

    // No readings in 14 days?
    const last = (readings || [])[0];
    if (last && (today - new Date(last.logged_at)) / 86400000 > 14) {
      flags.push('no_recent_logs');
    }

    // Overdue tests?
    const overdueTests = (p.tests || []).filter(
      t => t.due_date && t.due_date < todayStr
    );
    if (overdueTests.length) flags.push('overdue_test');

    // Pending appointment request from patient?
    if ((pendingAppts || []).length) flags.push('pending_appointment_request');

    enriched.push({
      ...p,
      flags,
      overdueTests,
      pendingAppts: pendingAppts || [],
      latestReadings: (readings || []).slice(0, 5)
    });
  }

  res.json(enriched);
});

module.exports = router;