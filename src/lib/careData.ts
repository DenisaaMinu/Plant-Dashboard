export type PlantCarePreset = {
  id: string;
  commonName: string;
  scientificName: string;
  wateringFrequency: number;
  lightPreference: string;
};

export const PLANT_CARE_PRESETS: PlantCarePreset[] = [
  {
    id: "pothos",
    commonName: "Pothos",
    scientificName: "Epipremnum aureum",
    wateringFrequency: 7,
    lightPreference: "Bright, indirect light; tolerates low light",
  },
  {
    id: "snake-plant",
    commonName: "Snake Plant",
    scientificName: "Dracaena trifasciata",
    wateringFrequency: 14,
    lightPreference: "Low to bright indirect light",
  },
  {
    id: "monstera",
    commonName: "Monstera",
    scientificName: "Monstera deliciosa",
    wateringFrequency: 7,
    lightPreference: "Bright, indirect light",
  },
  {
    id: "spider-plant",
    commonName: "Spider Plant",
    scientificName: "Chlorophytum comosum",
    wateringFrequency: 7,
    lightPreference: "Bright, indirect light",
  },
  {
    id: "zz-plant",
    commonName: "ZZ Plant",
    scientificName: "Zamioculcas zamiifolia",
    wateringFrequency: 14,
    lightPreference: "Low to bright indirect light",
  },
  {
    id: "fiddle-leaf-fig",
    commonName: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    wateringFrequency: 7,
    lightPreference: "Bright, indirect light",
  },
  {
    id: "peace-lily",
    commonName: "Peace Lily",
    scientificName: "Spathiphyllum",
    wateringFrequency: 5,
    lightPreference: "Low to medium indirect light",
  },
  {
    id: "aloe-vera",
    commonName: "Aloe Vera",
    scientificName: "Aloe vera",
    wateringFrequency: 14,
    lightPreference: "Bright light, some direct sun",
  },
  {
    id: "parlor-palm",
    commonName: "Parlor Palm",
    scientificName: "Chamaedorea elegans",
    wateringFrequency: 7,
    lightPreference: "Low to medium indirect light",
  },
  {
    id: "heartleaf-philodendron",
    commonName: "Heartleaf Philodendron",
    scientificName: "Philodendron hederaceum",
    wateringFrequency: 7,
    lightPreference: "Medium, indirect light",
  },
  {
    id: "jade-plant",
    commonName: "Jade Plant",
    scientificName: "Crassula ovata",
    wateringFrequency: 14,
    lightPreference: "Bright light, some direct sun",
  },
  {
    id: "chinese-money-plant",
    commonName: "Chinese Money Plant",
    scientificName: "Pilea peperomioides",
    wateringFrequency: 7,
    lightPreference: "Bright, indirect light",
  },
  {
    id: "calathea",
    commonName: "Calathea",
    scientificName: "Calathea orbifolia",
    wateringFrequency: 5,
    lightPreference: "Medium, indirect light",
  },
  {
    id: "rubber-plant",
    commonName: "Rubber Plant",
    scientificName: "Ficus elastica",
    wateringFrequency: 7,
    lightPreference: "Bright, indirect light",
  },
  {
    id: "dragon-tree",
    commonName: "Dragon Tree",
    scientificName: "Dracaena marginata",
    wateringFrequency: 10,
    lightPreference: "Bright, indirect light",
  },
  {
    id: "chinese-evergreen",
    commonName: "Chinese Evergreen",
    scientificName: "Aglaonema commutatum",
    wateringFrequency: 9,
    lightPreference: "Low to medium indirect light",
  },
  {
    id: "english-ivy",
    commonName: "English Ivy",
    scientificName: "Hedera helix",
    wateringFrequency: 5,
    lightPreference: "Bright, indirect light",
  },
  {
    id: "anthurium",
    commonName: "Anthurium",
    scientificName: "Anthurium andraeanum",
    wateringFrequency: 6,
    lightPreference: "Bright, indirect light",
  },
];

export function findCareBySpeciesName(
  speciesName: string,
): PlantCarePreset | null {
  const normalized = speciesName.trim().toLowerCase();
  return (
    PLANT_CARE_PRESETS.find((preset) =>
      normalized.startsWith(preset.scientificName.toLowerCase()),
    ) ?? null
  );
}

export function findCareByPresetId(presetId: string): PlantCarePreset | null {
  return PLANT_CARE_PRESETS.find((preset) => preset.id === presetId) ?? null;
}
