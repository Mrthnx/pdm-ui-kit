import { PdmButtonVariant, PdmButtonState } from './button.component';

export const BUTTON_TONE_MAP: Record<PdmButtonVariant, Record<PdmButtonState, string>> = {
  default: {
    default: 'border-primary bg-primary text-primary-foreground',
    hover: 'border-primary bg-primary text-primary-foreground opacity-90',
  },
  primary: {
    default: 'border-primary bg-primary text-primary-foreground',
    hover: 'border-primary bg-primary text-primary-foreground opacity-90',
  },
  destructive: {
    default: 'border-border bg-destructive text-destructive-foreground',
    hover: 'border-border bg-destructive text-destructive-foreground opacity-90',
  },
  outline: {
    default: 'border-border bg-background text-foreground',
    hover: 'border-border bg-muted text-foreground',
  },
  subtle: {
    default: 'border-secondary bg-secondary text-secondary-foreground',
    hover: 'border-accent bg-accent text-accent-foreground',
  },
  secondary: {
    default: 'border-secondary bg-secondary text-secondary-foreground',
    hover: 'border-accent bg-accent text-accent-foreground',
  },
  ghost: {
    default: 'border-border bg-transparent text-foreground',
    hover: 'border-border bg-accent text-accent-foreground',
  },
  link: {
    default: 'border-border bg-transparent text-primary',
    hover: 'border-border bg-transparent text-primary underline underline-offset-4',
  },
  'with-icon': {
    default: 'border-primary bg-primary text-primary-foreground',
    hover: 'border-primary bg-primary text-primary-foreground opacity-90',
  },
  icon: {
    default: 'border-border bg-background text-foreground',
    hover: 'border-border bg-accent text-accent-foreground',
  },
  'icon-circle': {
    default: 'border-border bg-background text-foreground',
    hover: 'border-border bg-accent text-accent-foreground',
  },
  rounded: {
    default: 'border-border bg-background text-foreground',
    hover: 'border-border bg-accent text-accent-foreground',
  },
  loading: {
    default: 'border-primary bg-primary text-primary-foreground opacity-70',
    hover: 'border-primary bg-primary text-primary-foreground opacity-70',
  },
} as const;
