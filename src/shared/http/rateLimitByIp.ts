const lastSeenByIp = new Map<string, number>()

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export function isRateLimited(ip: string, windowMs: number, now = Date.now()): boolean {
  const lastSeen = lastSeenByIp.get(ip)
  if (lastSeen !== undefined && now - lastSeen < windowMs) return true
  lastSeenByIp.set(ip, now)
  for (const [key, seen] of lastSeenByIp) {
    if (now - seen >= windowMs) lastSeenByIp.delete(key)
  }
  return false
}
