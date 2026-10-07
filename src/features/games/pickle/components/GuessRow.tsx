'use client'

import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'
import { POS_LABEL } from '../domain/constants'
import type { GuessFeedback, PoolPlayer } from '../domain/types'
import { FlipCell } from './FlipCell'

export function GuessRow({ fb, target }: { fb: GuessFeedback; target: PoolPlayer }) {
  const isCorrect = fb.player.name.toLowerCase() === target.name.toLowerCase()
  return (
    <div className="space-y-1">
      <div
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
          isCorrect ? 'bg-green-700 border-green-600' : 'bg-[#0d1b2e] border-[var(--border)]'
        }`}
      >
        <div
          className="w-5 h-5 rounded flex items-center justify-center shrink-0 p-0.5"
          style={{ backgroundColor: TEAM_COLORS[fb.player.teamId] }}
        >
          <Image
            src={TEAM_LOGOS[fb.player.teamId]}
            alt=""
            width={14}
            height={14}
            className="object-contain w-full h-full"
          />
        </div>
        <span className="font-display font-800 text-sm uppercase text-white flex-1 leading-tight">
          {fb.player.name}
        </span>
        {isCorrect && <span className="text-green-300 font-bold shrink-0">✓</span>}
      </div>

      <div className="grid grid-cols-5 gap-1">
        <FlipCell hit={fb.team} delay={0}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center p-1 shrink-0"
            style={{ backgroundColor: TEAM_COLORS[fb.player.teamId] }}
          >
            <Image
              src={TEAM_LOGOS[fb.player.teamId]}
              alt=""
              width={20}
              height={20}
              className="object-contain w-full h-full"
            />
          </div>
          <span className="font-display font-700 text-[9px] uppercase text-white/70 text-center leading-none">
            {TEAM_NAMES[fb.player.teamId]}
          </span>
        </FlipCell>

        <FlipCell hit={fb.pos} delay={1}>
          <span className="font-display font-800 text-sm uppercase text-white">
            {fb.player.pos}
          </span>
          <span className="font-display font-700 text-[9px] uppercase text-white/60 text-center leading-none">
            {POS_LABEL[fb.player.pos]?.slice(0, 6) ?? fb.player.pos}
          </span>
        </FlipCell>

        <FlipCell hit={fb.bats} delay={2}>
          <span className="font-display font-700 text-[9px] uppercase text-white/60">Bats</span>
          <span className="font-display font-800 text-base uppercase text-white">
            {fb.player.bt[0]}
          </span>
        </FlipCell>

        <FlipCell hit={fb.throws} delay={3}>
          <span className="font-display font-700 text-[9px] uppercase text-white/60">Throws</span>
          <span className="font-display font-800 text-base uppercase text-white">
            {fb.player.bt.at(-1)}
          </span>
        </FlipCell>

        <FlipCell hit={fb.yob} delay={4} arrow={fb.yobDir ?? undefined}>
          <span className="font-display font-700 text-[9px] uppercase text-white/60">YOB</span>
          <span className="font-display font-800 text-sm uppercase text-white">
            {fb.player.yob}
          </span>
        </FlipCell>
      </div>
    </div>
  )
}
