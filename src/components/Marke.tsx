// Nätverkets märke: en båge som förenar en blå punkt (Aktiespararna) och en
// grön (Unga Aktiesparare). Färgerna kommer från CSS-variablerna i temat.
export function Marke({ storlek = 32, id = "marke" }: { storlek?: number; id?: string }) {
  return (
    <svg
      width={storlek}
      height={(storlek * 28) / 48}
      viewBox="0 0 48 28"
      aria-hidden="true"
      className="marke"
    >
      <defs>
        <linearGradient id={`${id}-bage`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--bla, #185da9)" />
          <stop offset="0.55" stopColor="var(--turkos, #159eda)" />
          <stop offset="1" stopColor="var(--gron, #46b278)" />
        </linearGradient>
      </defs>
      <path d="M6 23 A18 18 0 0 1 42 23" fill="none" stroke={`url(#${id}-bage)`} strokeWidth="5" strokeLinecap="round" />
      <circle cx="6" cy="23" r="4.5" fill="var(--bla, #185da9)" />
      <circle cx="42" cy="23" r="4.5" fill="var(--gron, #46b278)" />
    </svg>
  );
}
