/**
 * Path to the design-tokens SCSS entry point, relative to the workspace root.
 * Add this to an Angular app's `styles` array or to Storybook's `styles` config.
 *
 * @example
 * // angular.json / project.json
 * "styles": [DESIGN_TOKENS_SCSS, "src/styles.scss"]
 */
export const DESIGN_TOKENS_SCSS = 'packages/design-tokens/src/lib/index.scss';

/**
 * CSS Custom Property names for primitive tokens.
 * Use these constants instead of hardcoded strings to catch typos at compile time.
 */
export const COLOR = {
  GREEN_50:  '--color-green-50',
  GREEN_100: '--color-green-100',
  GREEN_200: '--color-green-200',
  GREEN_300: '--color-green-300',
  GREEN_400: '--color-green-400',
  GREEN_500: '--color-green-500',
  GREEN_600: '--color-green-600',
  GREEN_700: '--color-green-700',
  GREEN_800: '--color-green-800',
  GREEN_900: '--color-green-900',
  NEUTRAL_50:  '--color-neutral-50',
  NEUTRAL_100: '--color-neutral-100',
  NEUTRAL_200: '--color-neutral-200',
  NEUTRAL_300: '--color-neutral-300',
  NEUTRAL_400: '--color-neutral-400',
  NEUTRAL_500: '--color-neutral-500',
  NEUTRAL_600: '--color-neutral-600',
  NEUTRAL_700: '--color-neutral-700',
  NEUTRAL_800: '--color-neutral-800',
  NEUTRAL_900: '--color-neutral-900',
  NEUTRAL_950: '--color-neutral-950',
  WHITE: '--color-white',
  BLACK: '--color-black',
} as const;

export const SPACING = {
  SPACE_0:  '--space-0',
  SPACE_1:  '--space-1',
  SPACE_2:  '--space-2',
  SPACE_3:  '--space-3',
  SPACE_4:  '--space-4',
  SPACE_5:  '--space-5',
  SPACE_6:  '--space-6',
  SPACE_8:  '--space-8',
  SPACE_10: '--space-10',
  SPACE_12: '--space-12',
  SPACE_16: '--space-16',
  SPACE_20: '--space-20',
  SPACE_24: '--space-24',
} as const;

export const RADIUS = {
  NONE: '--radius-none',
  SM:   '--radius-sm',
  MD:   '--radius-md',
  LG:   '--radius-lg',
  XL:   '--radius-xl',
  FULL: '--radius-full',
} as const;

export const FONT = {
  HEADING: '--font-heading',
  SANS:    '--font-sans',
  MONO:    '--font-mono',
} as const;

/**
 * CSS Custom Property names for semantic tokens.
 * These are the tokens components should use — never reference COLOR.GREEN_* directly.
 */
export const SEMANTIC_COLOR = {
  PRIMARY:          '--color-primary',
  PRIMARY_HOVER:    '--color-primary-hover',
  PRIMARY_ACTIVE:   '--color-primary-active',
  PRIMARY_SUBTLE:   '--color-primary-subtle',
  SECONDARY:        '--color-secondary',
  SECONDARY_HOVER:  '--color-secondary-hover',
  SURFACE:          '--color-surface',
  SURFACE_ELEVATED: '--color-surface-elevated',
  SURFACE_OVERLAY:  '--color-surface-overlay',
  ON_PRIMARY:       '--color-on-primary',
  ON_SECONDARY:     '--color-on-secondary',
  TEXT:             '--color-text',
  TEXT_MUTED:       '--color-text-muted',
  TEXT_DISABLED:    '--color-text-disabled',
  TEXT_INVERSE:     '--color-text-inverse',
  TEXT_LINK:        '--color-text-link',
  BORDER:           '--color-border',
  BORDER_STRONG:    '--color-border-strong',
  BORDER_FOCUS:     '--color-border-focus',
  ERROR:            '--color-error',
  ERROR_SURFACE:    '--color-error-surface',
  SUCCESS:          '--color-success',
  SUCCESS_SURFACE:  '--color-success-surface',
  WARNING:          '--color-warning',
  WARNING_SURFACE:  '--color-warning-surface',
} as const;

export const SEMANTIC_TEXT = {
  HEADING_LG: '--text-heading-lg',
  HEADING_MD: '--text-heading-md',
  HEADING_SM: '--text-heading-sm',
  BODY:       '--text-body',
  LABEL:      '--text-label',
  CAPTION:    '--text-caption',
} as const;

export const SEMANTIC_SPACING = {
  SECTION:    '--space-section',
  COMPONENT:  '--space-component',
  ELEMENT:    '--space-element',
  INSET:      '--space-inset',
  INSET_SM:   '--space-inset-sm',
  INSET_LG:   '--space-inset-lg',
} as const;

/**
 * CSS Custom Property names for component tokens.
 * Override these on the component host to restyle without touching internals.
 */
export const BUTTON_TOKENS = {
  BG:          '--button-bg',
  BG_HOVER:    '--button-bg-hover',
  BG_ACTIVE:   '--button-bg-active',
  BG_DISABLED: '--button-bg-disabled',
  COLOR:           '--button-color',
  COLOR_DISABLED:  '--button-color-disabled',
  RADIUS:          '--button-radius',
  PADDING_X:       '--button-padding-x',
  PADDING_Y:       '--button-padding-y',
  PADDING_X_SM:    '--button-padding-x-sm',
  PADDING_Y_SM:    '--button-padding-y-sm',
  PADDING_X_LG:    '--button-padding-x-lg',
  PADDING_Y_LG:    '--button-padding-y-lg',
  BORDER_COLOR:    '--button-border-color',
  TRANSITION:      '--button-transition',
} as const;

export const PRODUCT_CARD_TOKENS = {
  BG:           '--product-card-bg',
  RADIUS:       '--product-card-radius',
  SHADOW:       '--product-card-shadow',
  BORDER_COLOR: '--product-card-border-color',
  PADDING:      '--product-card-padding',
} as const;

export const CART_COUNTER_TOKENS = {
  BG:     '--cart-counter-bg',
  COLOR:  '--cart-counter-color',
  SIZE:   '--cart-counter-size',
  RADIUS: '--cart-counter-radius',
} as const;

export const MINI_CART_TOKENS = {
  BG:      '--mini-cart-bg',
  BORDER:  '--mini-cart-border',
  WIDTH:   '--mini-cart-width',
  SHADOW:  '--mini-cart-shadow',
  RADIUS:  '--mini-cart-radius',
  PADDING: '--mini-cart-padding',
} as const;

export const VARIANT_OPTION_TOKENS = {
  BG:              '--variant-option-bg',
  BG_SELECTED:     '--variant-option-bg-selected',
  BORDER_COLOR:    '--variant-option-border-color',
  BORDER_SELECTED: '--variant-option-border-selected',
  COLOR:           '--variant-option-color',
  COLOR_SELECTED:  '--variant-option-color-selected',
  RADIUS:          '--variant-option-radius',
} as const;
