const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,                  // 10 attempts per IP
  message: { error: 'Too many attempts, try again later' }
});

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password, full_name, role, phone } = req.body;
  const hash = await bcrypt.hash(password, 8);
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password: hash, full_name, role, phone }])
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  const token = jwt.sign(
    { id: data.id, role: data.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, user: { id: data.id, role: data.role, full_name, email } });
});

// LOGIN
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, user: { id: user.id, role: user.role, full_name: user.full_name, email } });
});

// CHANGE PASSWORD
router.post('/change-password', auth, async (req, res) => {
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'Both fields required' });
  }
  if (new_password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const { data: user } = await supabase
    .from('users')
    .select('password')
    .eq('id', req.user.id)
    .single();

  if (!user) return res.status(404).json({ error: 'User not found' });

  const ok = await bcrypt.compare(current_password, user.password);
  if (!ok) return res.status(401).json({ error: 'Current password is incorrect' });

  const hash = await bcrypt.hash(new_password, 8);
  const { error } = await supabase
    .from('users')
    .update({ password: hash })
    .eq('id', req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});

module.exports = router;