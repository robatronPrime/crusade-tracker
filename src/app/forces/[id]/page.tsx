import ForceDetails from "@/components/ForceDetails";
import PageHeader from "@/components/PageHeader";
import ParchmentCard from "@/components/ParchmentCard";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ForcePage({ params }: PageProps) {
  const { id } = await params;

  const forceRes = await fetch(`${process.env.LOCALHOST}/api/forces/${id}`, {
    cache: "no-store",
  });

  if (!forceRes.ok) {
    return notFound();
  }

  const force = await forceRes.json();

  return (
    <>
      <PageHeader title="Order of Battle" backHref="/forces" backLabel="← Orders of Battle" />
      <div className="col-span-12">
        <ParchmentCard className="my-8">
          <ForceDetails forceProps={force} />
        </ParchmentCard>
      </div>
    </>
  );
}
