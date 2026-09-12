import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { EmptyState } from './ui';

const LABELS = {
  sugar: { title: 'Blood sugar', unit: 'mg/dL', color: '#2563EB' },
  bp_sys: { title: 'Blood pressure (systolic)', unit: 'mmHg', color: '#0F766E' },
  bp_dia: { title: 'Blood pressure (diastolic)', unit: 'mmHg', color: '#0B1F33' },
  weight: { title: 'Weight', unit: 'kg', color: '#2563EB' },
};

export default function TrendChart({ readings = [], type, height = 220 }) {
  const meta = LABELS[type] || { title: type, unit: '', color: '#2563EB' };
  const data = readings
    .filter((r) => r.type === type)
    .map((r) => ({
      date: new Date(r.logged_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      value: Number(r.value),
      full: new Date(r.logged_at).toLocaleString(),
    }));

  if (!data.length) {
    return (
      <div className="my-3">
        <h4 className="mb-2 text-sm font-semibold text-navy">{meta.title}</h4>
        <EmptyState
          title="No readings yet"
          description="Your trend will appear here once readings are logged."
        />
      </div>
    );
  }

  return (
    <div className="my-4">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h4 className="text-sm font-semibold text-navy">{meta.title}</h4>
        <span className="text-xs text-ink-muted">{meta.unit}</span>
      </div>
      <div className="h-[220px] w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="date" fontSize={11} tick={{ fill: '#64748B' }} />
            <YAxis fontSize={11} tick={{ fill: '#64748B' }} width={42} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                boxShadow: '0 12px 40px rgba(11,31,51,0.08)',
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.full || ''}
              formatter={(value) => [`${value} ${meta.unit}`.trim(), meta.title]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={meta.color}
              strokeWidth={2.5}
              dot={{ r: 3, fill: meta.color }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
