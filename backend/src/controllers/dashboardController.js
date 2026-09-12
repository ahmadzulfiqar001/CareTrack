const supabase = require('../config/supabase');
const { isOverdue } = require('../services/flagService');

exports.getDashboard = async (req, res) => {
  const { doctorId } = req.params;
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('doctor_id', doctorId);
  if (error) return res.status(400).json({ error: error.message });

  const withFlags = data.map(p => ({
    ...p,
    flagged: isOverdue(p.next_checkup)
  }));

  res.json({
    total: withFlags.length,
    flagged: withFlags.filter(p => p.flagged),
    patients: withFlags
  });
};