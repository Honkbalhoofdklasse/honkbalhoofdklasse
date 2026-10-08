'use client'

import type { HSSeries } from '@/features/postseason/api/holland-series'
import { type CardState, stateOf } from '@/features/postseason/domain/cardState'
import { BracketCard } from '@/features/postseason/components/BracketCard'
import { Connector } from '@/features/postseason/components/Connector'

export function SemiColumn({
  s,
  side,
  seeds,
  setOpenSeries,
}: {
  s: HSSeries | undefined
  side: 'left' | 'right'
  seeds: Record<string, number>
  setOpenSeries: (s: HSSeries) => void
}) {
  const top = s ? s.teamB : null,
    bottom = s ? s.teamA : null
  const topState = stateOf(s, top),
    botState = stateOf(s, bottom)
  const outState: CardState = s?.clinchedBy ? 'win' : 'neutral'
  const cards = (
    <div className="flex flex-col justify-between h-40 sm:h-52 flex-1 min-w-0">
      <div className="h-[42%]">
        <BracketCard
          teamId={top}
          seed={top ? seeds[top] : undefined}
          wins={s?.winsB}
          showWins={!!s}
          state={topState}
          onClick={s ? () => setOpenSeries(s) : undefined}
        />
      </div>
      <div className="h-[42%]">
        <BracketCard
          teamId={bottom}
          seed={bottom ? seeds[bottom] : undefined}
          wins={s?.winsA}
          showWins={!!s}
          state={botState}
          onClick={s ? () => setOpenSeries(s) : undefined}
        />
      </div>
    </div>
  )
  const conn = <Connector side={side} top={topState} bot={botState} out={outState} />
  return side === 'left' ? (
    <div className="flex items-stretch flex-1 min-w-0 max-w-[180px]">
      {cards}
      {conn}
    </div>
  ) : (
    <div className="flex items-stretch flex-1 min-w-0 max-w-[180px]">
      {conn}
      {cards}
    </div>
  )
}
