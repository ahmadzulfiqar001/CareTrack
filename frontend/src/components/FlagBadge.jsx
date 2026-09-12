const FLAG_META = {
  missed_followup: {
    label: 'Missed follow-up',
    className: 'bg-red-50 text-danger border-red-200',
    tone: 'Overdue',
  },
  high_bp_trend: {
    label: 'High BP trend',
    className: 'bg-amber-50 text-amber-800 border-amber-200',
    tone: 'Attention',
  },
  high_sugar_trend: {
    label: 'High sugar trend',
    className: 'bg-amber-50 text-amber-800 border-amber-200',
    tone: 'Attention',
  },
  no_recent_logs: {
    label: 'No recent logs',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
    tone: 'Monitor',
  },
  overdue_test: {
    label: 'Overdue test',
    className: 'bg-red-50 text-danger border-red-200',
    tone: 'Overdue',
  },
  pending_appointment_request: {
    label: 'Appointment request',
    className: 'bg-blue-50 text-care-blue border-blue-200',
    tone: 'Info',
  },
};

export function getFlagMeta(flag) {
  return (
    FLAG_META[flag] || {
      label: String(flag).replace(/_/g, ' '),
      className: 'bg-slate-100 text-slate-700 border-slate-200',
      tone: 'Info',
    }
  );
}

export default function FlagBadge({ flag }) {
  const meta = getFlagMeta(flag);
  return (
    <span
      className={`mr-1.5 mb-1.5 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition duration-300 ${meta.className}`}
      title={`${meta.tone}: ${meta.label}`}
    >
      <span className="sr-only">{meta.tone}: </span>
      {meta.label}
    </span>
  );
}

export function StatusBadge({ status = 'on_track' }) {
  const map = {
    on_track: { label: 'On track', className: 'bg-green-50 text-success' },
    attention: { label: 'Needs attention', className: 'bg-amber-50 text-amber-800' },
    overdue: { label: 'Overdue', className: 'bg-red-50 text-danger' },
    info: { label: 'Informational', className: 'bg-blue-50 text-care-blue' },
  };
  const meta = map[status] || map.on_track;
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${meta.className}`}>
      {meta.label}
    </span>
  );
}
