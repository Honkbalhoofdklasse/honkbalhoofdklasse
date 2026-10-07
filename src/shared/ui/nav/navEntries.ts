export type NavItem = { href: string; label: string; external?: boolean }
export type NavLink = { type: 'link'; href: string; label: string; highlight?: boolean }
export type NavGroup = { type: 'dropdown'; label: string; items: NavItem[] }
export type NavEntry = NavLink | NavGroup

export function useNavEntries(): NavEntry[] {
  return [
    { type: 'link', href: '/postseason', label: 'Postseason', highlight: true },
    { type: 'link', href: '/livescores', label: 'Scores' },
    { type: 'link', href: '/schema', label: 'Schedule' },
    { type: 'link', href: '/uitslagen', label: 'Results' },
    { type: 'link', href: '/stand', label: 'Standings' },
    {
      type: 'dropdown',
      label: 'Stats',
      items: [
        { href: '/leaders', label: 'Leaders' },
        { href: '/teams', label: 'Teams' },
        { href: '/rosters', label: 'Rosters' },
        { href: '/compare', label: 'Compare' },
        { href: '/awards', label: 'Awards' },
      ],
    },
    {
      type: 'dropdown',
      label: 'Play',
      items: [
        { href: '/franchise', label: 'Franchise' },
        { href: '/win-the-series', label: 'Win the Series' },
        { href: '/pick-em', label: "Pick 'em" },
        { href: '/pickle', label: 'Pickle' },
        { href: '/immaculate-grid', label: 'Immaculate Grid' },
        { href: '/higher-lower', label: 'Higher Lower' },
      ],
    },
    {
      type: 'dropdown',
      label: 'Media',
      items: [
        { href: 'https://honkbalsoftbal.nl/?cat=544', label: 'News', external: true },
        { href: '/livestream', label: 'Livestream' },
        { href: '/social', label: 'Social' },
        { href: '/partner-up', label: 'Partner Up' },
      ],
    },
  ]
}
