import ForceEditForm from "@/components/ForceEditForm";
import PageHeader from "@/components/PageHeader";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { fetchSiteApi } from "@/lib/fetchSiteApi";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ForcePage({ params }: PageProps) {
  const { id } = await params;

  const forceRes = await fetchSiteApi(`/api/forces/${id}`);

  if (!forceRes.ok) {
    return notFound();
  }

  const userId = await currentUser();

  const force = await forceRes.json();
  return (
    <>
      <PageHeader title="Edit Force" backHref="/forces" backLabel="← Orders of Battle" />
      <div className="col-span-12">
        <ForceEditForm
          forceId={id}
          forceName={force.name}
          userId={userId ? userId.id : ""}
          units={force.units ?? []}
          supplyLimit={force.supplyLimit}
          victories={force.victories}
          battleTally={force.battleTally}
          requisitionPoints={force.requisitionPoints}
          recordOfAchievement={force.recordOfAchievement}
          lore={force.lore}
        />
      </div>
    </>
  );
}