export async function getNewPlayers(
  teamId: string,
): Promise<{ name: string; pos: string; uniform: string; bt: string; yob: number }[]> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://honkbalhoofdklasse.com'
    const res = await fetch(`${base}/api/roster-supplement/${teamId}`, { cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}
