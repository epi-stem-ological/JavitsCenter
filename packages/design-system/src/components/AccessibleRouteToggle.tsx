import React from 'react';

export interface AccessibleRouteToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * First-class accessibility control: prefers elevators, avoids stairs and
 * escalators. Persisted per user; honored across reroutes.
 */
export function AccessibleRouteToggle({ checked, onChange }: AccessibleRouteToggleProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--wf-space-3)',
        minHeight: 'var(--wf-touch-cta)',
        padding: 'var(--wf-space-3) var(--wf-space-4)',
        borderRadius: 'var(--wf-radius-md)',
        background: 'var(--wf-bg-raised)',
        border: '1px solid var(--wf-line)',
        cursor: 'pointer',
      }}
    >
      <span>
        <span style={{ display: 'block', font: 'var(--wf-type-body-large)', color: 'var(--wf-fg-primary)' }}>
          Accessible route
        </span>
        <span style={{ display: 'block', font: 'var(--wf-type-body)', color: 'var(--wf-fg-secondary)' }}>
          Uses elevators, avoids stairs
        </span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 28, height: 28, accentColor: 'var(--wf-accent)' }}
      />
    </label>
  );
}
