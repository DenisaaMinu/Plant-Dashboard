"use client";

import { useEffect, useState } from "react";
import type { Plant } from "@/generated/prisma/browser";
import type { CreatePlantInput } from "@/actions/plant/helpers";
import type { IdentifyPlantResult } from "@/actions/plant/identifyPlant/identifyPlant";
import type { UpdatePlantInput } from "@/actions/plant/updatePlant/updatePlant";
import type { WaterPlantResult } from "@/actions/plant/waterPlant/waterPlant";
import { PlantCard } from "@/components/organisms/PlantCard/PlantCard";
import { UploadForm } from "@/components/organisms/UploadForm/UploadForm";
import { getMood } from "@/lib/moodLogic";

function coercePlantDates(plant: Plant): Plant {
  return {
    ...plant,
    lastWateredAt: plant.lastWateredAt
      ? new Date(plant.lastWateredAt)
      : null,
    createdAt: new Date(plant.createdAt),
  };
}

type PlantDashboardProps = {
  initialPlants: Plant[];
  createPlant: (input: CreatePlantInput) => Promise<Plant>;
  waterPlant: (id: number) => Promise<WaterPlantResult>;
  identifyPlant: (formData: FormData) => Promise<IdentifyPlantResult>;
  updatePlant: (id: number, input: UpdatePlantInput) => Promise<Plant>;
  deletePlant: (id: number) => Promise<{ id: number }>;
};

