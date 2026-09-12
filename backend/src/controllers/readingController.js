// readingController.js
const supabase = require('../config/supabase');

exports.addReading = async (req, res) => {
  const { patient_id, reading_type, value } = req.body;
  const { data, error } = await supabase
    .from('readings')
    .insert([{ patient_id, reading_type, value }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
};

// returns data pre-grouped so frontend can drop it straight into Recharts
exports.getReadingsForPatient = async (req, res) => {
  const { patientId } = req.params;
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('patient_id', patientId)
    .order('logged_at', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });

  const grouped = {};
  data.forEach(r => {
    if (!grouped[r.reading_type]) grouped[r.reading_type] = [];
    grouped[r.reading_type].push({ value: r.value, date: r.logged_at });
  });
  res.json(grouped);
};