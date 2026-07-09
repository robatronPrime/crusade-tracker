import { JSX } from "react";
import Link from "next/link";
import Image from "next/image";

interface BackBtnProps {
  url?: string;
  onClick? : any;
}

const BackBtn = ({ url, onClick }: BackBtnProps): JSX.Element => {
  if (url) {
    return (
      <Link href={url}>
        <div className="flex justify-end bg-yellow-400 hover:scale-105 transition-all duration-150 ease-out text-white p-2 rounded-full">
          <Image src="/images/filled/arrow-big-left.svg" alt="arrow left" width="20" height="20" />
        </div>
      </Link>
    );
  } else if (onClick) {
    return (
      <button onClick={onClick}>
        <div className="flex justify-end bg-yellow-400 hover:scale-105 transition-all duration-150 ease-out text-white p-2 rounded-full">
          <Image src="/images/filled/arrow-big-left.svg" alt="arrow left" width="20" height="20" />
        </div>
      </button>
    );
  } else {
    return <></>;
  }
};

export default BackBtn;
