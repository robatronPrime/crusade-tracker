"use client";

import { JSX, useState, useTransition } from "react";

type ForceUpdateButtonProps = {
  forceId: string;
  forceName: string;
};

const ForceUpdateButton = ({ forceId, forceName }: ForceUpdateButtonProps): JSX.Element => {
  const [isPending, startTransition] = useTransition();
  const initialState: CreateFormState = { message: "", success: false };
  const [updateState, setUpdateState] = useState<CreateFormState | null>(null);

  const onUpdate = () => {
    if (!window.confirm(`Update "${forceName}"?`)) {
      return;
    }
    startTransition(async () => {
      const result = await updateForceById(forceId, forceName);
      if (!result.success) {        
        setUpdateState(result);
      } else {
        setUpdateState(null);
      }
    });
  };

  return (
    <div className="mt-10">
      <button
        onClick={onUpdate}
        disabled={isPending}
        className="bg-ink text-bg px-4 py-2 rounded-md hover:bg-ink/80 transition-colors"
      >
        {isPending ? "Updating..." : "Update"}
      </button>
      {updateState && updateState.message && (
        <p className="text-sm text-red-500">{updateState.message}</p>
      )}
    </div>
  );
};

export default ForceUpdateButton; 
