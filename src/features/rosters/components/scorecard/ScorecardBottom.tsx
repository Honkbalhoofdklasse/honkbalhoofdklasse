export function scorecardBottom({
  teamColor,
  teamLogo,
  posLabel,
  firstName,
  lastName,
  statItems,
}: {
  teamColor: string
  teamLogo: string
  posLabel: string
  firstName: string
  lastName: string
  statItems: { label: string; value: string }[]
}) {
  return [
    /* ── Bottom light section with diagonal top edge ─────────── */
    /* The diagonal: left side lower, right side higher */
    <div
      key="light"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 285,
        background: '#f0ebe2',
        clipPath: 'polygon(0% 14%, 100% 0%, 100% 100%, 0% 100%)',
        display: 'flex',
      }}
    />,

    /* Bottom content */
    <div
      key="content"
      style={{
        position: 'absolute',
        bottom: 68,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '0 28px',
      }}
    >
      {/* Left: team logo + position */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={teamLogo} alt="" style={{ width: 72, height: 72, objectFit: 'contain' }} />
        <span
          style={{
            color: '#444',
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: 3,
            display: 'flex',
          }}
        >
          {posLabel.toUpperCase()}
        </span>
      </div>

      {/* Right: player name */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0 }}>
        {firstName && (
          <span
            style={{
              color: '#777',
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: 3,
              display: 'flex',
            }}
          >
            {firstName}
          </span>
        )}
        <span
          style={{
            color: '#0a0f1a',
            fontSize: 52,
            fontWeight: 900,
            lineHeight: '1',
            letterSpacing: -1,
            marginTop: -4,
            display: 'flex',
          }}
        >
          {lastName}
        </span>
      </div>
    </div>,

    /* ── Stats strip at very bottom ──────────────────────────── */
    <div
      key="stats"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        background: teamColor,
        height: 66,
      }}
    >
      {statItems.map((s, i) => (
        <div
          key={s.label}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: i < statItems.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
            gap: 2,
          }}
        >
          <span
            style={{
              color: 'white',
              fontSize: 22,
              fontWeight: 900,
              lineHeight: '1',
              display: 'flex',
            }}
          >
            {s.value}
          </span>
          <span
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2.5,
              display: 'flex',
            }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>,

    /* ── Card border ─────────────────────────────────────────── */
    <div
      key="border"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 28,
        border: '2px solid rgba(255,255,255,0.12)',
        display: 'flex',
        pointerEvents: 'none',
      }}
    />,
  ]
}
