import "./globals.css";
import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Crusade Tracker",
  description: "Track your Warhammer 40,000 Crusade forces and Orders of Battle."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  // Create user in DB
  if (user) {
    try {
      const res = await fetch(`${process.env.LOCALHOST}/api/users`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          clerkID: user.id,
          forces: []
        })
      });

      const data = await res.json();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased`}>
          <header className="flex justify-end bg-gray-100 p-4 text-black gap-4">
            <SignedIn>
              <p>Welcome, {user?.firstName}</p>
              <UserButton />
            </SignedIn>
          </header>
          <section className="bg-gray-100 text-black grid grid-cols-12 gap-4 lg:gap-8 px-4 lg:px-8">
            <div className="pt-8 col-span-12 min-h-screen">{children}</div>
          </section>
        </body>
      </html>
    </ClerkProvider>
  );
}
