# PLAN: Plant Care Dashboard

## Approach

**Stack**: Next.js (App Router) + TypeScript + Prisma + SQLite — this matches
the course's own stack from Week 1, so the team isn't learning new
infrastructure on top of the feature itself.

**Data model** (`prisma/schema.prisma`):
model Plant {
  id                Int      @id @default(autoincrement())
  name              String
  species           String?
  photoUrl          String?
  wateringFrequency Int      // days between waterings
  lightPreference   String
  lastWateredAt     DateTime @default(now())
  streak            Int      @default(0)
  createdAt         DateTime @default(now())
}

**Architecture pattern**: follows the course code repo's convention —
Next.js Server Actions (not API routes). `src/app/page.tsx` calls a
`listPlants` server action directly and passes data + actions as props
into a client page component, the same way the Todoish example wires
`createTodo`/`updateTodo`/`deleteTodo` into `TodoPage`.

**Photo upload + identification flow**:
1. User uploads a photo via a form (`<input type="file">`) in `UploadForm`.
2. The `identifyPlant` server action sends the image to the Pl@ntNet API
   (free tier, identification-focused — better suited to "what species is
   this" than Perenual/Trefle, which are plant-database lookups rather
   than image classifiers).
3. Pl@ntNet returns a best-guess species name + confidence score.
4. That species name is matched against a small **curated local JSON
   dataset** (`src/lib/careData.ts`) of ~15-20 common houseplants with
   watering frequency + light preference, rather than calling a second
   live API. This is simpler, avoids matching two different naming
   conventions across APIs, and keeps the demo safe from a second point
   of API failure.
5. If the species isn't in the curated dataset, or the Pl@ntNet call
   fails/rate-limits, `identifyPlant` returns a "no match" result and
   `UploadForm` shows a preset dropdown of the same ~15-20 plants to pick
   manually — satisfying the spec's graceful-degradation requirement with
   the same dataset, no extra code path.

**Mood + streak logic**: computed client-side (or in a small utility
function) from `lastWateredAt` and `wateringFrequency`:
- `daysSince / wateringFrequency < 0.7` → healthy
- `0.7–1.0` → needs water soon
- `> 1.0` → overdue

Marking "watered today" updates `lastWateredAt`, and increments `streak`
if the plant was watered on time (before it went overdue), otherwise
resets `streak` to 0.

**Personality voice lines**: rule-based, `src/lib/plantVoice.ts` — a
function that takes `{ mood, daysSince }` and returns one of a few
pre-written lines per mood state per plant "personality type" (e.g.
dramatic, chill, sarcastic — a fun small touch: let the user pick a
personality when adding a plant).

## Trade-Offs

- **Pl@ntNet for ID, curated JSON for care info** (rather than one API
  for both): no single free API reliably does both image ID and detailed
  care specs well. Splitting them is more resilient for a live demo, at
  the cost of only supporting ~15-20 pre-researched plant types. Fine for
  a hackathon — can be expanded later.
- **SQLite + Prisma over localStorage**: slightly more setup, but it's
  the stack the course is teaching, so the team gets double value from
  the time spent, and it avoids the browser-storage limitations of a
  pure client-side approach.
- **Rule-based voice lines over LLM-generated**: keeps the app fully
  functional with zero external LLM cost or latency during the demo.
  Stretch goal only, as stated in the spec.
- **No auth**: single implicit "household" of plants, no user table.
  Simplest possible scope that still satisfies the spec.

## Files Affected
- `prisma/schema.prisma` — Plant model
- `src/lib/careData.ts` — curated plant care dataset (~15-20 entries)
- `src/lib/plantVoice.ts` — personality voice-line generator
- `src/lib/moodLogic.ts` — mood + streak calculation helpers
- `src/actions/plant/listPlants/listPlants.ts` — server action, reads all plants
- `src/actions/plant/createPlant/createPlant.ts` — server action, adds a new plant
- `src/actions/plant/waterPlant/waterPlant.ts` — server action, marks watered + updates streak
- `src/actions/plant/identifyPlant/identifyPlant.ts` — server action, calls Pl@ntNet + fallback
- `src/components/UploadForm/UploadForm.tsx` — photo upload + preset fallback dropdown
- `src/components/PlantCard/PlantCard.tsx` — mood, progress bar, voice line, streak
- `src/components/pages/PlantDashboard/PlantDashboard.tsx` — client page: stats row + plant card grid
- `src/app/page.tsx` — root route, loads plants via `listPlants`, renders `PlantDashboard`
- `AGENTS.md` — project rules file (conventions, stack, constraints) for future agent sessions

## Sequencing
1. **Database**: Prisma schema + migration (unblocks all backend work)
2. **Care dataset**: write `careData.ts` with the ~15-20 curated plants
3. **Server actions**: `listPlants`, `createPlant`, `waterPlant`
4. **Identification**: `identifyPlant` server action calling Pl@ntNet, with
   preset-dropdown fallback built in from the start (not bolted on later)
5. **Mood/streak logic**: `moodLogic.ts`, unit-testable in isolation
6. **Voice lines**: `plantVoice.ts`
7. **Frontend**: `UploadForm` → `PlantCard` → `PlantDashboard` → wired into
   `app/page.tsx`, following the same props-passing pattern as `TodoPage`
8. **Polish pass**: responsive check, demo run-through, fallback testing
   (deliberately trigger the identify-fail path to confirm it degrades cleanly)