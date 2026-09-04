import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import UnitEditForm from "@/components/UnitEditForm";

type PageProps = {
  params: Promise<{ id: string; unitId: string }>;
};

export default async function UnitEditPage({ params }: PageProps) {
  const { id: forceId, unitId } = await params;

  const unitRes = await fetch(`${process.env.LOCALHOST}/api/units/${unitId}`, {
    cache: "no-store",
  });

  if (!unitRes.ok) {
    return notFound();
  }

  const rawUnit = await unitRes.json();
  const unit: Unit = {
    id: String(rawUnit._id ?? rawUnit.id),
    forceId: String(rawUnit.forceId ?? forceId),
    name: rawUnit.name ?? "",
    modelCount: Number(rawUnit.modelCount ?? 0),
    pointsValue: Number(rawUnit.pointsValue ?? 0),
    crusadePoints: Number(rawUnit.crusadePoints ?? 0),
    xp: Number(rawUnit.xp ?? 0),
    battlesPlayed: Number(rawUnit.battlesPlayed ?? 0),
    battlesSurvived: Number(rawUnit.battlesSurvived ?? 0),
  };

  const mongoForceId = String(rawUnit.forceId ?? forceId);
  const forceRes = await fetch(`${process.env.LOCALHOST}/api/forces/${mongoForceId}`, {
    cache: "no-store",
  });

  if (!forceRes.ok) {
    return notFound();
  }

  const force = await forceRes.json();
  const supplyLimit = Number(force.supplyLimit ?? 0);
  const units: Unit[] = force.units ?? [];
  const otherUnitsPoints = units
    .filter((u) => String(u.id) !== unit.id)
    .reduce((sum, u) => sum + Number(u.pointsValue ?? 0), 0);

  return (
    <>
      <PageHeader title="Edit Unit" backHref="/forces" backLabel="← Orders of Battle" />
      <div className="col-span-12">
        <UnitEditForm
          unit={unit}
          forceId={mongoForceId}
          supplyLimit={supplyLimit}
          otherUnitsPoints={otherUnitsPoints}
        />
      </div>
    </>
  );
}
