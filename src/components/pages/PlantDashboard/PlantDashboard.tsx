"use client";

import { useState } from "react";
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

  async function handleCreatePlant(input: CreatePlantInput) {
    try {
      const created = await createPlant(input);
      setPlants((prev) => [coercePlantDates(created), ...prev]);
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
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
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
        <div className="rounded-2xl border border-emerald-100 bg-white/75 p-5 shadow-sm shadow-emerald-950/5">
          <p className="text-sm text-emerald-900/60">Plants in your garden</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-950">{plants.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-[#fffaf0]/85 p-5 shadow-sm shadow-amber-950/5">
          <p className="text-sm text-amber-900/65">Need attention</p>
          <p className="mt-2 text-3xl font-semibold text-amber-950">{overdueCount}</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-[#f3f9fb]/90 p-5 shadow-sm shadow-sky-950/5">
          <p className="text-sm text-sky-900/65">Watering streaks</p>
          <p className="mt-2 text-3xl font-semibold text-sky-950">{activeStreak}</p>
        </div>
      </section>

      <div className="mb-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-emerald-900/10" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-900/55">Add a new plant</h2>
        <div className="h-px flex-1 bg-emerald-900/10" />
      </div>
      <UploadForm
        identifyPlant={identifyPlant}
        onCreatePlant={handleCreatePlant}
        className="mb-6"
      />

      {plants.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-emerald-200 bg-white/50 px-6 py-12 text-center text-sm text-emerald-900/60">
          No plants yet. Add your first one above.
        </p>
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
    </main>
  );
}

export default PlantDashboard;
