import { JSX } from "react";
import UnitQuickActions from "./UnitQuickActions";

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
    <div className="col-span-12 px-4 lg:p-8 text-xs lg:text-base relative">
      <div className="col-span-12 px-4 lg:p-8 text-xs lg:text-base">
        <h1 className="mb-8 text-4xl font-bold">{name}</h1>

        <div className="col-span-7 flex justify-between gap-4 mb-4 flex-wrap">
          <div className="flex gap-4 items-center">
            <p className="font-bold">Battle Tally</p>
            <p>{battleTally}</p>
          </div>
          <div className="flex gap-4 items-center">
            <p className="font-bold">Victories</p>
            <p>{victories}</p>
          </div>
          <div className="flex gap-4 items-center">
            <p className="font-bold">Requisition Points</p>
            <p>{requisitionPoints}</p>
          </div>
          <div className="flex gap-4 items-center">
            <p className="font-bold">Supply</p>
            <p>
              {supplyUsed} / {supplyLimit}
            </p>
          </div>
        </div>

        <UnitQuickActions
          forceId={forceId}
          supplyLimit={supplyLimit}
          supplyUsed={supplyUsed}
          units={units ?? []}
        />

        <div className="col-span-2 flex flex-col mt-8">
          <p>Record of Achievement</p>
          {recordOfAchievement?.length === 0 ? <p>No records</p> : null}
          {recordOfAchievement?.map((achievement) => (
            <p key={achievement}>{achievement}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForceDetails;
