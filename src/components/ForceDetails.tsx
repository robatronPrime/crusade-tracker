import { JSX } from "react";

interface ForceProps {
  forceProps: Force;
}

const ForceDetails = ({ forceProps }: ForceProps): JSX.Element => {
  const { id, name, userId, victories, units, supplyUsed, supplyLimit, battleTally, requisitionPoints, recordOfAchievement } = forceProps;

  return (
    <div className="col-span-12 px-4 lg:p-8 text-xs lg:text-base relative">
      <div className={"col-span-12 px-4 lg:p-8 text-xs lg:text-base"}>
        <h1 className="mb-8 text-4xl font-bold">{name}</h1>
        
        {/* ── Tally overview ───────────────────────────── */}
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
        </div>

        <div className="col-span-10 grid grid-cols-12 gap-4 my-8">
          {/* ── Unit rows ──────────────────────────────── */}
          <div className="col-span-12 grid grid-cols-12 gap-4 w-full">
            <div className="col-span-7 lg:col-span-8 flex items-end">
              <p className="font-bold">Units</p>
            </div>
            <div className="col-span-1 text-center flex justify-center items-end">
              <p className="font-bold">XP</p>
            </div>
            <div className="col-span-1 text-center flex justify-center items-end">
              <p className="font-bold">Points Value</p>
            </div>
            <div className="col-span-1 text-center flex justify-center items-end">
              <p className="font-bold">Model Count</p>
            </div>
            <div className="col-span-1 text-center flex justify-center items-end">
              <p className="font-bold">Crusade Points</p>
            </div>
          </div>
          {units && units.map((unit: Unit) => (
            <div key={unit.id} className="col-span-12 grid grid-cols-12 gap-4 w-full">
              <div className="col-span-7 lg:col-span-8 flex items-end">
                <p>{unit.unitName}</p>
              </div>
              <div className="col-span-1 text-center flex justify-center items-end">
                <p>{unit.xp}</p>
              </div>
              <div className="col-span-1 text-center flex justify-center items-end">
                <p>{unit.pointsValue}</p>
              </div>
              <div className="col-span-1 text-center flex justify-center items-end">
                <p>{unit.modelCount}</p>
              </div>
              <div className="col-span-1 text-center flex justify-center items-end">
                <p>{unit.crusadePoints}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Record of Achievement Column ──────────────────────────────── */}
        <div className="col-span-2 flex flex-col">
          <p>Record of Achievement</p>
          {recordOfAchievement?.length == 0 ? <p>No records</p> : ""}
          {recordOfAchievement?.map((achievement) => (
            <p>{achievement}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForceDetails;
