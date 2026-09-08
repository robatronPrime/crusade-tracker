"use client";

import { useEffect, useState } from "react";
import type { OpenHammerUnitSummary } from "@/lib/openhammer";
import { isLinkedUnitType } from "@/lib/codex";

type DatasheetPickerProps = {
  edition: string;
  faction: string;
  typeValue: string;
  disabled?: boolean;
  onLinked: (sheet: OpenHammerUnitSummary) => void;
  onUnlink: () => void;
};

const DatasheetPicker = ({
  edition,
  faction,
  typeValue,
  disabled,
  onLinked,
  onUnlink
}: DatasheetPickerProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [units, setUnits] = useState<OpenHammerUnitSummary[]>([]);
  const [error, setError] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!edition.trim() || !faction.trim()) {
      setUnits([]);
      setError(false);
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({
      edition,
      faction,
      name: debouncedQuery
    });

    fetch(`/api/openhammer/units?${params.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("unavailable");
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data?.units) ? data.units : [];
        setUnits(list.slice(0, 50));
        setError(false);
      })
      .catch((err: { name?: string }) => {
        if (err?.name === "AbortError") return;
        setError(true);
        setUnits([]);
      });

    return () => controller.abort();
  }, [edition, faction, debouncedQuery, retryNonce]);

  const linked = isLinkedUnitType(typeValue);

  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1 text-ink">
        <span className="text-xs uppercase tracking-widest text-ink/60">Datasheet</span>
        <input
          type="search"
          value={query}
          disabled={disabled}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search datasheets"
          className="bg-parchment border border-brass text-ink px-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-brass disabled:opacity-50"
        />
      </label>

      {linked && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink">Linked</span>
          <button
            type="button"
            disabled={disabled}
            onClick={onUnlink}
            className="text-brass text-sm underline hover:text-brass-hover disabled:opacity-50"
          >
            Unlink
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 text-sm">
          <p className="text-danger">Datasheet service unavailable</p>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setRetryNonce((n) => n + 1)}
            className="text-brass underline hover:text-brass-hover disabled:opacity-50"
          >
            Retry
          </button>
        </div>
      )}

      {!error && units.length > 0 && (
        <div className="flex flex-col gap-1 max-h-56 overflow-y-auto">
          {units.map((sheet) => (
            <button
              key={sheet.id}
              type="button"
              disabled={disabled}
              onClick={() => onLinked(sheet)}
              className="text-left text-sm px-3 py-1.5 rounded border border-brass/30 hover:bg-brass/20 disabled:opacity-50"
            >
              {sheet.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatasheetPicker;
