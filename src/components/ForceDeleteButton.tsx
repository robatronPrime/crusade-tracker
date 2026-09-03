"use client";

import { useState, useTransition } from "react";
import { deleteForce } from "@/app/actions";

type ForceDeleteButtonProps = {
  forceId: string;
  forceName: string;
};

const ForceDeleteButton = ({ forceId, forceName }: ForceDeleteButtonProps): JSX.Element => {
  const [isPending, startTransition] = useTransition();
  const [deleteState, setDeleteState] = useState<CreateFormState | null>(null);

  const onDelete = () => {
    if (!window.confirm(`Delete "${forceName}"? All units in this Order of Battle will be removed.`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteForce(forceId);
      if (!result.success) {
        setDeleteState(result);
      } else {
        setDeleteState(null);
      }
    });
  };

  return (
    <div className="col-span-12 mt-8">
      {deleteState && !deleteState.success && deleteState.message !== "" && (
        <div className="col-span-12 bg-red-300 mb-4">{deleteState.message}</div>
      )}
      <button
        type="button"
        className="underline"
        disabled={isPending || !forceId}
        onClick={onDelete}
      >
        Delete Order of Battle
      </button>
    </div>
  );
};

export default ForceDeleteButton;
