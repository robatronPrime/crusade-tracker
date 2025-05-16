"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Force } from "../../types/global";
import Image from "next/image";
import BackBtn from "./BackBtn";

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
      <div className="absolute top-4 left-4">
        <BackBtn url="/" />
      </div>
      <div className="fixed bottom-8 right-8 hover:scale-105 transition-all duration-150 ease-out ">
        <Link className="cursor-pointer" href={"/createForce"}>
          <div className="flex justify-end bg-yellow-400 text-white p-4 rounded-full">
            <Image src="/images/outline/plus.svg" alt="plus" width="20" height="20" />
          </div>
        </Link>
      </div>
      <h1 className="text-3xl lg:text-4xl font-bold">Orders of Battle</h1>
      {data
        ? data.map((force) => (
            <div key={force.id} className="grid grid-cols-12 gap-4 lg:gap-8 my-8">
              <Link className="col-span-12" href={`/forces/${force._id}`}>
                <div
                  className={`flex justify-between gap-4 py-4 px-4 bg-yellow-400 rounded-2xl text-start hover:py-5 transition-all duration-150 ease-out`}
                >
                  <div>
                    <h2 className="lg:text-3xl font-bold">{force.name}</h2>

                    <div className="flex justify-between gap-4 lg:w-60 my-4 text-xs lg:text-base">
                      <p className="font-bold">Supply Limit</p>
                      <p>{force.supplyLimit}</p>
                    </div>

                    <div className="flex justify-between gap-4 lg:w-60 text-xs lg:text-base">
                      <p className="font-bold">Supply Used</p>
                      <p>{force.supplyUsed}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 justify-center">
                    <div className="flex gap-4 items-center justify-between text-xs lg:text-base">
                      <p className="font-bold">Battle Tally</p>
                      <p>{force.battleTally}</p>
                    </div>
                    <div className="flex gap-4 items-center justify-between text-xs lg:text-base">
                      <p className="font-bold">Victories</p>
                      <p>{force.victories}</p>
                    </div>
                    <div className="flex gap-4 items-center justify-between text-xs lg:text-base">
                      <p className="font-bold">Requisition Points</p>
                      <p>{force.requisitionPoints}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        : ""}
    </>
  );
};

export default ForceTab;
