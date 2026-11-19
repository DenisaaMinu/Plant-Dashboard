import { afterEach, expect, test, vi } from "vitest";

import { identifyPlant } from "@/actions/plant/identifyPlant/identifyPlant";

function photoForm() {
  const formData = new FormData();
  formData.append("photo", new File(["fake"], "plant.jpg", { type: "image/jpeg" }));
  return formData;
}

function mockPlantNet(body: unknown, ok = true) {
  const fetchMock = vi.fn().mockResolvedValue({ ok, json: async () => body });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

test("returns matched with care data for a known species", async () => {
  vi.stubEnv("PLANTNET_API_KEY", "test-key");
  const fetchMock = mockPlantNet({
    results: [
      {
        score: 0.91,
        species: {
          scientificNameWithoutAuthor: "Epipremnum aureum",
          commonNames: ["Golden pothos"],
        },
      },
    ],
  });

  const result = await identifyPlant(photoForm());

  expect(fetchMock).toHaveBeenCalledOnce();
  expect(result).toMatchObject({
    status: "matched",
    speciesName: "Epipremnum aureum",
    commonName: "Golden pothos",
    confidence: 0.91,
    care: { id: "pothos", wateringFrequency: 7 },
  });
});

test("returns noMatch for a species outside the care database", async () => {
  vi.stubEnv("PLANTNET_API_KEY", "test-key");
  mockPlantNet({
    results: [
      { score: 0.5, species: { scientificNameWithoutAuthor: "Unknownus plantus" } },
    ],
  });

  expect(await identifyPlant(photoForm())).toEqual({
    status: "noMatch",
    speciesName: "Unknownus plantus",
  });
});

test("returns noMatch when PlantNet has no results", async () => {
  vi.stubEnv("PLANTNET_API_KEY", "test-key");
  mockPlantNet({ results: [] });

  expect(await identifyPlant(photoForm())).toEqual({
    status: "noMatch",
    speciesName: null,
  });
});

test("returns error when PlantNet responds with a failure", async () => {
  vi.stubEnv("PLANTNET_API_KEY", "test-key");
  mockPlantNet({}, false);

  expect(await identifyPlant(photoForm())).toEqual({ status: "error" });
});

test("returns error without calling PlantNet when no API key is set", async () => {
  vi.stubEnv("PLANTNET_API_KEY", "");
  const fetchMock = mockPlantNet({});

  expect(await identifyPlant(photoForm())).toEqual({ status: "error" });
  expect(fetchMock).not.toHaveBeenCalled();
});
