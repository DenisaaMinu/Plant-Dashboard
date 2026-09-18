"use client";

import { useEffect, useState } from "react";
import type { Plant } from "@/generated/prisma/browser";
import type { UpdatePlantInput } from "@/actions/plant/updatePlant/updatePlant";
import type { WaterPlantResult } from "@/actions/plant/waterPlant/waterPlant";
import { PLANT_PERSONALITIES } from "@/lib/plantVoice";
import {
  getDaysSince,
  getMood,
  getWateringProgress,
  type PlantMood,
} from "@/lib/moodLogic";
import { getVoiceLine } from "@/lib/plantVoice";

const MOOD_STYLES: Record<PlantMood, string> = {
  healthy: "border-emerald-100 bg-white",
  needsWaterSoon: "border-amber-200 bg-[#fffaf0]",
  overdue: "border-rose-200 bg-[#fff7f5]",
};

const MOOD_LABELS: Record<PlantMood, string> = {
  healthy: "Healthy",
  needsWaterSoon: "Needs water soon",
  overdue: "Overdue",
};

type PlantCardProps = {
  plant: Plant;
  onWater: (id: number) => Promise<WaterPlantResult>;
  onUpdate: (id: number, input: UpdatePlantInput) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  className?: string;
};

export function PlantCard({
  plant,
  onWater,
  onUpdate,
  onDelete,
  className,
}: PlantCardProps) {
  const [isWatering, setIsWatering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editName, setEditName] = useState(plant.name);
  const [editPersonality, setEditPersonality] = useState(plant.personality);
  const [waterMessage, setWaterMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const daysSince = getDaysSince(plant.lastWateredAt, now);
  const mood = getMood(daysSince, plant.wateringFrequency);
  const progress = getWateringProgress(daysSince, plant.wateringFrequency);
  const voiceLine = getVoiceLine(plant.personality, mood, daysSince);

  async function handleWaterClick() {
    setIsWatering(true);
    setWaterMessage(null);
    try {
      const result = await onWater(plant.id);
      if (result.status === "already-watered") {
        setWaterMessage("You already watered me today. Come back tomorrow!");
      } else {
        setWaterMessage("Thank you! See you tomorrow for another sip.");
      }
    } catch {
      // Failure is surfaced by the parent's alert; nothing more to do here.
    } finally {
      setIsWatering(false);
    }
  }

  async function handleSaveEdit() {
    setIsSaving(true);
    try {
      await onUpdate(plant.id, {
        name: editName,
        personality: editPersonality,
      });
      setIsEditing(false);
    } catch {
      // The dashboard owns the generic error message.
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Remove ${plant.name} from your garden?`)) return;
    setIsDeleting(true);
    try {
      await onDelete(plant.id);
    } catch {
      setIsDeleting(false);
    }
  }

  return (
    <article
      className={`overflow-hidden rounded-3xl border shadow-lg shadow-emerald-950/5 ${MOOD_STYLES[mood]} ${className ?? ""}`.trim()}
    >
      {plant.photoUrl ? (
        <img
          src={plant.photoUrl}
          alt={plant.name}
          className="h-48 w-full object-cover"
        />
      ) : <div className="flex h-48 items-center justify-center bg-emerald-50 text-5xl">🌿</div>}

      <div className="p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          {isEditing ? (
            <input
              aria-label={`Name for ${plant.name}`}
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
              className="w-full rounded-lg border border-emerald-200 px-2 py-1 text-lg font-semibold text-emerald-950 outline-none focus:ring-2 focus:ring-emerald-200"
            />
          ) : <h3 className="text-xl font-semibold tracking-tight text-emerald-950">{plant.name}</h3>}
      {plant.species ? (
        <p className="mt-1 text-xs text-emerald-900/55">{plant.species}</p>
      ) : null}
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">{MOOD_LABELS[mood]}</span>
      </div>

      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-900/50">Watering progress</p>

      <div
        role="progressbar"
        aria-label={`Watering progress for ${plant.name}`}
        aria-valuemin={0}
        aria-valuemax={plant.wateringFrequency}
        aria-valuenow={Math.min(daysSince, plant.wateringFrequency)}
        className="mb-2 h-3 w-full overflow-hidden rounded-full bg-emerald-100"
      >
        <div
          className="h-full rounded-full bg-emerald-600 transition-[width] duration-700"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="mb-4 text-xs text-emerald-900/55">
        {plant.lastWateredAt
          ? `${daysSince} of ${plant.wateringFrequency} days since last watering`
          : "Ready for its first watering"}
      </p>

      <div className="space-y-2 text-sm text-emerald-900/70">
        <p><span className="font-semibold text-emerald-950">Every {plant.wateringFrequency} days</span> · {plant.lightPreference}</p>
        <p>🔥 <span className="font-semibold text-emerald-950">{plant.streak}-day streak</span></p>
      </div>
      <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-3 text-sm italic leading-6 text-emerald-900/75">&ldquo;{voiceLine}&rdquo;</p>
      <p className="voice-bubble mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">{plant.personality} voice</p>

      {waterMessage ? (
        <p role="status" className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {waterMessage}
        </p>
      ) : null}

      {isEditing ? (
        <div className="mt-4 space-y-2 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
          <label htmlFor={`personality-${plant.id}`} className="block text-xs font-semibold uppercase tracking-wide text-emerald-900/65">Personality</label>
          <select
            id={`personality-${plant.id}`}
            value={editPersonality}
            onChange={(event) => setEditPersonality(event.target.value)}
            className="w-full rounded-lg border border-emerald-200 px-2 py-2 text-sm"
          >
            {PLANT_PERSONALITIES.map((personality) => <option key={personality} value={personality}>{personality}</option>)}
          </select>
          <div className="flex gap-2">
            <button type="button" onClick={handleSaveEdit} disabled={isSaving} className="flex-1 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSaving ? "Saving..." : "Save changes"}</button>
            <button type="button" onClick={() => setIsEditing(false)} disabled={isSaving} className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-900">Cancel</button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleWaterClick}
        disabled={isWatering}
        aria-disabled={isWatering}
        className="mt-4 w-full rounded-xl bg-emerald-800 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isWatering ? "Watering..." : "Mark as watered"}
      </button>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button type="button" onClick={() => setIsEditing(true)} className="text-sm font-semibold text-emerald-800 hover:text-emerald-950">Edit plant</button>
        <button type="button" onClick={handleDelete} disabled={isDeleting} className="text-sm font-semibold text-rose-700 hover:text-rose-900 disabled:opacity-50">{isDeleting ? "Removing..." : "Remove"}</button>
      </div>
      </div>
    </article>
  );
}

export default PlantCard;
