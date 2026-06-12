// Tailwind CSS preset — design-tokens layer
// Maps CSS Custom Properties (semantic tokens) to Tailwind utility classes.
// Because Tailwind uses var() references, changing a CSS variable at runtime
// automatically updates every class that references it — no CSS rebuild needed.
//
// Usage in tailwind.config.js:
//   presets: [require('./packages/design-tokens/src/lib/tailwind.preset')]

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      // ─── Colors ─────────────────────────────────────────────────────────
      // Nested objects produce hyphenated classes: bg-primary, bg-primary-hover,
      // bg-surface-elevated, text-text-muted, border-border-focus, etc.
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover:   'var(--color-primary-hover)',
          active:  'var(--color-primary-active)',
          subtle:  'var(--color-primary-subtle)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover:   'var(--color-secondary-hover)',
        },
        surface: {
          DEFAULT:  'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          overlay:  'var(--color-surface-overlay)',
        },
        // "text" as a color group — used as bg-text, text-text, border-text.
        // For text color utilities the typical usage is text-text or text-text-muted.
        text: {
          DEFAULT:  'var(--color-text)',
          muted:    'var(--color-text-muted)',
          disabled: 'var(--color-text-disabled)',
          inverse:  'var(--color-text-inverse)',
          link:     'var(--color-text-link)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong:  'var(--color-border-strong)',
          focus:   'var(--color-border-focus)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          surface: 'var(--color-error-surface)',
          border:  'var(--color-error-border)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          surface: 'var(--color-success-surface)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          surface: 'var(--color-warning-surface)',
        },
      },

      // ─── Typography ──────────────────────────────────────────────────────
      // font-sans uses --font-body, which resolves to --font-sans (Inter).
      // Tailwind's default font-sans is overridden so all prose uses the token.
      fontFamily: {
        sans:    ['var(--font-body)'],
        heading: ['var(--font-heading)'],
        mono:    ['var(--font-mono)'],
      },

      // Semantic text-size aliases alongside Tailwind's built-in scale.
      // text-heading-lg, text-body, text-label, etc.
      fontSize: {
        'heading-lg': ['var(--text-heading-lg)', { lineHeight: 'var(--leading-tight)' }],
        'heading-md': ['var(--text-heading-md)', { lineHeight: 'var(--leading-snug)' }],
        'heading-sm': ['var(--text-heading-sm)', { lineHeight: 'var(--leading-snug)' }],
        body:         ['var(--text-body)',        { lineHeight: 'var(--leading-normal)' }],
        label:        ['var(--text-label)',       { lineHeight: 'var(--leading-normal)' }],
        caption:      ['var(--text-caption)',     { lineHeight: 'var(--leading-normal)' }],
      },

      // ─── Border radius ───────────────────────────────────────────────────
      // Overrides Tailwind's default scale so radius-md is the project token value.
      borderRadius: {
        none: 'var(--radius-none)',
        sm:   'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },

      // ─── Spacing ─────────────────────────────────────────────────────────
      // Adds semantic spacing aliases on top of Tailwind's numeric scale.
      spacing: {
        section:    'var(--space-section)',
        component:  'var(--space-component)',
        element:    'var(--space-element)',
        inset:      'var(--space-inset)',
        'inset-sm': 'var(--space-inset-sm)',
        'inset-lg': 'var(--space-inset-lg)',
      },

      // ─── Shadows ─────────────────────────────────────────────────────────
      boxShadow: {
        card:    'var(--shadow-card)',
        panel:   'var(--shadow-panel)',
        popover: 'var(--shadow-popover)',
      },

      // ─── Transitions ─────────────────────────────────────────────────────
      transitionDuration: {
        fast:   'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow:   'var(--duration-slow)',
      },
      transitionTimingFunction: {
        DEFAULT: 'var(--ease-default)',
        'ease-in':  'var(--ease-in)',
        'ease-out': 'var(--ease-out)',
      },
    },
  },
};
