"use client";

import { useState } from "react";
import { toPost } from "./action";

type Props = {
  followUpId: number;
};

function getCurrentDateTime() {
  const now = new Date();

  const offset = now.getTimezoneOffset();
  const localNow = new Date(now.getTime() - offset * 60 * 1000);

  return localNow.toISOString().slice(0, 16);
}

export default function PostponeModal({ followUpId }: Props) {
  const [open, setOpen] = useState(false);

  function closeModal() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-amber-900/50 bg-amber-950/30 px-3 py-1.5 text-xs font-medium text-amber-400 transition hover:bg-amber-900/40"
      >
        ↻ Postpone
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 shadow-xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Postpone Follow-up
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  When should this follow-up happen?
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-xl text-slate-500 transition hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form
              action={async (formData) => {
                await toPost(formData);
                closeModal();
              }}
              className="space-y-5 p-6"
            >
              <input
                type="hidden"
                name="FollowUpId"
                value={followUpId}
              />

              <div>
                <label
                  htmlFor={`postpone-${followUpId}`}
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  New Date & Time
                </label>

                <input
                  id={`postpone-${followUpId}`}
                  type="datetime-local"
                  name="DateTime"
                  min={getCurrentDateTime()}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500"
                >
                  Postpone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}