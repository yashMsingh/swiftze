/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red':        '#EF4444',
        'brand-red-light':  '#F87171',
        'bg-page':          '#F4F4F5',
        'bg-card':          '#F4F4F5',
        'bg-white':         '#FFFFFF',
        'bg-placeholder':   '#E4E4E7',
        'text-primary':     '#111827',
        'text-secondary':   '#6B7280',
        'text-muted':       '#9CA3AF',
        'border-default':   '#E5E7EB',
        'star-gold':        '#FBBF24',
        'online-dot':       '#22C55E',
        'overlay-backdrop': 'rgba(0,0,0,0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card':   '16px',
        'modal':  '20px',
        'pill':   '999px',
      },
      width: {
        'sidebar': '266px',
      },
    },
  },
  plugins: [],
}
