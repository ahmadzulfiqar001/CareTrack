import { Link } from 'react-router-dom';
import Logo from './Logo';

const productLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#for-doctors', label: 'For Doctors' },
  { href: '/#for-patients', label: 'For Patients' },
  { href: '/#faq', label: 'FAQ' },
];

const infoLinks = [
  { href: '/#about', label: 'About CareTrack' },
  { href: 'mailto:support@caretrack.app', label: 'Contact' },
  { href: 'mailto:support@caretrack.app', label: 'Support' },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="ct-container py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="inline-flex rounded-xl bg-white px-2.5 py-2">
              <Logo to="/" tone="light" size="md" showTagline={false} />
            </div>
            <p className="mt-3 text-[11px] font-semibold tracking-[0.04em] text-slate-300">
              Better care. Better follow-up.
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-300">
              Clinic patient follow-up and chronic disease management between visits.
            </p>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-200">Product</p>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-200">Information</p>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              {infoLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-200">Account</p>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/login" className="transition hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="transition hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-400">
          © 2026 CareTrack. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
