const app = require('./src/app');
require('./src/jobs/scheduler'); // start cron
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CareTrack API on :${PORT}`));