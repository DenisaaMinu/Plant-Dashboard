import type { PlantMood } from "@/lib/moodLogic";

export const PLANT_PERSONALITIES = ["dramatic", "chill", "sarcastic"] as const;
export type PlantPersonality = (typeof PLANT_PERSONALITIES)[number];

function isPlantPersonality(value: string): value is PlantPersonality {
  return (PLANT_PERSONALITIES as readonly string[]).includes(value);
}

const VOICE_LINES: Record<PlantPersonality, Record<PlantMood, string[]>> = {
  dramatic: {
    healthy: [
      "Look at me. Thriving. Absolutely radiant.",
      "I am the main character today.",
    ],
    needsWaterSoon: [
      "I can feel the drought approaching...",
      "This is fine. FINE. (please water me soon.)",
    ],
    overdue: [
      "9 days. I've counted. I'm FINE.",
      "Tell my leaves I loved them.",
    ],
  },
  chill: {
    healthy: ["All good here, no rush.", "Just vibing in the sun."],
    needsWaterSoon: [
      "Getting a little thirsty, whenever you get a chance.",
      "Could use a sip soon, no stress.",
    ],
    overdue: [
      "Hey, it's been a while. Water would be nice.",
      "Still here, just a bit parched.",
    ],
  },
  sarcastic: {
    healthy: [
      "Wow, you actually remembered. Shocking.",
      "I'm doing great, no thanks to your memory.",
    ],
    needsWaterSoon: [
      "Oh don't mind me, just getting thirsty over here.",
      "I'm sure you'll water me... eventually.",
    ],
    overdue: [
      "Oh, sorry, were you busy? I'm just dying.",
      "Cool, cool, I'll just wilt quietly then.",
    ],
  },
};

export function getVoiceLine(
  personality: string,
  mood: PlantMood,
  daysSince: number,
): string {
  const key = isPlantPersonality(personality) ? personality : "chill";
  const lines = VOICE_LINES[key][mood];
  return lines[daysSince % lines.length];
}
