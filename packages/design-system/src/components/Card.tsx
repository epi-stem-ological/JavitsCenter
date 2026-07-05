import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  elevated?: boolean;
}

/** Raised surface for grouped content. Flat by default; elevated for sheets. */
export function Card({ padded = true, elevated, style, children, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      style={{
        background: 'var(--wf-bg-raised)',
        border: '1px solid var(--wf-line)',
        borderRadius: 'var(--wf-radius-md)',
        padding: padded ? 'var(--wf-space-4)' : 0,
        boxShadow: elevated ? 'var(--wf-elevation-2)' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
