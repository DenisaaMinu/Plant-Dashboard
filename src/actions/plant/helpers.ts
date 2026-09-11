export type CreatePlantInput = {
  name: string;
  species: string | null;
  photoUrl: string | null;
  wateringFrequency: number;
  lightPreference: string;
  personality: string | null;
};

export function parsePlantFields(input: CreatePlantInput) {
  const name = input.name.trim();
  if (!name) {
    throw new Error("Plant name is required");
  }

  const lightPreference = input.lightPreference.trim();
  if (!lightPreference) {
    throw new Error("Light preference is required");
  }

  if (!Number.isFinite(input.wateringFrequency) || input.wateringFrequency <= 0) {
    throw new Error("Watering frequency must be a positive number of days");
  }

  return {
    name,
    lightPreference,
    wateringFrequency: input.wateringFrequency,
    species: input.species?.trim() || null,
    photoUrl: input.photoUrl?.trim() || null,
    personality: input.personality?.trim() || "chill",
  };
}
