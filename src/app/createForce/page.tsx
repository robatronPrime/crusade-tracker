// src/app/createForce/page.tsx
import React from "react";
import ForceForm from "@/components/ForceForm";
import PageHeader from "@/components/PageHeader";
import { currentUser } from "@clerk/nextjs/server";

export default async function CreateForcePage() {
  const user = await currentUser();

  return (
    <>
      <PageHeader title="New Order of Battle" backHref="/forces" backLabel="← Orders of Battle" />
      <div className="col-span-12">
        <ForceForm userId={user ? user.id : ""} />
      </div>
    </>
  );
}
