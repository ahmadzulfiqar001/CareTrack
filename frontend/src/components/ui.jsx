export function Button({
  as: Comp = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const variants = {
    primary: 'ct-button-primary',
    navy: 'ct-button-navy',
    teal: 'ct-button-teal',
    secondary: 'ct-button-secondary',
  };
  return (
    <Comp className={`${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </Comp>
  );
}

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`ct-card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SectionHeading({ kicker, title, subtitle, align = 'center', className = '' }) {
  return (
    <div
      className={`mb-10 max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'} ${className}`}
    >
      {kicker && <p className="ct-kicker">{kicker}</p>}
      <h2 className="ct-display mt-2 text-3xl sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-ink-muted">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-slate-50 px-6 py-10 text-center">
      <p className="font-semibold text-navy">{title}</p>
      {description && <p className="mt-2 text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center p-8" role="status" aria-live="polite">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-care-blue/25 border-t-care-blue" />
        <p className="mt-4 text-sm font-medium text-ink-muted">{label}</p>
      </div>
    </div>
  );
}

export function StatCard({ label, value, hint, tone = 'default' }) {
  const tones = {
    default: 'text-care-blue',
    warning: 'text-warning',
    danger: 'text-danger',
    info: 'text-care-blue',
    success: 'text-success',
  };
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-2 font-display text-3xl text-navy">{value}</p>
      {hint && <p className={`mt-1 text-xs font-semibold ${tones[tone]}`}>{hint}</p>}
    </Card>
  );
}

export function HealthMetricCard({ label, value, unit, hint }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-1 font-display text-2xl text-navy">
        {value ?? '—'}
        {unit && value != null && (
          <span className="ml-1 text-sm font-sans font-medium text-ink-muted">{unit}</span>
        )}
      </p>
      {hint && <p className="mt-1 text-xs font-semibold text-care-blue">{hint}</p>}
    </Card>
  );
}

export function Field({ label, id, error, children, hint }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="ct-label" htmlFor={id}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
