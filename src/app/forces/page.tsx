import ForceTab from "@/components/ForceTab";
import { Force } from "../../../types/global";

export default async function ForcesPage() {
  // add try catch
  const getForces = async () => {
    try {
      const res = await fetch(`${process.env.LOCALHOST}/api/forces`);

      if (!res.ok) {
        console.log(`Failed to fetch forces (status: ${res.status})`);
      }

      return await res.json();
    } catch (error) {
      console.error(error);
    }
  };

  const data = (await getForces()) as Force[];

  return <ForceTab data={data} />;
}
