import { Force } from "../../../types/global";

export default async function ForcesPage() {
  // add try catch
  const getForces = async () => {
    try {
      const res = await fetch(`${process.env.LOCALHOST}/forces`, { next: { revalidate: 60 } });

      if (!res.ok) {
        throw new Error(`Failed to fetch forces (status: ${res.status})`);
      }

      console.log(await res.json());

      return await res.json();
    } catch (error) {
      console.error(error);
    }
  };

  const data = (await getForces()) as Force[];

  return <></>;
  // return <Force data={data} />;
}
