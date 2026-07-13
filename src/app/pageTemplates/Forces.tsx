import { JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import BackBtn from "@/components/BackBtn";
import ForceTab from "@/components/ForceTab";

type ForceProps = {
  data: CrusadeUser | null;
}

const Forces = ({ data }: ForceProps): JSX.Element => {    
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
            {data && data.forces.map((force: Force, idx: number) => <ForceTab key={idx} forceProps={force} />)}
        </>
    )
}

export default Forces;