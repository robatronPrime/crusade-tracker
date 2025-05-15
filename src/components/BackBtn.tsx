import Image from "next/image";
import Link from "next/link";

interface BackBtnProps {
  url: string;
}

const BackBtn: React.FC<BackBtnProps> = ({ url }) => {
  return (
    <Link href={url}>
      <div className="flex justify-end bg-yellow-400 hover:scale-105 transition-all duration-150 ease-out text-white p-2 rounded-full">
        <Image src="/images/filled/arrow-big-left.svg" alt="arrow left" width="20" height="20" />
      </div>
    </Link>
  );
};

export default BackBtn;
