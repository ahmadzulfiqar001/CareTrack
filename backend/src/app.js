const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://care-track-public.vercel.app'
  ]
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/patients', require('./routes/patients.routes'));
app.use('/api/readings', require('./routes/readings.routes'));
app.use('/api/appointments', require('./routes/appointments.routes'));
app.use('/api/reminders', require('./routes/reminders.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

app.get('/', (req, res) => res.send('CareTrack API running'));
module.exports = app;