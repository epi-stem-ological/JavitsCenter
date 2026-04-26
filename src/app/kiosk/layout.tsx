/**
 * Kiosk mode — large-touch UI, no bottom nav. Shares the design system.
 * Mount on a Javits lobby kiosk tablet in portrait orientation.
 */
export default function KioskLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-javits-black text-javits-white">{children}</div>;
}
