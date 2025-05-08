import { Forces, Forces } from "../models/forces";

export default async function Forces() {
  const response = await fetch("http://localhost:5050/forces");
  const data = await response.json();
  console.log(data);
  

  return (
    <>
      {data.map((force : Forces) => (
        <div key={force.id} className="grid grid-cols-12 gap-4 lg:gap-8">
          <div className="col-span-5 py-4">
            <h2 className="text-2xl">{force.name}</h2>
            <div className="w-full h-0.5 bg-black opacity-35"></div>
            <h3 className="">Crusade force</h3>

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
              <p>Requesition Points</p>
              <p>{force.requisitionPoints}</p>
            </div>
          </div>

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

            {force.units.map((unit, idx) => (
              <div key={unit.id} className="col-span-12 grid grid-cols-12 gap-4 w-full">
                <div className="col-span-6 flex items-end">
                  <p>{unit.name}</p>
                </div>
                <div className="col-span-2 text-center flex justify-center items-end">
                  <p>{unit.crusadePoints}</p>
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
        </div>
      ))}
    </>
  );
}
