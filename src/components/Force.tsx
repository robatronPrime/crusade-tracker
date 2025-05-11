'use client'
import React, { useState } from "react";
import { Forces } from "@/models/forces";
import Link from "next/link";
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from "@headlessui/react";
import Image from "next/image";
import arrowBigRightOutline from "/public/outline/arrow-big-right.svg"

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
      <h1 className="text-3xl lg:text-4xl">Your Orders of Battle</h1>
      {data.map((force) => (
          <Disclosure as="div" key={force.id} className="grid grid-cols-12 gap-4 lg:gap-8 my-8">
            {({ open }) => (
              <>
                {/* ── Force header ─────────────────────────────── */}
                <DisclosureButton as="div" className={`col-span-12 py-4 flex justify-around flex-col lg:flex-row gap-4 bg-blue-300 opacity-80 rounded-2xl transition-opacity text-start px-4 ${open ? "opacity-100" : "hover:opacity-100"}`}>
                  <div>
                    <h2 className="lgtext-3xl">{force.name}</h2>
                    <h3 className="lg:text-2xl">Crusade force</h3>
                  </div>

                  <div className="flex flex-row-reverse justify-end lg:flex-col gap-4 lg:w-20 bg-gray-50 px-2 rounded-sm">
                    <p>{force.supplyLimit}</p>
                    <p>Supply Limit</p>
                  </div>

                  <div className="flex flex-row-reverse justify-end ld:flex-col gap-4 lg:w-20 bg-gray-50 px-2 rounded-sm">
                    <p>{force.supplyUsed}</p>
                    <p>Supply Used</p>
                  </div>
                </DisclosureButton>

                <Transition 
                  show={open}
                  enter="transition-opacity duration-150"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <DisclosurePanel as="div" className={"col-span-12 px-4 lg:px-8"}>
                    {/* ── Tally overview ───────────────────────────── */}
                    <div className="col-span-7 flex justify-around gap-4 mb-4 flex-wrap">
                      <div className="flex gap-4 items-center">
                        <p>Battle Tally</p>
                        <p>{force.battleTally}</p>
                      </div>
                      <div className="flex gap-4 items-center">
                        <p>Victories</p>
                        <p>{force.victories}</p>
                      </div>
                      <div className="flex gap-4 items-center">
                        <p>Requisition Points</p>
                        <p>{force.requisitionPoints}</p>
                      </div>
                    </div>

                    <div className="col-span-10 grid grid-cols-12 gap-4 my-8">
                      {/* ── Unit rows ──────────────────────────────── */}
                      <p className="">Units</p>
                      {force.units.map((unit, idx) => (
                        <div
                          key={unit.id}
                          className="col-span-12 grid grid-cols-12 gap-4 w-full"
                        >
                          <div className="col-span-8 flex items-end">
                            <p>{unit.name}</p>
                          </div>
                          <div className="col-span-1 text-center flex justify-center items-end">
                            <p>{unit.pointsValue}</p>
                          </div>
                          <div className="col-span-1 text-center flex justify-center items-end">
                            <p>{unit.modelCount}</p>
                          </div>
                          <div className=" text-center flex justify-center items-end">
                            <p>{unit.crusadePoints}</p>
                          </div>
                          <Link className="col-span-1" href={""}>
                            <Image src={arrowBigRightOutline} alt="arrow right" width="20" height="20" />
                          </Link>
                        </div>
                      ))}
                    </div>

                    {/* ── Record of Achievement Column ──────────────────────────────── */}
                    <div className="col-span-2 flex flex-col">
                      <p>Record of Achievement</p>
                      {force.recordOfAchievement.length == 0 ? (
                        <p>No records</p>
                      ) : ""}
                      {force.recordOfAchievement?.map(achievement => (
                        <p>{achievement}</p>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Transition>
              </>
            )}
          </Disclosure>
      ))}
    </>
  );
};

export default Force;
