import { Link } from 'react-router-dom';
import CareTrackChatbot from '../components/CareTrackChatbot';
import FaqAccordion from '../components/FaqAccordion';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import StatsStrip from '../components/StatsStrip';
import { Button, Card, SectionHeading } from '../components/ui';
import heroImg from '../assets/hero-partner.png';
import storyImg from '../assets/care-story.jpg';

const features = [
  { title: 'Patient Profiles', body: 'Condition, medications, follow-up schedule, and test history in one place.', icon: '◫' },
  { title: 'Medication Reminders', body: 'Keep dosing routines visible so patients stay consistent between visits.', icon: '◷' },
  { title: 'Checkup Reminders', body: 'Automatic signals as follow-up dates approach or become overdue.', icon: '◎' },
  { title: 'Health Logging', body: 'Patients record sugar, blood pressure, and weight in a few simple steps.', icon: '⌁' },
  { title: 'Trend Graphs', body: 'Turn readings into clear charts clinicians can review at a glance.', icon: '◔' },
  { title: 'Doctor Dashboard', body: 'See who is on track and who needs attention without digging through files.', icon: '▦' },
  { title: 'Missed Follow-Up Flags', body: 'Overdue checkups and quiet logging periods rise to the top.', icon: '!' },
  { title: 'Appointment Management', body: 'Request, confirm, reschedule, and cancel visits inside the same workflow.', icon: '◷' },
];

const steps = [
  { n: '01', title: 'Onboard', body: 'Doctor creates a patient profile with condition, medication, and follow-up cadence.' },
  { n: '02', title: 'Remind', body: 'CareTrack triggers checkup and medication reminders as dates approach.' },
  { n: '03', title: 'Log', body: 'Patients record sugar, BP, and weight between clinic visits.' },
  { n: '04', title: 'Monitor', body: 'Readings feed trend graphs visible to both patient and doctor.' },
  { n: '05', title: 'Flag', body: 'The dashboard highlights missed follow-ups and concerning patterns.' },
  { n: '06', title: 'Act', body: 'Clinicians reach out, adjust care, or schedule an earlier visit.' },
];

const faqs = [
  {
    q: 'What is CareTrack?',
    a: 'CareTrack is a clinic patient follow-up and chronic disease management app. It helps clinics keep patients connected between visits with reminders, health logging, trend monitoring, and actionable flags.',
  },
  {
    q: 'Who is CareTrack for?',
    a: 'Small clinics and physicians managing chronic conditions like diabetes, hypertension, and asthma — plus their patients who need support between visits.',
  },
  {
    q: 'How does CareTrack help doctors?',
    a: 'Doctors onboard patients, review readings and trends, see who needs attention, send supported reminders, and manage appointments from one dashboard.',
  },
  {
    q: 'How do patients log their health readings?',
    a: 'Patients sign in to the patient portal and log blood sugar, blood pressure, and weight through a simple form. Readings appear in their portal and on the doctor dashboard.',
  },
  {
    q: 'What can patients track?',
    a: 'Patients can track blood sugar, blood pressure (systolic and diastolic), weight, medications, reminders, appointments, and personal health trends.',
  },
  {
    q: 'How do reminders work?',
    a: 'The system supports checkup and medication reminder workflows. Doctors can also trigger supported reminders from a patient profile when follow-up is needed.',
  },
  {
    q: 'How does CareTrack identify patients needing attention?',
    a: 'The doctor dashboard flags missed follow-ups, high BP or sugar trends, overdue tests, quiet logging periods, and pending appointment requests so clinics can act earlier.',
  },
];

