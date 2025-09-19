import { tokens } from './pixel-grid-tokens.js';

export default {
  theme: {
    fontSize: {
      body: `${tokens.fontSizes.body}px`,
      h3: `${tokens.fontSizes.h3}px`,
      h2: `${tokens.fontSizes.h2}px`,
      h1: `${tokens.fontSizes.h1}px`
    },
    lineHeight: {
      body: tokens.lineHeights.body,
      small: tokens.lineHeights.small,
      h3: tokens.lineHeights.h3,
      h2: tokens.lineHeights.h2,
      h1: tokens.lineHeights.h1
    },
    spacing: {
      xxs: `${tokens.spacing.xxs}px`,
      xs: `${tokens.spacing.xs}px`,
      s: `${tokens.spacing.s}px`,
      m: `${tokens.spacing.m}px`,
      l: `${tokens.spacing.l}px`,
      xl: `${tokens.spacing.xl}px`,
      xxl: `${tokens.spacing.xxl}px`,
      xxxl: `${tokens.spacing.xxxl}px`
    },
    container: {
      center: true,
      padding: {
        DEFAULT: tokens.gutters.xs,
        sm: tokens.gutters.sm,
        md: tokens.gutters.md,
        lg: tokens.gutters.lg,
        xl: tokens.gutters.xl
      }
    }
  },
  corePlugins: {},
  plugins: []
};