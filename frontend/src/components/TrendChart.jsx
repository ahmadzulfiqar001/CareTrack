import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { EmptyState } from './ui';
import { formatReadingTypeLabel, formatReadingUnit } from '../utils/readings';

const COLORS = {
  sugar: '#2563EB',
  bp_sys: '#0F766E',
  bp_dia: '#0B1F33',
  bp: '#0F766E',
  weight: '#2563EB',
};

function byDate(readings, type) {
  return readings
    .filter((r) => r.type === type)
    .map((r) => ({
      date: new Date(r.logged_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      value: Number(r.value),
      full: new Date(r.logged_at).toLocaleString(),
      ts: new Date(r.logged_at).getTime(),
    }));
}

function combineBp(readings) {
  const sys = byDate(readings, 'bp_sys');
  const dia = byDate(readings, 'bp_dia');
  const keys = new Map();

  for (const row of sys) {
    const key = `${row.date}-${Math.round(row.ts / 120000)}`;
    keys.set(key, { date: row.date, full: row.full, ts: row.ts, systolic: row.value });
  }
  for (const row of dia) {
    const key = `${row.date}-${Math.round(row.ts / 120000)}`;
    const existing = keys.get(key) || { date: row.date, full: row.full, ts: row.ts };
    existing.diastolic = row.value;
    if (!existing.full) existing.full = row.full;
    keys.set(key, existing);
  }

  return [...keys.values()].sort((a, b) => a.ts - b.ts);
}

export default function TrendChart({ readings = [], type, height = 220 }) {
  const isBp = type === 'bp';
  const title = isBp ? 'Blood pressure' : formatReadingTypeLabel(type);
  const unit = formatReadingUnit(isBp ? 'bp' : type);
  const color = COLORS[type] || '#2563EB';
  const data = isBp ? combineBp(readings) : byDate(readings, type);
  const hasData = isBp ? data.some((d) => d.systolic != null || d.diastolic != null) : data.length > 0;

  if (!hasData) {
    return (
      <div className="my-3">
        <h4 className="mb-2 text-sm font-semibold text-navy">{title}</h4>
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
        <h4 className="text-sm font-semibold text-navy">{title}</h4>
        <span className="text-xs text-ink-muted">{unit}</span>
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
              formatter={(value, name) => {
                if (value == null) return ['—', name];
                return [`${value} ${unit}`.trim(), name];
              }}
            />
            {isBp ? (
              <>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic"
                  stroke={COLORS.bp_sys}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: COLORS.bp_sys }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic"
                  stroke={COLORS.bp_dia}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: COLORS.bp_dia }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              </>
            ) : (
              <Line
                type="monotone"
                dataKey="value"
                name={title}
                stroke={color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: color }}
                activeDot={{ r: 5 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
