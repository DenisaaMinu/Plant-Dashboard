"use client";

import { useState } from "react";
import type { Plant } from "@/generated/prisma/browser";
import {
  getDaysSince,
  getMood,
  getWateringProgress,
  type PlantMood,
} from "@/lib/moodLogic";
import { getVoiceLine } from "@/lib/plantVoice";

const MOOD_STYLES: Record<PlantMood, string> = {
  healthy: "border-green-400 bg-green-50",
  needsWaterSoon: "border-yellow-400 bg-yellow-50",
  overdue: "border-red-400 bg-red-50",
};

const MOOD_LABELS: Record<PlantMood, string> = {
  healthy: "Healthy",
  needsWaterSoon: "Needs water soon",
  overdue: "Overdue",
};

type PlantCardProps = {
  plant: Plant;
  onWater: (id: number) => Promise<void>;
  className?: string;
};

export function PlantCard({ plant, onWater, className }: PlantCardProps) {
  const [isWatering, setIsWatering] = useState(false);

  const daysSince = getDaysSince(plant.lastWateredAt);
  const mood = getMood(daysSince, plant.wateringFrequency);
  const progress = getWateringProgress(daysSince, plant.wateringFrequency);
  const voiceLine = getVoiceLine(plant.personality, mood, daysSince);

  async function handleWaterClick() {
    setIsWatering(true);
    try {
      await onWater(plant.id);
    } catch {
      // Failure is surfaced by the parent's alert; nothing more to do here.
    } finally {
      setIsWatering(false);
    }
  }

  return (
    <article
      className={`rounded-lg border-2 p-4 ${MOOD_STYLES[mood]} ${className ?? ""}`.trim()}
    >
      {plant.photoUrl ? (
        <img
          src={plant.photoUrl}
          alt={plant.name}
          className="mb-3 h-32 w-full rounded object-cover"
        />
      ) : null}

      <h3 className="text-lg font-semibold">{plant.name}</h3>
      {plant.species ? (
        <p className="text-sm text-gray-600">{plant.species}</p>
      ) : null}

      <p className="mt-2 text-sm font-medium">{MOOD_LABELS[mood]}</p>

      <progress
        value={progress}
        max={1}
        aria-label={`Watering progress for ${plant.name}`}
        className="my-2 h-2 w-full"
      />

      <p className="text-sm">{plant.lightPreference}</p>
      <p className="text-sm">🔥 {plant.streak}-day streak</p>
      <p className="mt-2 text-sm italic">&ldquo;{voiceLine}&rdquo;</p>

      <button
        type="button"
        onClick={handleWaterClick}
        disabled={isWatering}
        aria-disabled={isWatering}
        className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {isWatering ? "Watering..." : "Mark as watered"}
      </button>
    </article>
  );
}

export default PlantCard;
