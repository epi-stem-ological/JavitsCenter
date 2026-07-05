import React from 'react';

export interface RouteStepCardProps {
  /** "Take the escalator to Level 3" */
  instruction: string;
  /** "220 ft · 1 min" — omit for zero-length steps like Arrive. */
  meta?: string;
  icon?: React.ReactNode;
  /** Highlight for floor-transition steps (elevator/escalator/stairs). */
  isTransition?: boolean;
}

/** One step in a route preview list. */
export function RouteStepCard({ instruction, meta, icon, isTransition }: RouteStepCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--wf-space-3)',
        padding: 'var(--wf-space-4)',
        borderRadius: 'var(--wf-radius-md)',
        background: 'var(--wf-bg-raised)',
        border: isTransition ? '1px solid var(--wf-accent)' : '1px solid var(--wf-line)',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--wf-radius-sm)',
          background: isTransition ? 'var(--wf-accent)' : 'var(--wf-bg-sunken)',
          color: isTransition ? 'var(--wf-accent-on)' : 'var(--wf-fg-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon ?? '↑'}
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', font: 'var(--wf-type-body-large)', color: 'var(--wf-fg-primary)' }}>
          {instruction}
        </span>
        {meta ? (
          <span style={{ display: 'block', font: 'var(--wf-type-body)', color: 'var(--wf-fg-secondary)' }}>
            {meta}
          </span>
        ) : null}
      </span>
    </div>
  );
}
