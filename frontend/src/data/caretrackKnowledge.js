export const CARETRACK_ASSISTANT = {
  name: 'CareTrack Assistant',
  greeting:
    "Hi! I'm CareTrack Assistant 👋\nI can help you understand CareTrack, patient follow-up, reminders, health logging, and how the platform works.",
  fallback:
    "I'm not completely sure about that yet. I can help with questions about CareTrack, patient logging, reminders, appointments, the doctor dashboard, and the patient portal.",
  disclaimer:
    'I can explain how CareTrack works, but I am not a doctor and I cannot diagnose, treat, or give emergency medical advice.',
  emergency:
    'If this is a medical emergency or you have serious symptoms, contact a qualified healthcare professional or your local emergency service right away. CareTrack Assistant can only explain how the CareTrack platform works — it cannot diagnose or treat medical conditions.',
  noRecords:
    'I do not have access to patient medical records or personal health data. Sign in to the patient portal or doctor dashboard to view your own CareTrack information.',
};

export const CARETRACK_QUICK_QUESTIONS = [
  { label: 'What is CareTrack?', query: 'What is CareTrack?' },
  { label: 'How do I log my blood pressure?', query: 'How do I log my blood pressure?' },
  { label: 'What does CareTrack remind me about?', query: 'What does CareTrack remind me about?' },
  { label: 'How does the patient portal work?', query: 'How does the patient portal work?' },
  { label: 'How does CareTrack help doctors?', query: 'How does CareTrack help doctors?' },
];

