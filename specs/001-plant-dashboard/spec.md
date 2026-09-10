# SPEC: Plant Care Dashboard

## Goal
Let a user upload a photo of a plant they own, automatically identify the
plant and pull its basic care needs (watering frequency, light/climate
preference), then track ongoing watering with a personality-driven
dashboard: each plant has a mood, a watering streak, and a short
in-character "voice" line that nudges the user when it needs water.

The core user problem this solves: people forget to water plants and
don't always know how often a specific plant actually needs it. The fun
twist (mood + voice + streaks) is what makes it memorable for a hackathon
demo, not just a lookup tool.

## Context
- Built with Next.js + TypeScript (course-mandated stack for the hackathon).
- Team of 2-3, ~3-4 hours/week, demo in Week 4. Scope must fit that budget.
- No existing codebase — this is a greenfield hackathon project.
- Plant identification and care-info lookup will use a third-party plant
  API (e.g. Perenual or Trefle — final choice made during Plan phase,
  based on free-tier limits and data quality).

## Constraints
- Must run as a single Next.js app (frontend + API routes), no separate backend service.
- Use a free-tier plant-ID/care API only — no paid API keys required to run the demo.
- Photo upload can be stored locally/in-memory or via a free storage tier
  (e.g. Vercel Blob or Supabase free tier) — no cost-incurring infrastructure.
- No user authentication required for the hackathon version — single-user,
  local/session-based plant list is acceptable.
- Personality "voice" lines can be rule-based (simple conditional text
  templates keyed on days-since-watered) rather than LLM-generated, to
  keep cost and complexity down. Using an LLM for extra flair is a stretch
  goal, not a requirement.
- Must be demoable offline-safe: if the plant-ID API fails or is rate-limited
  during the live demo, the app must degrade gracefully (e.g. let the user
  manually pick a plant type from a preset list) rather than break.

## Acceptance Criteria
- [ ] User can upload a photo of a plant via the dashboard.
- [ ] After upload, the app identifies the plant species (or lets the user
      confirm/correct a suggested match) and displays its name.
- [ ] The app shows care info for the identified plant: recommended
      watering frequency (e.g. "every 7 days") and light/climate preference
      (e.g. "bright indirect light").
- [ ] Each plant on the dashboard shows: name, a mood indicator (healthy /
      needs water soon / overdue), a watering progress bar based on days
      since last watered vs. its recommended frequency, and a short
      personality "voice" line that changes based on mood.
- [ ] User can mark a plant as "watered today," which resets its progress
      bar and updates its mood.
- [ ] The app tracks and displays a watering streak (consecutive on-time
      waterings) per plant.
- [ ] If the plant-ID API call fails, the user can manually select a plant
      type from a small preset list and the rest of the flow still works.
- [ ] Dashboard is responsive and demoable on a laptop screen without
      layout breakage.

## Non-Goals
- User accounts / multi-user support — out of scope for this version.
- Push notifications or reminders outside the app (e.g. email, SMS).
- Historical watering charts/analytics beyond the current streak count.
- Editing/removing care-info data manually (accept whatever the API/preset returns).
- Mobile app — web only, responsive is enough.

## Follow-on work (post-hackathon, not required for demo)
- LLM-generated personality voice lines instead of rule-based templates.
- Multi-plant photo recognition from a single image.
- Shared/roommate view where multiple people can water the same plant.