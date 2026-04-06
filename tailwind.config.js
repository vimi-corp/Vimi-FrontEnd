/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // ── Brand palette ────────────────────────────────────────────────────
      colors: {
        // Canva signature
        canva: {
          purple:       '#8B3DFF',
          'purple-mid': '#7B2FEF',
          'purple-dark':'#6020C8',
          'purple-pale':'#F0E8FF',
          cyan:         '#00C4CC',
          'cyan-mid':   '#00AAAF',
          'cyan-pale':  '#E0FAFB',
          pink:         '#FF6B9D',
          'pink-pale':  '#FFF0F6',
          coral:        '#FF7043',
          yellow:       '#FFCD3C',
        },

        // Shopify-inspired neutral surface system
        surface: {
          page:    '#F3F5F7',   // outermost page bg
          card:    '#FFFFFF',   // card / panel bg
          raised:  '#FFFFFF',   // elevated surfaces
          overlay: '#F8F9FA',   // subtle inset bg
          border:  '#E8ECF0',   // default divider
          hover:   '#F0F2F5',   // hover state bg
        },

        // Ink system (replaces pure black)
        ink: {
          DEFAULT: '#1A1D23',   // headings
          body:    '#3D4451',   // body text
          muted:   '#6B7280',   // secondary text
          subtle:  '#9CA3AF',   // hints / placeholder
          ghost:   '#D1D5DB',   // disabled
        },

        // Semantic
        success: {
          DEFAULT: '#00C48C',
          light:   '#E6FAF5',
          dark:    '#009E72',
        },
        warning: {
          DEFAULT: '#FFB020',
          light:   '#FFF8E6',
          dark:    '#CC8C00',
        },
        danger: {
          DEFAULT: '#FF4D4F',
          light:   '#FFF0F0',
          dark:    '#CC2D2F',
        },
        info: {
          DEFAULT: '#3B82F6',
          light:   '#EFF6FF',
          dark:    '#1D4ED8',
        },
      },

      // ── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        // Display: used for headings and the welcome banner
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        // Body: clean, legible
        sans:    ['"DM Sans"', 'sans-serif'],
        // Mono: code snippets
        mono:    ['"JetBrains Mono"', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem',  { lineHeight: '1rem' }],
        xs:    ['0.75rem',   { lineHeight: '1.125rem' }],
        sm:    ['0.8125rem', { lineHeight: '1.25rem' }],
        base:  ['0.9375rem', { lineHeight: '1.5rem' }],
        lg:    ['1.0625rem', { lineHeight: '1.625rem' }],
        xl:    ['1.1875rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.375rem',  { lineHeight: '2rem' }],
        '3xl': ['1.75rem',   { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem',   { lineHeight: '2.75rem' }],
        '5xl': ['2.875rem',  { lineHeight: '3.5rem' }],
        '6xl': ['3.625rem',  { lineHeight: '4.25rem' }],
      },

      // ── Spacing ──────────────────────────────────────────────────────────
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '68':  '17rem',
        '72':  '18rem',
        '76':  '19rem',
        '80':  '20rem',
      },

      // ── Shadows ───────────────────────────────────────────────────────────
      boxShadow: {
        // Card resting state
        card:   '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        // Card hover state
        'card-hover': '0 8px 24px -4px rgba(0,0,0,0.10), 0 2px 8px -2px rgba(0,0,0,0.06)',
        // Modal / popover
        modal:  '0 20px 60px -10px rgba(0,0,0,0.18), 0 8px 24px -8px rgba(0,0,0,0.10)',
        // Canva purple glow
        'purple-glow': '0 8px 32px -4px rgba(139,61,255,0.35)',
        'cyan-glow':   '0 8px 32px -4px rgba(0,196,204,0.30)',
        // Inner ring for focus
        focus: '0 0 0 3px rgba(139,61,255,0.25)',
      },

      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        '2xl':  '1rem',
        '3xl':  '1.5rem',
        '4xl':  '2rem',
      },

      // ── Gradients ─────────────────────────────────────────────────────────
      backgroundImage: {
        // Welcome banner — Canva signature
        'canva-gradient':
          'linear-gradient(135deg, #8B3DFF 0%, #5B1FBF 30%, #00C4CC 100%)',
        // Sidebar header accent
        'sidebar-gradient':
          'linear-gradient(160deg, #1A0533 0%, #2D0A5C 60%, #0A2940 100%)',
        // Subtle card hover tint
        'purple-soft':
          'linear-gradient(135deg, #F0E8FF 0%, #E8F9FA 100%)',
        // Button primary
        'btn-primary':
          'linear-gradient(135deg, #8B3DFF 0%, #6B20EF 100%)',
        'btn-primary-hover':
          'linear-gradient(135deg, #7B2FEF 0%, #5B10DF 100%)',
        // Upgrade CTA
        'upgrade-gradient':
          'linear-gradient(135deg, #FF6B9D 0%, #8B3DFF 60%, #00C4CC 100%)',
      },

      // ── Animations ────────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-fast': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        pulse_soft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in':       'fade-in 0.4s ease-out both',
        'fade-in-fast':  'fade-in-fast 0.2s ease-out both',
        'fade-in-slow':  'fade-in 0.6s ease-out both',
        'slide-in-left': 'slide-in-left 0.35s ease-out both',
        shimmer:         'shimmer 2.2s linear infinite',
        'pulse-soft':    'pulse_soft 2.5s ease-in-out infinite',
        float:           'float 3s ease-in-out infinite',
        'scale-in':      'scale-in 0.25s ease-out both',
      },
    },
  },

  plugins: [],
};
