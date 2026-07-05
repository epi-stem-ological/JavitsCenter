import React from 'react';
import type { CategoryColorKey } from '../tokens';

export interface BadgeProps {
  children: React.ReactNode;
  /** Tint with a category pair; default is neutral. */
  category?: CategoryColorKey;
}

/** Compact metadata chip: floor labels ("Level 3 · Hall 3A"), codes, statuses. */
export function Badge({ children, category }: BadgeProps) {
  const bg = category ? `var(--wf-cat-${category}-bg)` : 'var(--wf-bg-raised)';
  const fg = category ? `var(--wf-cat-${category}-fg)` : 'var(--wf-fg-secondary)';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: 'var(--wf-space-1) var(--wf-space-2)',
        borderRadius: 'var(--wf-radius-sm)',
        background: bg,
        color: fg,
        border: category ? 'none' : '1px solid var(--wf-line)',
        font: 'var(--wf-type-label)',
      }}
    >
      {children}
    </span>
  );
}
