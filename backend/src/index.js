const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/patients', require('./routes/patients.routes'));
app.use('/api/readings', require('./routes/readings'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/reminders', require('./routes/appointments.routes'));

app.listen(process.env.PORT, () => console.log(`Running on ${process.env.PORT}`));