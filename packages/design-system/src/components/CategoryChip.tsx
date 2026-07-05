import React from 'react';
import type { CategoryColorKey } from '../tokens';

export interface CategoryChipProps {
  label: string;
  category: CategoryColorKey;
  icon?: React.ReactNode;
  onClick?: () => void;
}

/** Home-screen quick-access tile (Map, Food, Restrooms, Accessibility…). */
export function CategoryChip({ label, category, icon, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        minWidth: 80,
        minHeight: 80,
        padding: 'var(--wf-space-3)',
        borderRadius: 'var(--wf-radius-md)',
        background: `var(--wf-cat-${category}-bg)`,
        color: `var(--wf-cat-${category}-fg)`,
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--wf-space-1)',
        font: 'var(--wf-type-label)',
      }}
    >
      {icon ? <span aria-hidden style={{ fontSize: 24 }}>{icon}</span> : null}
      {label}
    </button>
  );
}
