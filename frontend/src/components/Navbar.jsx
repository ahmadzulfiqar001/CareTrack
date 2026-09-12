import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { Button } from './ui';

const marketingLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#for-doctors', label: 'For Doctors' },
  { href: '/#for-patients', label: 'For Patients' },
  { href: '/#faq', label: 'FAQ' },
];

function navClass({ isActive }) {
  return `rounded-control px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-blue-50 text-care-blue'
      : 'text-ink-muted hover:bg-slate-50 hover:text-navy'
  }`;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setOpen(false);
    nav('/');
  };

  const close = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="ct-container flex h-[4.25rem] items-center justify-between gap-4">
        <Logo to="/" showTagline size="md" />

        {!user && isLanding && (
          <div className="hidden items-center gap-6 lg:flex">
            <Link to="/" className="text-sm font-semibold text-ink-muted transition hover:text-care-blue">
              Home
            </Link>
            {marketingLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-semibold text-ink-muted transition hover:text-care-blue"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-control px-3 py-2 text-sm font-semibold text-ink-muted transition hover:bg-slate-50 hover:text-care-blue sm:px-4"
              >
                Login
              </Link>
              <Button as={Link} to="/register" variant="navy" className="!py-2.5 !text-sm">
                Get Started
              </Button>
              {isLanding && (
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-line text-navy lg:hidden"
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  aria-expanded={open}
                  onClick={() => setOpen((v) => !v)}
                >
                  <span className="text-lg leading-none">{open ? '×' : '☰'}</span>
                </button>
              )}
            </>
          ) : (
            <>
              <div className="hidden items-center gap-2 md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 font-semibold text-care-blue">
                  {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-navy">{user.full_name}</p>
                  <p className="text-xs capitalize text-ink-muted">{user.role}</p>
                </div>
              </div>

              <Link
                to="/"
                className="hidden rounded-control px-3 py-2 text-sm font-semibold text-ink-muted transition hover:bg-slate-50 hover:text-navy sm:inline-flex"
              >
                Home
              </Link>

              {user.role === 'doctor' && (
                <>
                  <NavLink to="/doctor" className={navClass}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/add-patient" className={({ isActive }) => `${navClass({ isActive })} hidden sm:inline-flex`}>
                    Add Patient
                  </NavLink>
                </>
              )}

              {user.role === 'patient' && (
                <>
                  <NavLink to="/me" className={navClass}>
                    My Health
                  </NavLink>
                  <NavLink to="/log" className={({ isActive }) => `${navClass({ isActive })} hidden sm:inline-flex`}>
                    Log Reading
                  </NavLink>
                </>
              )}

              <Link to="/change-password" className="hover:underline">Change password</Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-control border border-line px-4 py-2.5 text-sm font-semibold text-ink-muted transition hover:border-red-200 hover:bg-red-50 hover:text-danger"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {open && !user && isLanding && (
        <div className="border-t border-line bg-white px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            <Link to="/" onClick={close} className="rounded-control px-3 py-2.5 text-sm font-semibold text-navy hover:bg-slate-50">
              Home
            </Link>
            {marketingLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="rounded-control px-3 py-2.5 text-sm font-semibold text-ink-muted hover:bg-slate-50"
              >
                {l.label}
              </a>
            ))}
            <Link to="/login" onClick={close} className="rounded-control px-3 py-2.5 text-sm font-semibold text-care-blue">
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
