// Normal CDF approximation (Abramowitz & Stegun)
export function normalCDF(z: number): number {
  const sign = z < 0 ? -1 : 1
  const x = Math.abs(z) / Math.SQRT2
  const t = 1 / (1 + 0.3275911 * x)
  const poly =
    t *
    (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))))
  const erf = 1 - poly * Math.exp(-x * x)
  return 0.5 * (1 + sign * erf)
}

// Win probability given run differential and innings remaining
// σ = 1.5 runs/inning (slightly higher for semi-pro like Hoofdklasse)
export function winProb(runDiff: number, inningsRemaining: number): number {
  if (inningsRemaining <= 0) {
    return runDiff > 0 ? 1 : runDiff < 0 ? 0 : 0.5
  }
  const sigma = 1.5
  const z = runDiff / (sigma * Math.sqrt(inningsRemaining))
  return normalCDF(z)
}

export type WinProbPoint = { label: string; homeProb: number }
