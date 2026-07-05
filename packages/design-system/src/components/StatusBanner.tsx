import React from 'react';

export type StatusTone = 'info' | 'success' | 'warning' | 'danger';

export interface StatusBannerProps {
  tone: StatusTone;
  /** "Location signal is weak indoors." */
  title: string;
  /** "Start from a QR marker or choose your current entrance." */
  detail?: string;
  /** Optional action slot ("Scan QR code", "Choose entrance"). */
  action?: React.ReactNode;
}

/**
 * Non-blocking state banner: location weak/unavailable, rerouting,
 * offline mode, destination closed. Calm, never alarmist.
 */
export function StatusBanner({ tone, title, detail, action }: StatusBannerProps) {
  const toneColor: Record<StatusTone, string> = {
    info: 'var(--wf-accent)',
    success: 'var(--wf-success)',
    warning: 'var(--wf-warning)',
    danger: 'var(--wf-danger)',
  };
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--wf-space-3)',
        padding: 'var(--wf-space-4)',
        borderRadius: 'var(--wf-radius-md)',
        background: 'var(--wf-bg-raised)',
        borderLeft: `4px solid ${toneColor[tone]}`,
        border: '1px solid var(--wf-line)',
        borderLeftWidth: 4,
        borderLeftColor: toneColor[tone],
      }}
    >
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', font: 'var(--wf-type-heading)', color: 'var(--wf-fg-primary)' }}>
          {title}
        </span>
        {detail ? (
          <span style={{ display: 'block', font: 'var(--wf-type-body)', color: 'var(--wf-fg-secondary)', marginTop: 4 }}>
            {detail}
          </span>
        ) : null}
        {action ? <span style={{ display: 'block', marginTop: 'var(--wf-space-3)' }}>{action}</span> : null}
      </span>
    </div>
  );
}
