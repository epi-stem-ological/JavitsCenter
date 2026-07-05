import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/** Primary action button. One primary per view; 52px min touch target. */
export function Button({
  variant = 'primary',
  size = 'lg',
  fullWidth,
  style,
  children,
  ...rest
}: ButtonProps) {
  const colors: Record<ButtonVariant, React.CSSProperties> = {
    primary: { background: 'var(--wf-accent)', color: 'var(--wf-accent-on)', border: 'none' },
    secondary: {
      background: 'var(--wf-bg-raised)',
      color: 'var(--wf-fg-primary)',
      border: '1px solid var(--wf-line)',
    },
    ghost: { background: 'transparent', color: 'var(--wf-fg-primary)', border: 'none' },
    danger: { background: 'var(--wf-danger)', color: '#fff', border: 'none' },
  };
  return (
    <button
      {...rest}
      style={{
        minHeight: size === 'lg' ? 'var(--wf-touch-cta)' : 44,
        padding: '0 var(--wf-space-5)',
        borderRadius: 'var(--wf-radius-md)',
        font: size === 'lg' ? 'var(--wf-type-heading)' : 'var(--wf-type-body)',
        cursor: 'pointer',
        width: fullWidth ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--wf-space-2)',
        ...colors[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
