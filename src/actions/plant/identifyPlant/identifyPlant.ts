"use server";

import { findCareBySpeciesName, type PlantCarePreset } from "@/lib/careData";

export type IdentifyPlantResult =
  | {
      status: "matched";
      speciesName: string;
      commonName: string;
      confidence: number;
      care: PlantCarePreset;
    }
  | { status: "noMatch"; speciesName: string | null }
  | { status: "error" };

export async function identifyPlant(
  formData: FormData,
): Promise<IdentifyPlantResult> {
  const photo = formData.get("photo");
  const apiKey = process.env.PLANTNET_API_KEY;

  if (!(photo instanceof File) || !apiKey) {
    return { status: "error" };
  }

  try {
    const plantNetForm = new FormData();
    plantNetForm.append("images", photo);
    plantNetForm.append("organs", "auto");

    const response = await fetch(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`,
      { method: "POST", body: plantNetForm },
    );

    if (!response.ok) {
      return { status: "error" };
    }

    const data = await response.json();
    const bestResult = data?.results?.[0];

    if (!bestResult) {
      return { status: "noMatch", speciesName: null };
    }

    const speciesName: string =
      bestResult.species?.scientificNameWithoutAuthor ?? "";
    const commonName: string =
      bestResult.species?.commonNames?.[0] ?? speciesName;
    const confidence: number = bestResult.score ?? 0;

    const care = findCareBySpeciesName(speciesName);
    if (!care) {
      return { status: "noMatch", speciesName };
    }

    return { status: "matched", speciesName, commonName, confidence, care };
  } catch {
    return { status: "error" };
  }
}
