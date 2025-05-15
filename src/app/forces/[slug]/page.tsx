import ForceDetails from "@/components/ForceDetails";
import { Force } from "../../../../types/global";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const getForces = async () => {
    try {
      const res = await fetch(`${process.env.LOCALHOST}/api/forces/${slug}`);

      if (!res.ok) {
        console.log(`Failed to fetch forces (status: ${res.status})`);
      }

      return await res.json();
    } catch (error) {
      console.error(error);
    }
  };

  const data = (await getForces()) as Force;

  console.log(data);

  return <ForceDetails data={data} />;
}
