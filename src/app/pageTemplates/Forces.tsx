import { JSX } from "react";
import BackBtn from "@/components/BackBtn";
import ForceTab from "@/components/ForceTab";
import ParchmentCard from "@/components/ParchmentCard";
import BrassButton from "@/components/BrassButton";

type ForceProps = {
  data: CrusadeUser | null;
};

const Forces = ({ data }: ForceProps): JSX.Element => {
  return (
    <>
      <div className="col-span-12 mb-4">
        <BackBtn url="/" />
      </div>

      <div className="col-span-12">
        <ParchmentCard>
          <div className="flex items-center justify-between mb-6 border-b border-brass pb-4">
            <h1 className="font-display text-2xl lg:text-3xl text-ink tracking-widest uppercase">
              Orders of Battle
            </h1>
            <BrassButton href="/createForce">New Force</BrassButton>
          </div>

          {!data || data.forces.length === 0 ? (
            <p className="text-ink/60 text-sm">No forces recorded.</p>
          ) : (
            <ul className="divide-y divide-brass/30">
              {data.forces.map((force: Force, idx: number) => (
                <ForceTab key={idx} forceProps={force} />
              ))}
            </ul>
          )}
        </ParchmentCard>
      </div>
    </>
  );
};

export default Forces;
