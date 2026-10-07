export const MAX_SAVE_BYTES = 16_000_000
export function validateSaveEnvelope(body: unknown, slot: number) {
  if (!Number.isInteger(slot) || slot < 1 || slot > 3 || !body || typeof body !== 'object')
    return false
  const b = body as Record<string, unknown>
  if (
    typeof b.payload !== 'string' ||
    new TextEncoder().encode(b.payload).length > MAX_SAVE_BYTES ||
    !Number.isSafeInteger(b.revision) ||
    (b.revision as number) < 0 ||
    b.engineVersion !== '0.6.1' ||
    b.formatVersion !== 1
  )
    return false
  try {
    // Read metadata only. The original string is stored unchanged, never stringify(career).
    const career = JSON.parse(b.payload)
    const custom = career.customClub
    const clean = (s: unknown, max: number) =>
      typeof s === 'string' &&
      s.trim().length > 0 &&
      Array.from(s).length <= max &&
      !/[\x00-\x1f\x7f|]/.test(s)
    const validCustom =
      !!custom &&
      clean(custom.name, 28) &&
      clean(custom.city, 24) &&
      clean(custom.abbr, 4) &&
      Array.from(custom.abbr).length >= 2 &&
      /^[0-9a-f]{6}$/i.test(custom.color) &&
      /^[0-9a-f]{6}$/i.test(custom.secondary) &&
      Number.isInteger(custom.badge) &&
      custom.badge >= 0 &&
      custom.badge <= 2
    const validClubs =
      Array.isArray(career.clubs) &&
      ((career.clubs.length === 7 && custom == null) ||
        (career.clubs.length === 8 && validCustom && career.user === 7 && career.draft === false))
    return (
      validClubs &&
      career.slot === slot &&
      Number.isInteger(career.year) &&
      career.year >= 2026 &&
      Number.isInteger(career.user) &&
      career.user >= 0 &&
      career.user < career.clubs.length &&
      Number.isInteger(career.day) &&
      Array.isArray(career.players) &&
      career.players.length > 0 &&
      career.players.length < 2000 &&
      Array.isArray(career.schedule) &&
      career.schedule.length < 5000
    )
  } catch {
    return false
  }
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  return !!origin && origin === new URL(request.url).origin
}
