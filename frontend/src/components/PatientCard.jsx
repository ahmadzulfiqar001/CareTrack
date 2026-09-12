import { Link } from 'react-router-dom';
import FlagBadge, { StatusBadge } from './FlagBadge';
import { Card } from './ui';

export default function PatientCard({ patient }) {
  const flagged = patient.flags?.length > 0;
  const name = patient.users?.full_name || 'Patient';
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card
      className={`p-5 transition hover:-translate-y-0.5 hover:shadow-soft ${
        flagged ? 'border-amber-200 bg-amber-50/40' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-navy">{name}</h3>
            <p className="text-sm capitalize text-ink-muted">{patient.condition}</p>
          </div>
        </div>
        <StatusBadge status={flagged ? 'attention' : 'on_track'} />
      </div>

      <p className="mt-4 text-sm text-ink-muted">
        Next checkup:{' '}
        <span className="font-semibold text-navy">{patient.next_checkup_date || 'Not set'}</span>
      </p>

      {flagged && (
        <div className="mt-3 flex flex-wrap">
          {patient.flags.map((f) => (
            <FlagBadge key={f} flag={f} />
          ))}
        </div>
      )}

      <Link
        to={`/patient/${patient.id}`}
        className="mt-4 inline-flex text-sm font-semibold text-care-blue transition hover:text-blue-700"
      >
        View patient →
      </Link>
    </Card>
  );
}
