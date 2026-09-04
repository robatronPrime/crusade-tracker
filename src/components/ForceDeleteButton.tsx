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
    <div className="mt-10">
      {deleteState && !deleteState.success && deleteState.message !== "" && (
        <div className="bg-danger/20 text-danger border border-danger rounded px-4 py-2 mb-4 text-sm">
          {deleteState.message}
        </div>
      )}
      <button
        type="button"
        className="text-danger text-sm underline hover:text-danger-hover transition-colors disabled:opacity-50"
        disabled={isPending || !forceId}
        onClick={onDelete}
      >
        Delete Order of Battle
      </button>
    </div>
  );
};

export default ForceDeleteButton;
