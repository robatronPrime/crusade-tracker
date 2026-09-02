import React from "react";
import ForceForm from "@/components/ForceForm";
import { currentUser } from "@clerk/nextjs/server";

export default async function CreateForcePage() {
  const user = await currentUser();
  
  return <ForceForm userId={user ? user.id : ""} />;
}
