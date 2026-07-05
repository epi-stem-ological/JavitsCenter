import React from 'react';

export interface SearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onValueChange: (v: string) => void;
}

/** Search-first entry point. "Where are you headed?" */
export function SearchField({ value, onValueChange, placeholder, ...rest }: SearchFieldProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--wf-space-2)',
        height: 'var(--wf-touch-cta)',
        padding: '0 var(--wf-space-3)',
        borderRadius: 'var(--wf-radius-md)',
        background: 'var(--wf-bg-raised)',
        border: '1px solid var(--wf-line)',
      }}
    >
      <SearchGlyph />
      <input
        type="search"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder ?? 'Search booths, rooms, services, food, and amenities'}
        aria-label="Search"
        {...rest}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: 'var(--wf-fg-primary)',
          font: 'var(--wf-type-body-large)',
        }}
      />
      {value ? (
        <button
          onClick={() => onValueChange('')}
          aria-label="Clear search"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--wf-fg-tertiary)' }}
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

function SearchGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="var(--wf-fg-tertiary)" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="var(--wf-fg-tertiary)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
