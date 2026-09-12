const supabase = require('../config/supabase');

// Returns the patient row if req.user owns/owns-as-doctor it. Else null.
async function resolvePatientAccess(req, patientId) {
  const { data } = await supabase
    .from('patients')
    .select('id, user_id, doctor_id')
    .eq('id', patientId)
    .single();
  if (!data) return null;

  if (req.user.role === 'doctor' && data.doctor_id === req.user.id) return data;
  if (req.user.role === 'patient' && data.user_id === req.user.id) return data;
  return null;
}

module.exports = { resolvePatientAccess };