
# 🌱 Plant Care Dashboard

**Never forget to water a plant again — and get guilt-tripped by it if you do.**

[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-DB-07405e?logo=sqlite&logoColor=white)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

Upload a photo of your plant, get its species identified and its care
info pulled up automatically, then track watering through a dashboard
where each plant has its own mood, streak, and personality.

Built as a hackathon project for **Frontend Development** (Inholland),
Weeks 1–4 (Next.js + TypeScript portion of the course).

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Project Artifacts](#-project-artifacts)
- [Team](#-team)
- [Course](#-course)

## ✨ Features

- 📸 **Photo identification** — upload a photo of your plant and the app auto-identifies the species
- 💧 **Care info lookup** — pulls up how often to water it and what light/climate it likes
- 🪴 **Mood-based dashboard cards** — healthy / needs water / overdue, based on days since last watered
- 🗣️ **Personality voice lines** — each plant guilt-trips or hypes you up depending on its mood, e.g. a dramatic fern going *"9 days. I've counted. I'm FINE."*
- ✅ **One-tap watering** — "Mark as watered" resets the countdown
- 🔥 **Streaks** — watering on time builds a streak per plant, gamifying the habit
- 🛟 **Graceful fallback** — if photo identification fails or is rate-limited, pick the plant from a preset list instead, so a live demo never breaks

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Database | [SQLite](https://sqlite.org/) |
| Plant ID | [Pl@ntNet API](https://my.plantnet.org/) |
| Data mutations | Next.js Server Actions (no separate API layer) |

## 📁 Project Structure

```
src/
  actions/
    plant/
      createPlant/createPlant.ts
      listPlants/listPlants.ts
      waterPlant/waterPlant.ts
      identifyPlant/identifyPlant.ts
  app/
    page.tsx
  components/
    pages/
      PlantDashboard/PlantDashboard.tsx
    PlantCard/PlantCard.tsx
    UploadForm/UploadForm.tsx
  lib/
    careData.ts
    plantVoice.ts
    moodLogic.ts
  prisma/
    schema.prisma
tests/
  actions/
  e2e/
specs/
  001-plant-dashboard/
    spec.md
    plan.md
AGENTS.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A free [Pl@ntNet API key](https://my.plantnet.org/)

### Installation

```bash
git clone <your-repo-url>
cd plant-care-dashboard
npm install
```

### Environment variables

Copy `.env.example` to `.env` and add your API key:

```bash
cp .env.example .env
```

```env
PLANTNET_API_KEY=your_key_here
DATABASE_URL="file:./dev.db"
```

### Database

```bash
npx prisma migrate dev --name init
```

### Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🌿

## 📄 Project Artifacts

This project follows the Spec-Driven Development workflow from the
course reading:

- [`specs/001-plant-dashboard/spec.md`](./specs/001-plant-dashboard/spec.md) — goal, constraints, acceptance criteria
- [`specs/001-plant-dashboard/plan.md`](./specs/001-plant-dashboard/plan.md) — technical approach and trade-offs

## 👥 Team

- Denisa Mitcu
- Rienat Zhuralov

## 🎓 Course

Frontend Development, Inholland — [course materials](https://github.com/danpaul/frontend_development_course)

---

<div align="center">
<sub>Built with 🌱 and mild plant-related guilt.</sub>
</div>
