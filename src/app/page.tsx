import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="col-span-12 flex flex-col justify-center items-center text-center min-h-[70vh] gap-6">
      <h1 className="font-display text-5xl lg:text-6xl text-parchment tracking-widest uppercase">
        Crusade Tracker
      </h1>
      <p className="text-parchment/70 text-sm lg:text-base max-w-sm">
        Build and track your Warhammer 40,000 Crusade forces.
      </p>

      <nav className="flex gap-4 mt-4">
        <SignedOut>
          <span className="inline-block bg-brass text-ink font-bold px-5 py-2 rounded uppercase tracking-widest text-sm hover:bg-brass-hover transition-colors cursor-pointer">
            <SignInButton />
          </span>
          <span className="inline-block border border-brass text-brass font-bold px-5 py-2 rounded uppercase tracking-widest text-sm hover:bg-brass/10 transition-colors cursor-pointer">
            <SignUpButton />
          </span>
        </SignedOut>
        <SignedIn>
          <Link
            href="/forces"
            className="inline-block bg-brass text-ink font-bold px-5 py-2 rounded uppercase tracking-widest text-sm hover:bg-brass-hover transition-colors"
          >
            Orders of Battle
          </Link>
        </SignedIn>
      </nav>
    </div>
  );
}
