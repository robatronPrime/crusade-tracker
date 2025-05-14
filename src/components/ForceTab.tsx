"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Force } from "../../types/global";

interface ForceProps {
  data: Force[];
}

const ForceTab: React.FC<ForceProps> = ({ data }) => {
  const [editMode, setEditMode] = useState<boolean>(false);

  const enterEditMode = () => {
    setEditMode(true);
  };

  const saveEdit = () => {
    setEditMode(false);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8">
        <div className="flex justify-end bg-gray-950 text-white p-4 rounded-full">
          <Link className="cursor-pointer" href={"/createForce"}>
            plus
          </Link>
        </div>
      </div>
      <h1 className="text-3xl lg:text-4xl font-bold">Orders of Battle</h1>
      {data
        ? data.map((force) => (
            <div key={force.id} className="grid grid-cols-12 gap-4 lg:gap-8 my-8">
              {/* ── Force header ─────────────────────────────── */}
              <div
                className={`col-span-12 py-4 flex justify-around flex-col gap-4 bg-gray-300 opacity-80 rounded-2xl transition-opacity text-start px-4`}
              >
                <div>
                  <h2 className="lg:text-3xl">{force.name}</h2>
                  <h3 className="lg:text-2xl">Crusade force</h3>
                </div>

                <div className="flex flex-row-reverse justify-end gap-4 lg:w-60 bg-gray-50 px-2 rounded-sm text-xs lg:text-base">
                  <p>{force.supplyLimit}</p>
                  <p>Supply Limit</p>
                </div>

                <div className="flex flex-row-reverse justify-end gap-4 lg:w-60 bg-gray-50 px-2 rounded-sm text-xs lg:text-base">
                  <p>{force.supplyUsed}</p>
                  <p>Supply Used</p>
                </div>

                <div className="col-span-7 flex justify-around gap-4 mb-4 flex-wrap">
                  <div className="flex gap-4 items-center">
                    <p className="font-bold">Battle Tally</p>
                    <p>{force.battleTally}</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <p className="font-bold">Victories</p>
                    <p>{force.victories}</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <p className="font-bold">Requisition Points</p>
                    <p>{force.requisitionPoints}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        : ""}
    </>
  );
};

export default ForceTab;
