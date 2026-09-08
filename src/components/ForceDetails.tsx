import { JSX, useState } from "react";
import UnitQuickActions from "./UnitQuickActions";
import StatBlock from "./StatBlock";
import Link from "next/link";
import ForceDeleteButton from "./ForceDeleteButton";

interface ForceProps {
  forceProps: Force & { _id?: string };
}

const ForceDetails = ({ forceProps }: ForceProps): JSX.Element => {
  const {
    name,
    victories,
    lore,
    units,
    supplyUsed,
    supplyLimit,
    battleTally,
    requisitionPoints,
    recordOfAchievement,
  } = forceProps;

  const [showLore, setShowLore] = useState(false);

  const recordText = Array.isArray(recordOfAchievement)
    ? recordOfAchievement.join("\n")
    : (recordOfAchievement ?? "");
  const recordLines = recordText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const forceId = String(forceProps._id || forceProps.id || "");

  return (
    <div className="text-ink">
      <h2 className="font-display text-2xl lg:text-3xl tracking-widest uppercase mb-6">{name}</h2>

      <div className="flex flex-wrap gap-8 mb-8 border-b border-brass/40 pb-6">
        <StatBlock label="Battle Tally" value={battleTally ?? 0} />
        <StatBlock label="Victories" value={victories ?? 0} />
        <StatBlock label="Requisition" value={requisitionPoints ?? 0} />
        <StatBlock label="Supply" value={`${supplyUsed ?? 0} / ${supplyLimit}`} />
        <Link className="text-brass text-xs underline hover:text-brass-hover" href={`/forces/${forceId}/edit`}>
          Edit
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex justify-between md:flex-col md:justify-start md:items-start border-b border-brass/40 pb-6">
          <h3 className="text-lg font-bold mb-2 text-ink/60">Lore</h3>
          <button className="text-brass text-xs underline hover:text-brass-hover ml-4 md:ml-0" onClick={() => setShowLore(!showLore)}>{showLore ? "Hide Lore" : "Show Lore"}</button>
          
          {showLore && (
            <div className="text-ink text-sm whitespace-pre-wrap mt-4">
              {!lore?.trim() ? (
                <p className="text-ink/50 text-sm">No lore recorded.</p>
              ) : (
                <p className="text-ink text-sm whitespace-pre-wrap italic">{lore}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <UnitQuickActions
        forceId={forceId}
        supplyLimit={supplyLimit}
        supplyUsed={supplyUsed ?? 0}
        units={units ?? []}
      />

      <div className="mt-8">
        <p className="text-xs uppercase tracking-widest text-ink/60 mb-2">Record of Achievement</p>
        {!recordLines.length ? (
          <p className="text-ink/50 text-sm">No records.</p>
        ) : (
          <ul className="list-disc list-inside text-sm space-y-1">
            {recordLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10">
        <ForceDeleteButton forceId={forceId} forceName={name} />
      </div>
    </div>
  );
};

export default ForceDetails;