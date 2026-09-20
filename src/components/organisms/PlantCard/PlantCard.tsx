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
  healthy: "border-emerald-200 bg-gradient-to-b from-emerald-50 via-white to-emerald-50",
  needsWaterSoon: "border-amber-200 bg-gradient-to-b from-amber-50 via-white to-amber-50",
  overdue: "border-rose-200 bg-gradient-to-b from-rose-50 via-white to-rose-50",
};

const MOOD_LABELS: Record<PlantMood, string> = {
  healthy: "Healthy",
  needsWaterSoon: "Needs water soon",
  overdue: "Overdue",
};

const MOOD_ICONS: Record<PlantMood, string> = {
  healthy: "✨",
  needsWaterSoon: "💧",
  overdue: "⚠️",
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
  const [showCelebration, setShowCelebration] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const daysSince = getDaysSince(plant.lastWateredAt, now);
  const mood = getMood(daysSince, plant.wateringFrequency);
  const progress = getWateringProgress(daysSince, plant.wateringFrequency);
  const voiceLine = getVoiceLine(plant.personality, mood, daysSince);
  const isWateredToday = plant.lastWateredAt
    ? new Date(plant.lastWateredAt).toDateString() === new Date(now).toDateString()
    : false;
  const isReadyToWater = !plant.lastWateredAt || daysSince >= plant.wateringFrequency;
  const daysUntilWatering = Math.max(1, plant.wateringFrequency - daysSince);

  async function handleWaterClick() {
    setIsWatering(true);
    setWaterMessage(null);
    setShowCelebration(false);
    try {
      const result = await onWater(plant.id);
      if (result.status === "already-watered") {
        setWaterMessage("You already watered me today. Come back tomorrow!");
      } else if (result.status === "too-early") {
        setWaterMessage(
          `Too early for a watering reminder — wait about ${result.remainingDays} more day${result.remainingDays === 1 ? "" : "s"}.`,
        );
      } else {
        setWaterMessage("+10 XP! Your leafy friend is feeling refreshed.");
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 900);
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
      className={`group relative overflow-hidden rounded-[28px] border shadow-[0_16px_45px_rgba(20,83,45,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(16,84,60,0.12)] ${MOOD_STYLES[mood]} ${className ?? ""}`.trim()}
    >
      {plant.photoUrl ? (
        <img
          src={plant.photoUrl}
          alt={plant.name}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 text-5xl transition duration-500 group-hover:scale-105">
          🌿
        </div>
      )}

      {showCelebration ? (
        <div className="water-reward absolute left-1/2 top-5 z-10 -translate-x-1/2 rounded-full bg-[#f5c969] px-4 py-2 text-sm font-black text-emerald-950 shadow-lg shadow-emerald-950/20">
          ✨ +10 XP
        </div>
      ) : null}

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
        <p>
          <span className="font-semibold text-emerald-950">Recommended: every {plant.wateringFrequency} days</span>
        </p>
        <p>{plant.lightPreference}</p>
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
        disabled={isWatering || !isReadyToWater || isWateredToday}
        aria-disabled={isWatering || !isReadyToWater || isWateredToday}
        className="mt-4 w-full rounded-xl bg-emerald-800 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-900/25 disabled:text-emerald-900/50"
      >
        {isWatering
          ? "Watering..."
          : isWateredToday
            ? "Watered today"
            : isReadyToWater
              ? "Water +10 XP"
              : `Ready in ${daysUntilWatering} day${daysUntilWatering === 1 ? "" : "s"}`}
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
