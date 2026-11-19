"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { findCareByPresetId, PLANT_CARE_PRESETS } from "@/lib/careData";
import { PLANT_PERSONALITIES } from "@/lib/plantVoice";
import type { IdentifyPlantResult } from "@/actions/plant/identifyPlant/identifyPlant";

type NewPlantInput = {
  name: string;
  species: string | null;
  photoUrl: string | null;
  wateringFrequency: number;
  lightPreference: string;
  personality: string;
};

type UploadFormProps = {
  identifyPlant: (formData: FormData) => Promise<IdentifyPlantResult>;
  onCreatePlant: (input: NewPlantInput) => Promise<void>;
  className?: string;
};

export function UploadForm({
  identifyPlant,
  onCreatePlant,
  className,
}: UploadFormProps) {
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState<string>("chill");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [identifyResult, setIdentifyResult] =
    useState<IdentifyPlantResult | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState(
    PLANT_CARE_PRESETS[0].id,
  );
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setPhotoFile(file);
    setIdentifyResult(null);
    setFormError(null);

    if (!file) {
      setPhotoDataUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleIdentifyClick() {
    if (!photoFile) {
      setFormError("Choose a photo first.");
      return;
    }
    setIsIdentifying(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append("photo", photoFile);
      setIdentifyResult(await identifyPlant(formData));
    } finally {
      setIsIdentifying(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      setFormError("Give your plant a name.");
      return;
    }

    const care =
      identifyResult?.status === "matched"
        ? identifyResult.care
        : findCareByPresetId(selectedPresetId);

    if (!care) {
      setFormError("Pick a plant type.");
      return;
    }

    setIsSaving(true);
    try {
      await onCreatePlant({
        name,
        species:
          identifyResult?.status === "matched"
            ? identifyResult.speciesName
            : care.scientificName,
        photoUrl: photoDataUrl,
        wateringFrequency: care.wateringFrequency,
        lightPreference: care.lightPreference,
        personality,
      });
      setName("");
      setPersonality("chill");
      setPhotoFile(null);
      setPhotoDataUrl(null);
      setIdentifyResult(null);
      setSelectedPresetId(PLANT_CARE_PRESETS[0].id);
      setFormError(null);
    } catch {
      // Parent already surfaced the alert; keep the form filled in so the user can retry.
    } finally {
      setIsSaving(false);
    }
  }

  const showManualPicker =
    !!photoFile && identifyResult?.status !== "matched";

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-3xl border border-emerald-100 bg-white/85 p-5 shadow-xl shadow-emerald-950/5 sm:p-7 ${className ?? ""}`.trim()}
    >
      <div className="grid gap-7 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        <div>
        <label htmlFor="plant-photo" className="mb-2 block text-sm font-semibold text-emerald-950">
          Plant photo
        </label>
        <input
          id="plant-photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
        className="w-full rounded-xl border border-emerald-100 bg-[#fbfdf9] p-2 text-sm text-emerald-900/70"
        />

      {photoDataUrl ? (
        // Local FileReader preview (data URL); next/image cannot optimize it.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoDataUrl}
          alt="Selected plant"
          className="mt-4 h-44 w-full rounded-2xl object-cover shadow-sm"
        />
      ) : <div className="mt-4 flex h-44 items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 text-sm text-emerald-900/50">Your plant preview will appear here</div>}

      <button
        type="button"
        onClick={handleIdentifyClick}
        disabled={!photoFile || isIdentifying}
        aria-disabled={!photoFile || isIdentifying}
        className="mt-4 rounded-xl bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isIdentifying ? "Identifying..." : "Identify plant"}
      </button>
        </div>

        <div className="space-y-4">
      {identifyResult?.status === "matched" ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Identified as {identifyResult.commonName} (
          {Math.round(identifyResult.confidence * 100)}% confidence)
        </p>
      ) : null}

      {showManualPicker ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            {identifyResult?.status === "noMatch"
              ? "That species is not in our care database."
              : identifyResult?.status === "error"
                ? "Plant identification is unavailable right now."
                : "Choose a plant type now, or try photo identification first."}{" "}
            Pick a preset so your plant can still be added:
          </p>
          <label htmlFor="plant-preset" className="mt-3 block text-sm font-semibold text-amber-950">
            Plant type
          </label>
          <select
            id="plant-preset"
            value={selectedPresetId}
            onChange={(event) => setSelectedPresetId(event.target.value)}
            className="mt-1 w-full rounded-xl border border-amber-200 px-3 py-2 text-sm"
          >
            {PLANT_CARE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.commonName}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label htmlFor="plant-name" className="block text-sm font-semibold text-emerald-950">
          Name
        </label>
        <input
          id="plant-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-xl border border-emerald-100 px-3 py-2.5 outline-none ring-emerald-200 focus:ring-2"
        />
      </div>

      <div>
        <label
          htmlFor="plant-personality"
          className="block text-sm font-semibold text-emerald-950"
        >
          Personality
        </label>
        <select
          id="plant-personality"
          value={personality}
          onChange={(event) => setPersonality(event.target.value)}
          className="mt-1 w-full rounded-xl border border-emerald-100 px-3 py-2.5"
        >
          {PLANT_PERSONALITIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {formError ? (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSaving || !photoFile}
        aria-disabled={isSaving || !photoFile}
        className="w-full rounded-xl bg-[#d97745] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c56638] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSaving ? "Adding..." : "Add plant"}
      </button>
        </div>
      </div>
    </form>
  );
}

export default UploadForm;
