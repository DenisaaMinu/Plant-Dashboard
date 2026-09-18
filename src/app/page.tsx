import { createPlant } from "@/actions/plant/createPlant/createPlant";
import { deletePlant } from "@/actions/plant/deletePlant/deletePlant";
import { identifyPlant } from "@/actions/plant/identifyPlant/identifyPlant";
import { listPlants } from "@/actions/plant/listPlants/listPlants";
import { updatePlant } from "@/actions/plant/updatePlant/updatePlant";
import { waterPlant } from "@/actions/plant/waterPlant/waterPlant";
import { PlantDashboard } from "@/components/pages/PlantDashboard/PlantDashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialPlants = await listPlants();

  return (
    <PlantDashboard
      initialPlants={initialPlants}
      createPlant={createPlant}
      waterPlant={waterPlant}
      identifyPlant={identifyPlant}
      updatePlant={updatePlant}
      deletePlant={deletePlant}
    />
  );
}
