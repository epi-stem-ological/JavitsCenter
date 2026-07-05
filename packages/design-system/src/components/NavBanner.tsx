import React from 'react';

export interface NavBannerProps {
  /** "In 220 ft" or "Now" */
  distanceLabel: string;
  /** "Take the escalator ahead, then continue on Level 3" */
  instruction: string;
  /** Maneuver glyph slot (arrow, elevator, escalator…). */
  icon?: React.ReactNode;
}

/**
 * Top-anchored turn-by-turn banner. High contrast, readable while walking.
 * Announce instruction changes via a live region.
 */
export function NavBanner({ distanceLabel, instruction, icon }: NavBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--wf-space-3)',
        padding: 'var(--wf-space-4)',
        borderRadius: 'var(--wf-radius-md)',
        background: 'var(--wf-fg-primary)',
        color: 'var(--wf-bg-base)',
        boxShadow: 'var(--wf-elevation-3)',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--wf-radius-md)',
          background: 'var(--wf-accent)',
          color: 'var(--wf-accent-on)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          flexShrink: 0,
        }}
      >
        {icon ?? '↑'}
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', font: 'var(--wf-type-nav-step)' }}>{distanceLabel}</span>
        <span style={{ display: 'block', font: 'var(--wf-type-body-large)' }}>{instruction}</span>
      </span>
    </div>
  );
}
