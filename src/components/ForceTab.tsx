"use client";

import ForceDetails from "./ForceDetails";
import ParchmentCard from "./ParchmentCard";
import React, { JSX, useState } from "react";

type ForceProps = {
  forceProps: Force;
};

const ForceTab = ({ forceProps }: ForceProps): JSX.Element => {
  const { name, supplyUsed, supplyLimit } = forceProps;
  const [detailsMode, setDetailsMode] = useState<boolean>(false);

  if (detailsMode) {
    return (
      <li className="list-none">
        <ParchmentCard>
          <button
            type="button"
            onClick={() => setDetailsMode(false)}
            className="text-brass text-sm hover:text-brass-hover transition-colors mb-6 block"
          >
            ← Orders of Battle
          </button>
          <ForceDetails forceProps={forceProps} />
        </ParchmentCard>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        className="w-full flex justify-between items-center py-3 px-1 text-left hover:bg-parchment-hover transition-colors"
        onClick={() => setDetailsMode(true)}
      >
        <span className="font-bold text-ink">{name}</span>
        <span className="text-ink/60 text-sm">
          {supplyUsed ?? 0} / {supplyLimit} pts
        </span>
      </button>
    </li>
  );
};

export default ForceTab;
