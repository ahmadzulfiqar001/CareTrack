const supabase = require('../config/supabase');

exports.createPatient = async (req, res) => {
  const { doctor_id, name, phone, condition, medication, next_checkup } = req.body;
  const { data, error } = await supabase
    .from('patients')
    .insert([{ doctor_id, name, phone, condition, medication, next_checkup }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
};

exports.getPatientsByDoctor = async (req, res) => {
  const { doctorId } = req.params;
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('doctor_id', doctorId);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

exports.getPatientById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};