import { notFound } from "next/navigation";
import Forces from "../pageTemplates/Forces";
import { currentUser } from "@clerk/nextjs/server";
import { getSiteUrl } from "@/lib/siteUrl";

export default async function ForcesPage() {
  const user = await currentUser();

  const getForces = async (): Promise<CrusadeUser | null> => {
    if (user) {
      try {
        const res = await fetch(`${getSiteUrl()}/api/users/${user.id}/forces`, {
          cache: "no-store",
        });

        if (!res.ok) {
          console.log(`Failed to fetch forces (status: ${res.status})`);
          return null;
        }

        return await res.json();
      } catch (error) {
        console.error(error);
        return null;
      }
    } else {
      return null;
    }
  };

  try {
    const data = await getForces();
    if (!data) throw new Error("data not found.")

    return <Forces data={data} />;
  } catch (err: unknown) {
    console.log(err);
    return notFound();
  }
}
