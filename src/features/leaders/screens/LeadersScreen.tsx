import { getMonthData } from '../api/monthData'
import { getSeasonLeaders } from '../api/seasonLeaders'
import { getLatestSeriesWeek, getSerieData } from '../api/serieData'
import { MONTH_NAMES } from '../domain/format'
import { getAvailableMonths } from '../domain/months'
import LeadersTabs from './LeadersTabs'

export default async function LeadersScreen() {
  const seasonPromise = getSeasonLeaders()
  const monthPromise = getMonthData()
  const seriesWeek = await getLatestSeriesWeek()
  const now = new Date()
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`

  const availableMonths = getAvailableMonths()
  const [season, week, month] = await Promise.all([
    seasonPromise,
    seriesWeek ? getSerieData(seriesWeek) : Promise.resolve(null),
    monthPromise,
  ])
  const seriesLabel = seriesWeek ? 'This Series' : null

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div>
        <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-1">
          Season 2026
        </p>
        <h1 className="font-display font-800 italic text-5xl uppercase tracking-tight text-white">
          <strong>League</strong>
          <span className="text-[var(--accent)]"> Leaders</span>
        </h1>
        <p className="text-[var(--muted)] text-sm mt-3 max-w-xl leading-relaxed">
          Statistical leaders for the Honkbal Hoofdklasse 2026 season. Rankings cover batting
          average, home runs, RBI, stolen bases, ERA, strikeouts and more — sourced from the KNBSB
          stats system (stats.knbsbstats.nl).
        </p>
      </div>
      <LeadersTabs
        week={week}
        season={season}
        seriesLabel={seriesLabel}
        month={month}
        monthLabel={monthLabel}
        availableMonths={availableMonths}
      />
    </div>
  )
}
