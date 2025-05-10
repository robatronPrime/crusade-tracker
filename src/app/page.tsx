import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { auth, currentUser } from '@clerk/nextjs/server'

export default async function Home() {
  const { userId } = await auth()

  return (
    <div className="flex justify-center items-center flex-col text-center h-full">
      <h1 className="text-4xl">Crusade Tracker</h1>
      <h2 className="mb-8">Web app built to create and track 40k crusade forces</h2>

      <nav className="col-span-2 flex flex-row gap-4 lg:gap-8 px-4 py-8">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        {userId ? (
          <Link href={"/forces"}>Order of Battle</Link>
        ) : (
          <p>Sign in to access your Orders of battle</p>
        )}
      </nav>
    </div>
  );
}