export function PlantDashboard({
  initialPlants,
  createPlant,
  waterPlant,
  identifyPlant,
  updatePlant,
  deletePlant,
}: PlantDashboardProps) {
  const [plants, setPlants] = useState(() =>
    initialPlants.map(coercePlantDates),
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const overdueCount = plants.filter(
    (plant) =>
      getMood(
        plant.lastWateredAt
          ? Math.floor((Date.now() - plant.lastWateredAt.getTime()) / 86400000)
          : 0,
        plant.wateringFrequency,
      ) === "overdue",
  ).length;
  const activeStreak = plants.reduce(
    (total, plant) => total + plant.streak,
    0,
  );
  const gardenXp = plants.reduce(
    (total, plant) => total + 20 + plant.streak * 10,
    0,
  );
  const gardenLevel = Math.max(1, Math.floor(gardenXp / 100) + 1);
  const levelProgress = gardenXp % 100;
  const thrivingCount = plants.filter(
    (plant) =>
      getMood(
        plant.lastWateredAt
          ? Math.floor((Date.now() - plant.lastWateredAt.getTime()) / 86400000)
          : 0,
        plant.wateringFrequency,
      ) !== "overdue",
  ).length;
  const questProgress = plants.length
    ? Math.round((thrivingCount / plants.length) * 100)
    : 0;

  useEffect(() => {
    if (!isAddOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsAddOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isAddOpen]);

  async function handleCreatePlant(input: CreatePlantInput) {
    try {
      const created = await createPlant(input);
      setPlants((prev) => [coercePlantDates(created), ...prev]);
      setIsAddOpen(false);
      setError(null);
    } catch (err) {
      setError("Something went wrong. Try again.");
      throw err;
    }
  }

  async function handleWaterPlant(id: number): Promise<WaterPlantResult> {
    try {
      const result = await waterPlant(id);
      if (result.status === "watered") {
        setPlants((prev) =>
          prev.map((plant) =>
            plant.id === id ? coercePlantDates(result.plant) : plant,
          ),
        );
      }
      setError(null);
      return result;
    } catch (err) {
      setError("Something went wrong. Try again.");
      throw err;
    }
  }

  async function handleUpdatePlant(id: number, input: UpdatePlantInput) {
    try {
      const updated = await updatePlant(id, input);
      setPlants((prev) =>
        prev.map((plant) =>
          plant.id === id ? coercePlantDates(updated) : plant,
        ),
      );
      setError(null);
    } catch (err) {
      setError("Something went wrong. Try again.");
      throw err;
    }
  }

  async function handleDeletePlant(id: number) {
    try {
      await deletePlant(id);
      setPlants((prev) => prev.filter((plant) => plant.id !== id));
      setError(null);
    } catch (err) {
      setError("Something went wrong. Try again.");
      throw err;
    }
  }

  return (
    <main className="garden-shell mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
      <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Your little indoor garden
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-emerald-950 sm:text-5xl">
            Plant Care Dashboard
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-emerald-900/65">
            Keep every leafy friend watered, thriving, and just dramatic enough.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-emerald-900/65">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)]" />
          Garden is looking after {plants.length} {plants.length === 1 ? "plant" : "plants"}
        </div>
      </header>

      {error ? (
        <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="stat-card rounded-2xl border border-emerald-100 bg-white/75 p-5 shadow-sm shadow-emerald-950/5">
          <p className="text-sm text-emerald-900/60">Plants in your garden</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-950">{plants.length}</p>
        </div>
        <div className="stat-card rounded-2xl border border-amber-100 bg-[#fffaf0]/85 p-5 shadow-sm shadow-amber-950/5">
          <p className="text-sm text-amber-900/65">Need attention</p>
          <p className="mt-2 text-3xl font-semibold text-amber-950">{overdueCount}</p>
        </div>
        <div className="stat-card rounded-2xl border border-sky-100 bg-[#f3f9fb]/90 p-5 shadow-sm shadow-sky-950/5">
          <p className="text-sm text-sky-900/65">Watering streaks</p>
          <p className="mt-2 text-3xl font-semibold text-sky-950">{activeStreak}</p>
        </div>
      </section>

      <section className="quest-panel mb-10 overflow-hidden rounded-[28px] border border-emerald-200/80 bg-[#123d2c] p-5 text-white shadow-[0_18px_50px_rgba(18,61,44,0.18)] sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="level-orb flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#f5c969] text-emerald-950 shadow-lg shadow-black/10">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]">Level</span>
              <span className="text-2xl font-black leading-none">{gardenLevel}</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f5c969]">Garden quest</p>
              <h2 className="mt-1 text-2xl font-semibold">Keep the canopy thriving</h2>
              <p className="mt-1 text-sm text-emerald-100/75">
                {thrivingCount} of {plants.length || 1} plants are on track today.
              </p>
            </div>
          </div>
          <div className="min-w-0 lg:w-72">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-emerald-100/75">
              <span>Next level</span>
              <span>{levelProgress}/100 XP</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[#f5c969] transition-[width] duration-700" style={{ width: `${levelProgress || (plants.length ? 8 : 0)}%` }} />
            </div>
            <p className="mt-2 text-right text-xs text-emerald-100/60">Today&apos;s quest: {questProgress}% complete</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <span className={`badge-pill ${plants.length > 0 ? "badge-pill-earned" : ""}`}>🌱 First sprout</span>
          <span className={`badge-pill ${activeStreak >= 7 ? "badge-pill-earned" : ""}`}>🔥 7-day flame</span>
          <span className={`badge-pill ${plants.length >= 3 ? "badge-pill-earned" : ""}`}>🌿 Mini jungle</span>
          <span className={`badge-pill ${plants.length > 0 && overdueCount === 0 ? "badge-pill-earned" : ""}`}>✨ Happy habitat</span>
        </div>
      </section>

      {plants.length > 0 ? (
        <section className="mb-7 rounded-2xl border border-dashed border-emerald-200 bg-white/55 px-4 py-3 shadow-sm shadow-emerald-950/5 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-950">Want to grow your collection?</p>
              <p className="mt-1 text-xs text-emerald-900/60">Add another leafy friend and give it a personality.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              aria-expanded={isAddOpen}
              className="shrink-0 rounded-xl bg-[#d97745] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c56638]"
            >
              + Add plant
            </button>
          </div>
        </section>
      ) : null}

      {plants.length === 0 ? (
        <section className="mb-10">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-emerald-900/10" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-900/55">Start your garden</h2>
            <div className="h-px flex-1 bg-emerald-900/10" />
          </div>
          <UploadForm
            identifyPlant={identifyPlant}
            onCreatePlant={handleCreatePlant}
          />
        </section>
      ) : (
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Your collection</p>
              <h2 className="mt-1 text-2xl font-semibold text-emerald-950">Growing well</h2>
            </div>
            <p className="text-sm text-emerald-900/55">{plants.length} {plants.length === 1 ? "plant" : "plants"}</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onWater={handleWaterPlant}
              onUpdate={handleUpdatePlant}
              onDelete={handleDeletePlant}
            />
          ))}
          </div>
        </section>
      )}

      {isAddOpen && plants.length > 0 ? (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsAddOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-emerald-950/45 p-4 backdrop-blur-sm sm:p-6"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-plant-title"
            className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-[#f5f7f2] p-4 shadow-2xl shadow-emerald-950/30 sm:max-h-[calc(100vh-3rem)] sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-4 px-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">New garden friend</p>
                <h2 id="add-plant-title" className="mt-1 text-2xl font-semibold text-emerald-950">Add a plant</h2>
                <p className="mt-1 text-sm text-emerald-900/60">Give your new leafy friend a name and a care plan.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                aria-label="Close add plant dialog"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-200 text-xl text-emerald-900 transition hover:bg-emerald-100"
              >
                &times;
              </button>
            </div>
            <UploadForm
              identifyPlant={identifyPlant}
              onCreatePlant={handleCreatePlant}
            />
          </section>
        </div>
      ) : null}
    </main>
  );
}

export default PlantDashboard;
