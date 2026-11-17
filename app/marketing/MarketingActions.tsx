"use client";

import { useState } from "react";
import { updateLeadStatus, deleteLead, assignEmployee } from "./action";

type Status = "NONE" | "CALLED_NOT_VISITED" | "VISITED" | "NOT_INTERESTED";

export default function MarketingActions({
  leadId,
  status,
}: {
  leadId: number;
  status: Status;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const nextStatuses: Record<Status, Status[]> = {
    NONE: ["CALLED_NOT_VISITED"],
    CALLED_NOT_VISITED: ["VISITED"],
    VISITED: ["NOT_INTERESTED"],
    NOT_INTERESTED: [],
  };

  const canMoveForward = nextStatuses[status].length > 0;

  async function handleStatusChange(nextStatus: Status) {
    setError("");
    try {
      const form = new FormData();
      form.append("leadId", String(leadId));
      form.append("status", nextStatus);
      await updateLeadStatus(form);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this marketing lead? This cannot be undone.")) {
      return;
    }

    setError("");
    try {
      const form = new FormData();
      form.append("leadId", String(leadId));
      await deleteLead(form);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lead.");
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800 hover:text-white"
      >
        Actions
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-xl">
          {error && (
            <div className="border-b border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="p-1">
            <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
              Move Status
            </p>

            {canMoveForward ? (
              nextStatuses[status].map((nextStatus) => (
                <button
                  key={nextStatus}
                  type="button"
                  onClick={() => handleStatusChange(nextStatus)}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  → {nextStatus.replace(/_/g, " ")}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-xs text-slate-500">
                No further status transitions available.
              </p>
            )}

            <div className="my-1 h-px bg-slate-800" />

            <button
              type="button"
              onClick={handleDelete}
              className="w-full rounded-md px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-950/40"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}