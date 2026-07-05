import React from 'react';

export interface FloorOption {
  id: string;
  /** Short label shown in the control, e.g. "L3". */
  label: string;
  /** Full name for the accessible label, e.g. "Level 3 — Halls 3A–3E". */
  name: string;
}

export interface FloorSelectorProps {
  floors: FloorOption[];
  activeFloorId: string;
  onSelect: (floorId: string) => void;
}

/** Vertical floor switcher overlaid on the map. Top = highest level. */
export function FloorSelector({ floors, activeFloorId, onSelect }: FloorSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Floor"
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 2,
        padding: 4,
        borderRadius: 'var(--wf-radius-md)',
        background: 'var(--wf-bg-base)',
        border: '1px solid var(--wf-line)',
        boxShadow: 'var(--wf-elevation-1)',
      }}
    >
      {floors.map((f) => {
        const active = f.id === activeFloorId;
        return (
          <button
            key={f.id}
            role="radio"
            aria-checked={active}
            aria-label={f.name}
            onClick={() => onSelect(f.id)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--wf-radius-sm)',
              border: 'none',
              cursor: 'pointer',
              font: 'var(--wf-type-label)',
              background: active ? 'var(--wf-accent)' : 'transparent',
              color: active ? 'var(--wf-accent-on)' : 'var(--wf-fg-secondary)',
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
