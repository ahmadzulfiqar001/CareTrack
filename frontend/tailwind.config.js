/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F33',
          deep: '#071827',
        },
        care: {
          blue: '#2563EB',
          teal: '#0F766E',
          'teal-light': '#CCFBF1',
          cream: '#F7F4EC',
        },
        ink: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
        },
        line: '#E2E8F0',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(11, 31, 51, 0.10)',
        card: '0 12px 40px rgba(11, 31, 51, 0.08)',
      },
      borderRadius: {
        card: '1.25rem',
        control: '0.875rem',
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
};
