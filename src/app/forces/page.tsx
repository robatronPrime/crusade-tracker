import ForceTab from "@/components/ForceTab";
import { Force } from "../../../types/global";
import { currentUser } from "@clerk/nextjs/server";

export default async function ForcesPage() {
  const user = await currentUser();

  const getForces = async () => {
    if (user) {
      try {
        const res = await fetch(`${process.env.LOCALHOST}/api/users/${user.id}/forces`);

        if (!res.ok) {
          console.log(`Failed to fetch forces (status: ${res.status})`);
        }

        return await res.json();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const data = (await getForces()) as Force[];

  return <ForceTab data={data} />;
}
