import { GRADE_SCORE, POS_LABEL } from './config'
import { armGrade, fmt3, offGrade } from './sim'
import type { Data, Grade, Sim } from './types'

export function buildResultSummary(s: Sim, data: Data) {
  const outcome = s.champion
    ? '🏆 Holland Series Champions!'
    : s.final
      ? `Lost the Holland Series ${s.final.a}-${s.final.b}`
      : s.semi
        ? `Out in the playoffs ${s.semi.a}-${s.semi.b}`
        : `Missed the playoffs at ${s.wins}-${s.losses}`
  const offG = offGrade(s.lineupOps / data.leagueOps)
  const rotG = armGrade(s.spEra, data.leagueEra)
  const bulG = armGrade(s.rpEra, data.leagueEra)
  const units: { key: string; g: Grade }[] = [
    { key: 'offense', g: offG },
    { key: 'rotation', g: rotG },
    { key: 'bullpen', g: bulG },
  ]
  const worst = units.reduce((a, b) => (GRADE_SCORE[b.g] < GRADE_SCORE[a.g] ? b : a))
  const best = units.reduce((a, b) => (GRADE_SCORE[b.g] > GRADE_SCORE[a.g] ? b : a))
  const report = s.champion
    ? `Balanced enough to go all the way. Your ${best.key} led the charge.`
    : !s.madePlayoffs
      ? `${s.cutoff - s.wins} win${s.cutoff - s.wins === 1 ? '' : 's'} short of the playoff line. Your ${worst.key} was the biggest gap.`
      : GRADE_SCORE[worst.g] <= 1
        ? worst.key === 'offense'
          ? `Your bats held you back, with ${POS_LABEL[s.weakBat.pos]} (${s.weakBat.name}, ${fmt3(s.weakBat.ops)} OPS) the soft spot.`
          : worst.key === 'rotation'
            ? `Your rotation gave up too much at ${s.spEra.toFixed(2)} ERA. Stronger starters get you further.`
            : `A leaky bullpen (${s.rpEra.toFixed(2)} ERA) cost you in the tight games.`
        : `Strong all around. The ${s.final ? 'Holland Series' : 'playoff'} opponent was just elite, and short series are a coin flip.`
  return { outcome, offG, rotG, bulG, report }
}
