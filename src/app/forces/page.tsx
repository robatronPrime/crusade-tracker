import Force from "@/components/Force";
import { Forces } from "@/models/forces";

export default async function ForcesPage() {
  // add try catch
  const getForces = async () => {
    try {
      const res = await fetch(`${process.env.API_URL}/forces`, { next: { revalidate: 60 } });

      if (!res.ok) {
        throw new Error(`Failed to fetch forces (status: ${res.status})`);
      }

      return await res.json();
    } catch (error) {
      console.error(error);
    }
  };

  const data = (await getForces()) as Forces[];

  return <Force data={data} />;
}
