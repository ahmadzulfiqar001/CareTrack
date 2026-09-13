import { useState } from 'react';

export default function FaqAccordion({ items = [] }) {
  const [openId, setOpenId] = useState(items[0]?.q || null);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item) => {
        const open = openId === item.q;
        return (
          <div
            key={item.q}
            className={`overflow-hidden rounded-card border border-line bg-white transition-shadow duration-300 ${
              open ? 'shadow-card' : 'shadow-none'
            }`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-navy"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.q)}
            >
              <span>{item.q}</span>
              <span
                className={`text-care-teal transition-transform duration-[320ms] ease-out ${open ? 'rotate-45' : ''}`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-[320ms] ease-out ${
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`px-5 pb-5 text-sm leading-relaxed text-ink-muted transition duration-300 ${
                    open ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                  }`}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
