export function scorecardBackground({
  photoUrl,
  teamColor,
  teamLogo,
  blob2,
}: {
  photoUrl: string | null
  teamColor: string
  teamLogo: string
  blob2: string
}) {
  return [
    photoUrl ? (
      <img
        key="photo"
        src={photoUrl}
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '74%',
          objectFit: 'cover',
          objectPosition: 'top center',
        }}
      />
    ) : (
      <div
        key="photo"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '74%',
          background: `linear-gradient(150deg, ${teamColor} 0%, #040b16 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={teamLogo}
          alt=""
          style={{ width: 200, height: 200, opacity: 0.2, objectFit: 'contain' }}
        />
      </div>
    ),

    <div
      key="blob1"
      style={{
        position: 'absolute',
        top: -50,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: teamColor,
        opacity: 0.95,
        display: 'flex',
      }}
    />,
    <div
      key="blob2"
      style={{
        position: 'absolute',
        top: 40,
        left: 55,
        width: 140,
        height: 140,
        borderRadius: '50%',
        background: blob2,
        opacity: 0.9,
        display: 'flex',
      }}
    />,

    <div
      key="gradient"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 130,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)',
        display: 'flex',
      }}
    />,
  ]
}
