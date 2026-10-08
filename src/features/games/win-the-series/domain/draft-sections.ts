import { FIELD_SECTIONS, RP_KEYS, SP_KEYS } from './config'
import { isPitcher } from './sim'
import type { DraftSection, Filled, HSHitter, HSPitcher } from './types'

export function buildDraftSections(
  roster: (HSHitter | HSPitcher)[],
  filled: Filled,
): DraftSection[] {
  const sortH = (a: HSHitter, b: HSHitter) => b.opsAdj - a.opsAdj

  const sections: DraftSection[] = []
  for (const sec of FIELD_SECTIONS) {
    const players = roster
      .filter((p) => !isPitcher(p) && (p as HSHitter).positions.includes(sec.pos))
      .sort((a, b) => sortH(a as HSHitter, b as HSHitter))
    if (players.length) sections.push({ title: sec.title, slotFilled: !!filled[sec.pos], players })
  }
  if (!filled['DH']) {
    const dh = roster
      .filter((p) => !isPitcher(p))
      .sort((a, b) => sortH(a as HSHitter, b as HSHitter))
    if (dh.length)
      sections.push({
        title: 'Designated Hitter',
        slotFilled: false,
        players: dh,
        directSlot: 'DH',
      })
  }
  const sp = roster
    .filter(isPitcher)
    .filter((p) => p.role === 'SP')
    .sort((a, b) => a.eraAdj - b.eraAdj)
  const rp = roster
    .filter(isPitcher)
    .filter((p) => p.role === 'RP')
    .sort((a, b) => a.eraAdj - b.eraAdj)
  if (sp.length)
    sections.push({
      title: 'Starting Pitchers',
      slotFilled: SP_KEYS.every((k) => filled[k]),
      players: sp,
    })
  if (rp.length)
    sections.push({
      title: 'Relievers',
      slotFilled: RP_KEYS.every((k) => filled[k]),
      players: rp,
    })
  return sections
}
