# Hoofdklasse Franchise 0.7.0 — release checks

## Player-facing changes

- New career → Create your club: eighth team, seeded fictional squad, 25 active
  players and three farm prospects; name, city, abbreviation, colours and emblem.
  Initial test squad averaged 63.28 OVR versus 68.68–74.63 for existing clubs.
- All simulation modes open the calendar. Current day, elapsed days, processed
  games and today's fixture progress are visible; Stop and tab navigation pause.
- Team → Front Office adds contracts, roles, trust, releases, playing style,
  incoming CPU trades and club decisions. Releasing a farm player frees a slot;
  settlement fees and safeguards are shown before confirmation.
- Four-round offseason: contract competition, free agents, retirements, optional
  automation and salary budgets. CPU clubs recruit and trade proactively.
- League → Club Story: club records, rivalries, career milestones and retired
  players/Hall of Fame. Existing player career statistics are retained.

Existing careers receive the new optional management systems without resetting
progress. Adding the eighth club is a new-career option. The eight-club calendar
has 42 regular-season games; seven-club careers retain their original format.
Contract terms, ambitions and synthetic players are game-generated, not real
employment data. Event variety currently comprises four recurring event types.

## Validation

- 5,476 simulation assertions; 173 UI actions; 53 growth/migration regressions.
- 152 expansion, release, contracts, role, CPU market, events and two-season checks.
- Release Wasm action test: creator, release, calendar switching, progression and stop.
- Chrome, Firefox and WebKit: custom text/emblem, release, reload, style,
  automation, club story, calendar progression/stop and offseason controls.
- Isolated account mock: eight-club raw cloud save/reload and conflict protection.
- API checks: legacy/expansion saves, malformed metadata, raw UInt64 and gzip limits.
- Supabase migration applied 2026-10-02. Transaction-only test passed for seven/eight
  clubs, raw integer preservation, stale revision, invalid badge and cross-account
  access. Test accounts and saves rolled back; no real career overwritten.
- Next.js production build passed. Screenshots inspected for club creation,
  Front Office, release agreement and running calendar.

Release engine: 55,401,547 bytes raw,
19,593,790 bytes gzip; SHA-256 `0468add34f864193f8bf7679487de724fec0c64c5db1a8c7783c92e7f2cbfbdb`.

Detailed logs: local `work/web-parity/070-*`.
