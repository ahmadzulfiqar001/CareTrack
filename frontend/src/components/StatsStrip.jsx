import { useEffect, useState } from 'react';
import useInView from '../hooks/useInView';

const STATS = [
  { value: '24/7', label: 'Patient engagement' },
  { value: '3×', label: 'Core monitoring signals' },
  { value: '100%', label: 'Follow-up visibility' },
  { value: '1', label: 'Connected care workflow' },
];

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function parseCount(value) {
  if (value === '100%') return { target: 100, suffix: '%' };
  if (value === '3×') return { target: 3, suffix: '×' };
  if (value === '1') return { target: 1, suffix: '' };
  return null;
}

function StatValue({ value, visible, delay }) {
  const [text, setText] = useState(() => (prefersReducedMotion() ? value : ''));

  useEffect(() => {
    if (!visible || prefersReducedMotion()) return undefined;

    const counted = parseCount(value);
    if (!counted) {
      const timer = window.setTimeout(() => setText(value), delay);
      return () => window.clearTimeout(timer);
    }

    let raf = 0;
    const duration = 720;
    const begin = performance.now() + delay;

    const tick = (now) => {
      if (now < begin) {
        raf = window.requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(1, (now - begin) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setText(`${Math.round(counted.target * eased)}${counted.suffix}`);
      if (progress < 1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        setText(value);
      }
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [delay, value, visible]);

  return (
    <span aria-hidden="true" className="ct-stat-value">
      {text || (visible ? value : '')}
    </span>
  );
}

export default function StatsStrip() {
  const [ref, visible] = useInView({ threshold: 0.35, rootMargin: '0px 0px -12% 0px' });

  return (
    <section
      ref={ref}
      className={`ct-stats-strip bg-navy text-white ${visible ? 'is-stats-visible' : ''}`}
    >
      <div className="ct-container">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, index) => (
            <div key={stat.label} className="ct-stat-cell">
              {index > 0 && <span className="ct-stat-divider" aria-hidden="true" />}
              <p className="sr-only">{`${stat.value} ${stat.label}`}</p>
              <StatValue value={stat.value} visible={visible} delay={index * 90} />
              <p className="ct-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
