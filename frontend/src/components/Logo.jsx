import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Logo({
  to = '/',
  className = '',
  showTagline = true,
  size = 'md',
  tone = 'light',
}) {
  const sizes = {
    sm: 'h-9 w-auto sm:h-10',
    md: 'h-10 w-auto sm:h-12',
    lg: 'h-12 w-auto sm:h-14',
  };

  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label="CareTrack home"
    >
      <img
        src={logo}
        alt="CareTrack"
        className={`${sizes[size] || sizes.md} object-contain`}
      />
      {showTagline && (
        <span
          className={`border-l pl-3 text-[10px] font-semibold leading-tight tracking-[0.04em] sm:text-[11px] ${
            tone === 'dark'
              ? 'border-white/20 text-slate-300'
              : 'border-line text-ink-muted'
          }`}
        >
          Better care.
          <br />
          Better follow-up.
        </span>
      )}
    </Link>
  );
}