export default function Landing() {
  return (
    <div className="bg-white">
      <section className="overflow-hidden bg-care-cream">
        <div className="ct-container grid items-start gap-8 pt-6 pb-10 lg:grid-cols-2 lg:gap-12 lg:pt-8 lg:pb-12">
          <div>
            <p className="ct-kicker ct-hero-kicker">Clinic follow-up · Chronic care</p>
            <h1 className="ct-display ct-hero-title mt-3 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.25rem]">
              Chronic care doesn&apos;t stop when the appointment ends.
            </h1>
            <p className="ct-hero-text mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              CareTrack keeps patients connected between visits through reminders, health logging,
              trend monitoring, and actionable follow-up visibility for clinics.
            </p>
            <div className="ct-hero-actions mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/register" variant="navy">
                Get Started
              </Button>
              <Button as="a" href="#how-it-works" variant="secondary">
                See How It Works
              </Button>
            </div>
          </div>

          <div className="ct-hero-media relative">
            <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-soft">
              <img
                src={heroImg}
                alt="Doctor and patient partnership"
                className="h-auto w-full object-contain object-center transition duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </section>

      <StatsStrip />

      <section id="about" className="ct-section bg-white">
        <div className="ct-container grid items-center gap-10 lg:grid-cols-2">
          <Reveal variant="left" className="overflow-hidden rounded-card shadow-card">
            <img
              src={storyImg}
              alt="Healthcare professional supporting a patient with continuous care"
              className="h-[320px] w-full object-cover object-[center_20%] transition duration-500 hover:scale-[1.015] sm:h-[400px]"
            />
          </Reveal>
          <Reveal variant="right">
            <p className="ct-kicker">Who CareTrack is for</p>
            <h2 className="ct-display mt-2 text-3xl sm:text-4xl">
              Chronic disease isn&apos;t managed only during clinic visits.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Patients spend most of their time outside the clinic. Missed checkups, skipped
              medication, and silent trend changes are easy to miss until they become bigger
              problems. CareTrack closes that gap with a shared loop between doctors and patients.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'Human-centered follow-up',
                'Clear health trends',
                'Smart attention flags',
                'Simple patient logging',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <span className="text-care-teal">✧</span> {item}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="features" className="ct-section bg-care-cream">
        <div className="ct-container">
          <Reveal>
            <SectionHeading
              kicker="Core features"
              title="Everything needed for better follow-up"
              subtitle="One clean workflow for the clinic team and the patient — from reminders to trends."
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <Card className="bg-white p-5">
                  <div className="ct-card-icon flex h-11 w-11 items-center justify-center rounded-xl bg-care-teal-light text-lg text-care-teal">
                    {f.icon}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-navy">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="for-doctors" className="ct-section bg-white">
        <div className="ct-container">
          <Reveal>
            <div className="rounded-[1.75rem] bg-navy p-8 text-white sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_repeat(5,1fr)] lg:items-start">
                <div className="lg:pr-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-teal-200">
                    Advanced care
                  </p>
                  <h2 className="font-display mt-2 text-3xl leading-tight sm:text-4xl">
                    See what happens between visits.
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
                    Give clinic teams a focused workspace for chronic care monitoring — without chasing
                    every chart manually.
                  </p>
                </div>
                {[
                  { t: 'Health readings', d: 'Sugar, BP, and weight history.' },
                  { t: 'Medication reminders', d: 'Keep routines visible.' },
                  { t: 'Missed follow-ups', d: 'Overdue checkups rise up.' },
                  { t: 'Trend changes', d: 'Spot concerning patterns.' },
                  { t: 'Upcoming appointments', d: 'Keep visits organized.' },
                ].map((item) => (
                  <div key={item.t} className="ct-adv-item border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                    <p className="text-sm font-bold">{item.t}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="how-it-works" className="ct-section bg-care-cream">
        <div className="ct-container">
          <Reveal>
            <SectionHeading
              kicker="How CareTrack works"
              title="Onboard → Remind → Log → Monitor → Flag → Act"
              subtitle="A continuous care loop that builds a longitudinal health record for every patient."
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <Card className="p-5">
                  <p className="ct-card-icon text-sm font-extrabold text-care-teal">{s.n}</p>
                  <h3 className="mt-4 text-lg font-bold text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="for-patients" className="ct-section bg-white">
        <div className="ct-container grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="ct-kicker">For patients</p>
            <h2 className="ct-display mt-2 text-3xl sm:text-4xl">A simpler way to stay on track</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Patients see what matters today — readings, medication reminders, upcoming
              appointments, and follow-up status — without complex medical jargon.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'Health overview',
                'Blood sugar, BP & weight',
                'Medication reminders',
                'Upcoming appointment',
                'Health trends',
                'Recent logs',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <span className="text-care-teal">✓</span> {item}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button as={Link} to="/login" variant="navy">
                Patient login →
              </Button>
            </div>
          </Reveal>

          <Reveal variant="right">
            <div className="rounded-[1.5rem] bg-navy p-4 sm:p-5">
              <div className="rounded-2xl bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-care-teal">
                      Patient portal
                    </p>
                    <h3 className="mt-1 font-display text-2xl text-navy">Your care at a glance</h3>
                  </div>
                  <span className="rounded-full bg-care-teal-light px-3 py-1 text-[10px] font-bold text-care-teal">
                    On track
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    ['Blood sugar', '—', 'mg/dL'],
                    ['Blood pressure', '—', 'mmHg'],
                    ['Weight', '—', 'kg'],
                  ].map(([label, value, unit]) => (
                    <div key={label} className="rounded-xl border border-line p-3">
                      <p className="text-[10px] text-ink-muted">{label}</p>
                      <p className="mt-1 font-display text-xl text-navy">{value}</p>
                      <p className="text-[10px] font-semibold text-care-teal">{unit}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-line pt-4 text-sm">
                  <p className="font-semibold text-navy">Today&apos;s reminder</p>
                  <p className="mt-1 text-ink-muted">
                    Medication and checkup reminders appear after your clinic onboards you.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="ct-section bg-care-cream">
        <div className="ct-container">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-[1.5rem] bg-navy p-8 text-white sm:flex-row sm:items-center sm:p-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl">Keep the care journey moving.</h2>
                <p className="mt-2 max-w-xl text-sm text-slate-300">
                  Connect your clinic team and patients with one simple follow-up experience.
                </p>
              </div>
              <Button as={Link} to="/register" variant="primary" className="shrink-0">
                Get Started →
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="ct-section bg-white">
        <div className="ct-container">
          <Reveal>
            <SectionHeading
              kicker="FAQ"
              title="Questions clinics and patients ask"
              subtitle="Clear answers about how CareTrack supports chronic care between visits."
            />
          </Reveal>
          <Reveal>
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>

      <Footer />
      <CareTrackChatbot />
    </div>
  );
}
