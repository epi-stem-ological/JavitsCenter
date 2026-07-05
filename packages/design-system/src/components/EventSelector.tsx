import React from 'react';

export interface EventSelectorProps {
  /** "NRF 2027 (sample)" */
  eventName: string;
  onClick?: () => void;
}

/**
 * Event-context pill: "Currently viewing: NRF 2027". Tapping opens the
 * event switcher. Always visible when an event-specific map layer is active.
 */
export function EventSelector({ eventName, onClick }: EventSelectorProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Currently viewing ${eventName}. Change event.`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--wf-space-2)',
        height: 36,
        padding: '0 var(--wf-space-4)',
        borderRadius: 'var(--wf-radius-pill)',
        background: 'var(--wf-bg-base)',
        border: '1px solid var(--wf-line)',
        boxShadow: 'var(--wf-elevation-1)',
        cursor: 'pointer',
        font: 'var(--wf-type-label)',
        color: 'var(--wf-fg-primary)',
      }}
    >
      <span
        aria-hidden
        style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--wf-success)' }}
      />
      Viewing: {eventName}
      <span aria-hidden style={{ color: 'var(--wf-fg-tertiary)' }}>
        ▾
      </span>
    </button>
  );
}
