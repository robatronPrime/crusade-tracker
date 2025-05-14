import Link from "next/link";
import { Force } from "../../types/global";
import Image from "next/image";

interface ForceProps {
  force: Force[];
}

const ForceDetails: React.FC<ForceProps> = ({ force }) => {
  return (
    <div className={"col-span-12 px-4 lg:px-8 text-xs lg:text-base"}>
      {/* ── Tally overview ───────────────────────────── */}
      <div className="col-span-7 flex justify-around gap-4 mb-4 flex-wrap">
        <div className="flex gap-4 items-center">
          <p className="font-bold">Battle Tally</p>
          {/* <p>{force.battleTally}</p> */}
        </div>
        <div className="flex gap-4 items-center">
          <p className="font-bold">Victories</p>
          {/* <p>{force.victories}</p> */}
        </div>
        <div className="flex gap-4 items-center">
          <p className="font-bold">Requisition Points</p>
          {/* <p>{force.requisitionPoints}</p> */}
        </div>
      </div>

      <div className="col-span-10 grid grid-cols-12 gap-4 my-8">
        {/* ── Unit rows ──────────────────────────────── */}
        <p className="">Units</p>
        {/* {force.units.map((unit, idx) => (
                          <div key={unit.id} className="col-span-12 grid grid-cols-12 gap-4 w-full">
                            <div className="col-span-7 lg:col-span-8 flex items-end">
                              <p>{unit.name}</p>
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
                            <Link className="col-span-2 lg:col-span-1 opacity-70 hover:opacity-100" href={""}>
                              <Image
                                src="/images/filled/arrow-big-right.svg"
                                alt="arrow right"
                                width="20"
                                height="20"
                              />
                            </Link>
                          </div>
                        ))} */}
      </div>

      {/* ── Record of Achievement Column ──────────────────────────────── */}
      <div className="col-span-2 flex flex-col">
        <p>Record of Achievement</p>
        {/* {force.recordOfAchievement?.length == 0 ? <p>No records</p> : ""}
                        {force.recordOfAchievement?.map((achievement) => (
                          <p>{achievement}</p>
                        ))} */}
      </div>
    </div>
  );
};

export default ForceDetails;
