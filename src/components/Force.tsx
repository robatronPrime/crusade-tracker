'use client'
import React, { useState } from "react";
import { Forces } from "@/models/forces";
import Link from "next/link";

interface ForceProps {
  data: Forces[];
}

const Force: React.FC<ForceProps> = ({ data }) => {
  const [editMode, setEditMode] = useState(false);

  const enterEditMode = () => {
    setEditMode(true);
  }

  const saveEdit = () => {
    setEditMode(false);
  }

  return (
    <>
      {/* <div className="fixed bottom-8 right-8">
        <div className="flex justify-end bg-gray-950 text-white p-4 rounded-full">
          <Link className="cursor-pointer" href={"/createForce"}>Edit</Link>
        </div>
      </div> */}
      {data.map((force) => (
        <div
          key={force.id}
          className="grid grid-cols-12 gap-4 lg:gap-8"
        >
          {/* ── Force header ─────────────────────────────── */}
          <div className="col-span-5 py-4">
            <h2 className="text-2xl">{force.name}</h2>
            <div className="w-full h-0.5 bg-black opacity-35" />
            <h3>Crusade force</h3>

            <div className="w-full flex justify-between mt-4">
              <div>
                <p>{force.supplyLimit}</p>
                <p>Supply Limit</p>
              </div>

              <div>
                <p>{force.supplyUsed}</p>
                <p>Supply Used</p>
              </div>
            </div>
          </div>

          {/* ── Tally overview ───────────────────────────── */}
          <div className="col-span-7 flex justify-around gap-4">
            <div className="flex flex-col gap-4 justify-center text-center">
              <p>Battle Tally</p>
              <p>{force.battleTally}</p>
            </div>
            <div className="flex flex-col gap-4 justify-center text-center">
              <p>Victories</p>
              <p>{force.victories}</p>
            </div>
            <div className="flex flex-col gap-4 justify-center text-center">
              <p>Requisition Points</p>
              <p>{force.requisitionPoints}</p>
            </div>
          </div>

          {/* ── Units table header ───────────────────────── */}
          <div className="col-span-10 grid grid-cols-12 gap-4">
            <div className="col-span-6 flex items-end">
              <p>Unit Name</p>
            </div>
            <div className="col-span-2 text-center flex justify-center items-end">
              <p>Points Value</p>
            </div>
            <div className="col-span-2 text-center flex justify-center items-end">
              <p>Number of Models</p>
            </div>
            <div className="col-span-2 text-center flex justify-center items-end">
              <p>Crusade Points</p>
            </div>

            {/* ── Unit rows ──────────────────────────────── */}
            {force.units.map((unit) => (
              <div
                key={unit.id}
                className="col-span-12 grid grid-cols-12 gap-4 w-full"
              >
                <div className="col-span-6 flex items-end">
                  <p>{unit.name}</p>
                </div>
                <div className="col-span-2 text-center flex justify-center items-end">
                  <p>{unit.pointsValue}</p>
                </div>
                <div className="col-span-2 text-center flex justify-center items-end">
                  <p>{unit.modelCount}</p>
                </div>
                <div className="col-span-2 text-center flex justify-center items-end">
                  <p>{unit.crusadePoints}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Record of Achievement Column ──────────────────────────────── */}
          <div className="col-span-2 flex flex-col">
            <p>Record of Achievement</p>
            {force.recordOfAchivement.map(achievement => (
              <p>{achievement}</p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default Force;
