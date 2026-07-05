import React from 'react';
import type { CategoryColorKey } from '../tokens';

export interface DestinationRowProps {
  name: string;
  /** e.g. "Hall · Level 3 · 3A" */
  meta: string;
  /** e.g. "450 ft · 3 min" — omit when origin unknown. */
  distanceLabel?: string;
  category?: CategoryColorKey;
  icon?: React.ReactNode;
  onClick?: () => void;
}

/** Search-result / list row. 72px minimum height for touch. */
export function DestinationRow({
  name,
  meta,
  distanceLabel,
  category = 'default',
  icon,
  onClick,
}: DestinationRowProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`${name}, ${meta}${distanceLabel ? `, ${distanceLabel}` : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--wf-space-3)',
        width: '100%',
        minHeight: 'var(--wf-touch-row)',
        padding: 'var(--wf-space-3) var(--wf-space-2)',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--wf-line)',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--wf-radius-sm)',
          background: `var(--wf-cat-${category}-bg)`,
          color: `var(--wf-cat-${category}-fg)`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon ?? '📍'}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'block',
            font: 'var(--wf-type-body-large)',
            color: 'var(--wf-fg-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </span>
        <span style={{ display: 'block', font: 'var(--wf-type-body)', color: 'var(--wf-fg-secondary)' }}>
          {meta}
          {distanceLabel ? ` · ${distanceLabel}` : ''}
        </span>
      </span>
      <span aria-hidden style={{ color: 'var(--wf-fg-tertiary)' }}>
        ›
      </span>
    </button>
  );
}