export const CARETRACK_TOPICS = [
  {
    id: 'what-is',
    title: 'What is CareTrack?',
    keywords: [
      'what is',
      'caretrack',
      'about',
      'purpose',
      'what does',
      'explain',
      'platform',
      'app',
      'website',
      'service',
    ],
    answer:
      'CareTrack is a clinic follow-up and chronic disease management app. It helps clinics stay connected with patients between visits through reminders, health logging, trend monitoring, appointments, and attention flags. Chronic care does not stop when the appointment ends — CareTrack keeps that loop visible.',
  },
  {
    id: 'who-for',
    title: 'Who is CareTrack for?',
    keywords: ['who', 'for', 'clinic', 'physician', 'doctor', 'patient', 'audience', 'hypertension', 'diabetes', 'asthma'],
    answer:
      'CareTrack is for small clinics and physicians who manage chronic conditions such as diabetes, hypertension, and asthma — and for their patients who need simple support between visits. Doctors create the clinic workspace; patients use the portal after they are onboarded.',
  },
  {
    id: 'chronic-care',
    title: 'Chronic disease follow-up',
    keywords: ['chronic', 'follow-up', 'follow up', 'between visits', 'continuous', 'disease management'],
    answer:
      'Patients spend most of their time outside the clinic. CareTrack supports chronic-care follow-up by making reminders, readings, missed checkups, and trends visible to both the clinic team and the patient. It is a follow-up tool, not a replacement for in-person care.',
  },
  {
    id: 'logging',
    title: 'Patient self-logging',
    keywords: ['log', 'logging', 'reading', 'self', 'record', 'track', 'enter'],
    answer:
      'Patients sign in to the patient portal and log readings through a simple form. CareTrack currently supports blood sugar, blood pressure, and weight. Each saved reading is time-stamped automatically and appears in the patient portal and on the doctor dashboard.',
  },
  {
    id: 'blood-pressure',
    title: 'Blood pressure logging',
    keywords: ['blood pressure', 'bp', 'systolic', 'diastolic', '120', '80', 'mmhg'],
    answer:
      'To log blood pressure, open the patient portal, choose Log a Reading, and select Blood pressure. Enter systolic and diastolic as two values — for example 120 / 80 mmHg. CareTrack stores those as separate systolic and diastolic readings so doctors can review them clearly.',
  },
  {
    id: 'blood-sugar',
    title: 'Blood sugar logging',
    keywords: ['sugar', 'glucose', 'blood sugar', 'mg/dl', 'diabetes'],
    answer:
      'Patients can log blood sugar from Log a Reading in the patient portal. Enter the meter reading in mg/dL. The value is saved to the patient’s history and shown on trend charts for the patient and their doctor.',
  },
  {
    id: 'weight',
    title: 'Weight logging',
    keywords: ['weight', 'kg', 'scale'],
    answer:
      'Patients can log weight in kilograms from the same logging form. Using the same scale over time helps the clinic review a clearer trend.',
  },
  {
    id: 'reminders',
    title: 'Reminders',
    keywords: ['remind', 'reminder', 'whatsapp', 'notification', 'medication reminder', 'checkup reminder'],
    answer:
      'CareTrack supports checkup, medication, test, and reading reminders. Clinics can trigger supported reminders from the doctor workspace when a follow-up action is due or overdue. Messages are sent using the contact number the doctor entered when onboarding the patient. If you have already completed the action, you can ignore the reminder.',
  },
  {
    id: 'medications',
    title: 'Medication reminders',
    keywords: ['medication', 'medicine', 'dose', 'pills'],
    answer:
      'Doctors can add medications and dose times when they onboard a patient, and they can update them later on the patient profile. Patients see assigned medications in the patient portal. CareTrack can surface medication reminder workflows so routines stay visible between visits.',
  },
  {
    id: 'checkups',
    title: 'Checkup and test reminders',
    keywords: ['checkup', 'test', 'lab', 'overdue test', 'next checkup'],
    answer:
      'Each patient profile can include a follow-up interval, next checkup date, and tracked tests. CareTrack flags overdue checkups and overdue tests on the doctor dashboard so the clinic can follow up earlier.',
  },
  {
    id: 'patient-portal',
    title: 'Patient portal',
    keywords: ['patient portal', 'my health', '/me', 'patient home', 'portal'],
    answer:
      'The patient portal is the signed-in home for patients. After a doctor onboards you, you log in with the email and password your clinic provided. There you can see your latest readings, medications, reminders, appointments, health trends, and follow-up status, and you can log new readings.',
  },
  {
    id: 'doctor-dashboard',
    title: 'Doctor dashboard',
    keywords: ['doctor dashboard', 'clinic workspace', 'dashboard', 'flag', 'needs attention'],
    answer:
      'The doctor dashboard is a clinic workspace for continuous follow-up. Doctors can see who is on track, who needs attention, recent readings, appointment requests, and missed follow-ups. From there they can onboard patients, open a patient profile, and send supported reminders.',
  },
  {
    id: 'doctors',
    title: 'How CareTrack helps doctors',
    keywords: ['help doctors', 'for doctors', 'clinician', 'monitor patients', 'clinic team'],
    answer:
      'Doctors onboard patients, review sugar, blood pressure, and weight trends, see flags for missed follow-ups or concerning patterns, send supported reminders, and manage appointments from one dashboard. The goal is follow-up visibility without digging through scattered files or messages.',
  },
  {
    id: 'patients-use',
    title: 'How patients use CareTrack',
    keywords: ['how do patients', 'patient use', 'for patients', 'stay on track'],
    answer:
      'Patients log in to a simple portal, record sugar, blood pressure, and weight, review their own trends, see medication and checkup reminders, and request or manage supported appointments. The portal is designed to stay clear and avoid complex medical jargon.',
  },
  {
    id: 'trends',
    title: 'Trend monitoring',
    keywords: ['trend', 'chart', 'graph', 'monitor', 'history', 'pattern'],
    answer:
      'Logged readings become trend charts for blood sugar, blood pressure, and weight. Patients can review their own history, and doctors can open the same longitudinal view on a patient profile. Charts use real readings from the CareTrack account — never fabricated medical data.',
  },
  {
    id: 'missed',
    title: 'Missed follow-ups',
    keywords: ['missed', 'overdue', 'flag', 'attention', 'no recent', 'quiet'],
    answer:
      'The doctor dashboard highlights patients who may need attention, including missed follow-ups, overdue tests, quiet logging periods, high BP or sugar trends, and pending appointment requests. Flags help clinics act earlier; they are not a diagnosis.',
  },
  {
    id: 'appointments',
    title: 'Appointments',
    keywords: ['appointment', 'visit', 'schedule', 'book', 'reschedule', 'cancel'],
    answer:
      'Patients can request an appointment from the patient portal. Doctors can schedule, confirm, reschedule, or cancel visits from the patient profile. Appointment status stays visible to both sides inside the same CareTrack workflow.',
  },
  {
    id: 'login',
    title: 'Login',
    keywords: ['login', 'log in', 'sign in', 'password', 'access'],
    answer:
      'Use the Login page with your email and password. Doctors go to the clinic dashboard after signing in. Patients go to the patient portal. Patients should use the email and password provided by their clinic. You can also change your password after you are signed in.',
  },
  {
    id: 'register',
    title: 'Registration',
    keywords: ['register', 'sign up', 'create account', 'get started', 'clinic account'],
    answer:
      'Clinic doctors register for a CareTrack account from the Register page. Patients are not self-serve sign-ups — a doctor onboards each patient and shares the portal login. After registering, a doctor can add patients from the dashboard.',
  },
  {
    id: 'roles',
    title: 'Patient vs doctor',
    keywords: ['difference', 'vs', 'versus', 'role', 'doctor or patient'],
    answer:
      'Doctors create the clinic account, onboard patients, review flags and trends, send supported reminders, and manage appointments. Patients use a simpler portal to log readings, see reminders and medications, and request visits. Each login opens only the workspace that matches that role.',
  },
  {
    id: 'navigation',
    title: 'Finding your way around',
    keywords: ['where', 'navigate', 'page', 'menu', 'how do i find', 'section'],
    answer:
      'On the public site, use the top links for Features, How It Works, For Doctors, For Patients, and FAQ. Get Started opens doctor registration. Login opens sign-in. After login, doctors use Dashboard and Add Patient; patients use My Health and Log Reading.',
  },
];

export const CARETRACK_EMERGENCY_TERMS = [
  'emergency',
  'chest pain',
  'heart attack',
  'stroke',
  'cannot breathe',
  "can't breathe",
  'difficulty breathing',
  'unconscious',
  'overdose',
  'suicidal',
  'severe bleeding',
  'call 911',
  'ambulance',
];

export const CARETRACK_ADVICE_TERMS = [
  'diagnose',
  'diagnosis',
  'what medicine should',
  'prescribe',
  'prescription',
  'treat my',
  'is this dangerous',
  'should i take',
  'dosage should',
  'am i having',
];

export const CARETRACK_RECORD_TERMS = [
  'my records',
  'my reading',
  'my blood pressure',
  'show my',
  'access my',
  'look up my',
  'my chart',
  'my file',
];
