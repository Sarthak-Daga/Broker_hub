"use client";

import { deleteFollowUp ,toCan, toDone } from "./action";
import PostponeModal from "./PostponeModal";
import PendingModal from "./pendingModal";

type Props = {
  followUpId: number;
  status: string;
};

export default function FollowUpActions({
  followUpId,
  status,
}: Props) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">

      {/* PENDING */}
      {status === "PENDING" && (
        <>
          <form action={toDone}>
            <input
              type="hidden"
              name="FollowUpId"
              value={followUpId}
            />

            <button
              type="submit"
              className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-900/40"
            >
              ✓ Done
            </button>
          </form>

          <PostponeModal followUpId={followUpId} />

          <form action={toCan}>
            <input
              type="hidden"
              name="FollowUpId"
              value={followUpId}
            />

            <button
              type="submit"
              className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-900/40"
            >
              × Cancel
            </button>
          </form>
        </>
      )}

      {/* POSTPONED */}
      {status === "POSTPONED" && (
        <>
          <PostponeModal followUpId={followUpId} />

          <PendingModal followUpId={followUpId} />

          <form action={toCan}>
            <input
              type="hidden"
              name="FollowUpId"
              value={followUpId}
            />

            <button
              type="submit"
              className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-900/40"
            >
              × Cancel
            </button>
          </form>
        </>
      )}

      {/* CANCELLED */}
      {status === "CANCELLED" && (
        <form action={deleteFollowUp}>
          <input
            type="hidden"
            name="FollowUpId"
            value={followUpId}
          />
      
          <button
            type="submit"
            className="rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-900/30"
          >
            Delete
          </button>
        </form>
      )}

      {/* DONE */}
      {status === "DONE" && (
        <form action={deleteFollowUp}>
          <input
            type="hidden"
            name="FollowUpId"
            value={followUpId}
          />
      
          <button
            type="submit"
            className="rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-900/30"
          >
            Delete
          </button>
        </form>
      )}
    </div>
  );
}