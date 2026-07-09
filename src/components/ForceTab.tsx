"use client";

import BackBtn from "./BackBtn";
import ForceDetails from "./ForceDetails";
import React, { JSX, useState } from "react";

type ForceProps = {
  forceProps: Force
}

const ForceTab = ({ forceProps }: ForceProps): JSX.Element => {  
  const { id, name, userId, victories, units, supplyUsed, supplyLimit, battleTally, requisitionPoints, recordOfAchievement } = forceProps;
  const [editMode, setEditMode] = useState<boolean>(false);
  const [detailsMode, setDetailsMode] = useState<boolean>(false);

  const enterDetailsMode = () => {
    setDetailsMode(true);
  };
  
  const enterEditMode = () => {
    setEditMode(true);
  };

  const saveEdit = () => {
    setEditMode(false);
  };

  const exitDetailsMode = () => {
    setDetailsMode(false);
  };
  
  return (
    <>
    <div className="grid grid-cols-12 gap-4 bg-yellow-400 rounded-2xl lg:gap-x-8 lg:gap-y-1 my-8">
      {!detailsMode && (
        <button className="col-span-12" onClick={enterDetailsMode}>
          <div
            className={`flex justify-between gap-4 py-4 px-4 text-start hover:py-5 transition-all duration-150 ease-out`}
          >
            <div>
              <h2 className="lg:text-3xl font-bold">{name}</h2>

              <div className="flex justify-between gap-4 lg:w-60 my-4 text-xs lg:text-base">
                <p className="font-bold">Supply Limit</p>
                <p>{supplyLimit}</p>
              </div>

              <div className="flex justify-between gap-4 lg:w-60 text-xs lg:text-base">
                <p className="font-bold">Supply Used</p>
                <p>{supplyUsed}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 justify-center">
              <div className="flex gap-4 items-center justify-between text-xs lg:text-base">
                <p className="font-bold">Battle Tally</p>
                <p>{battleTally}</p>
              </div>
              <div className="flex gap-4 items-center justify-between text-xs lg:text-base">
                <p className="font-bold">Victories</p>
                <p>{victories}</p>
              </div>
              <div className="flex gap-4 items-center justify-between text-xs lg:text-base">
                <p className="font-bold">Requisition Points</p>
                <p>{requisitionPoints}</p>
              </div>
            </div>
          </div>
        </button>
      )}
    </div>
    
    {detailsMode && (
      <>
        <div className="grid grid-cols-12 gap-4 border-2 border-yellow-500 bg-grey-100 rounded-2xl lg:gap-x-8 lg:gap-y-1 my-8">
          <div className="flex justify-center w-full p-2">
            <BackBtn onClick={exitDetailsMode} />
          </div>
          <ForceDetails forceProps={forceProps} />
        </div>
      </>
    )}
    </>
  );
};

export default ForceTab;
