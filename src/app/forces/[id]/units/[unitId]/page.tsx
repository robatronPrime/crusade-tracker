import { notFound } from "next/navigation";
import { fetchSiteApi } from "@/lib/fetchSiteApi";
import PageHeader from "@/components/PageHeader";
import UnitPage from "@/components/UnitPage";

type PageProps = {
  params: Promise<{ id: string; unitId: string }>;
};

export default async function UnitDetailPage({ params }: PageProps) {
  const { id: forceId, unitId } = await params;

  const unitRes = await fetchSiteApi(`/api/units/${unitId}`);

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
    enemyUnitsDestroyed: Number(rawUnit.enemyUnitsDestroyed ?? 0),
    type: rawUnit.type ?? "",
    wargear: Array.isArray(rawUnit.wargear) ? rawUnit.wargear : [],
    enhancements: Array.isArray(rawUnit.enhancements) ? rawUnit.enhancements : [],
    battleHonours: Array.isArray(rawUnit.battleHonours) ? rawUnit.battleHonours : [],
    battleScars: Array.isArray(rawUnit.battleScars) ? rawUnit.battleScars : [],
    lore: rawUnit.lore ?? "",
  };

  const mongoForceId = String(rawUnit.forceId ?? forceId);
  const forceRes = await fetchSiteApi(`/api/forces/${mongoForceId}`);

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
      <PageHeader title={unit.name} backHref="/forces" backLabel="← Orders of Battle" />
      <UnitPage unit={unit} forceId={mongoForceId} supplyLimit={supplyLimit} otherUnitsPoints={otherUnitsPoints} />
    </>
  );
}
