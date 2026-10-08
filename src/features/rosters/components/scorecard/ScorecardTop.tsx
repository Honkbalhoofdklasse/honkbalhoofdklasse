export function scorecardTop({ rating }: { rating: number | null }) {
  return [
    <div
      key="branding"
      style={{
        position: 'absolute',
        top: 22,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.93)',
          borderRadius: 100,
          padding: '7px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <img
          src="https://res.cloudinary.com/dn8c5398m/image/upload/q_auto/f_auto/v1781607525/hk_logo_iets_groter_tumykq.png"
          alt=""
          style={{ width: 24, height: 24, objectFit: 'contain' }}
        />
        <span style={{ color: '#080f1c', fontSize: 13, fontWeight: 800, letterSpacing: 2 }}>
          HONKBAL HOOFDKLASSE
        </span>
      </div>
    </div>,

    rating !== null && (
      <div
        key="rating"
        style={{
          position: 'absolute',
          top: 16,
          right: 20,
          width: 68,
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 54,
            height: 54,
            background: 'linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #60a5fa 100%)',
            transform: 'rotate(45deg)',
            borderRadius: 8,
            display: 'flex',
            boxShadow: '0 4px 20px rgba(129,140,248,0.5)',
          }}
        />
        <span
          style={{
            position: 'relative',
            zIndex: 1,
            color: 'white',
            fontSize: 24,
            fontWeight: 900,
            display: 'flex',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          {rating}
        </span>
      </div>
    ),
  ]
}
