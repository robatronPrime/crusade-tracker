import { JSX } from "react";
import UnitQuickActions from "./UnitQuickActions";
import ForceDeleteButton from "./ForceDeleteButton";
import StatBlock from "./StatBlock";

interface ForceProps {
  forceProps: Force & { _id?: string };
}

const ForceDetails = ({ forceProps }: ForceProps): JSX.Element => {
  const {
    name,
    victories,
    units,
    supplyUsed,
    supplyLimit,
    battleTally,
    requisitionPoints,
    recordOfAchievement,
  } = forceProps;

  const forceId = String(forceProps._id || forceProps.id || "");

  return (
    <div className="text-ink">
      <h2 className="font-display text-2xl lg:text-3xl tracking-widest uppercase mb-6">{name}</h2>

      <div className="flex flex-wrap gap-8 mb-8 border-b border-brass/40 pb-6">
        <StatBlock label="Battle Tally" value={battleTally ?? 0} />
        <StatBlock label="Victories" value={victories ?? 0} />
        <StatBlock label="Requisition" value={requisitionPoints ?? 0} />
        <StatBlock label="Supply" value={`${supplyUsed ?? 0} / ${supplyLimit}`} />
      </div>

      <UnitQuickActions
        forceId={forceId}
        supplyLimit={supplyLimit}
        supplyUsed={supplyUsed ?? 0}
        units={units ?? []}
      />

      <div className="mt-8">
        <p className="text-xs uppercase tracking-widest text-ink/60 mb-2">Record of Achievement</p>
        {!recordOfAchievement || recordOfAchievement.length === 0 ? (
          <p className="text-ink/50 text-sm">No records.</p>
        ) : (
          <ul className="list-disc list-inside text-sm space-y-1">
            {recordOfAchievement.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <ForceDeleteButton forceId={forceId} forceName={name} />
    </div>
  );
};

export default ForceDetails;
