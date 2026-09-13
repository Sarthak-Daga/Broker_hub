"use client";

import { useState } from "react";
import ClientForm from "./ClientForm";

export default function ContactModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Add Contact Button */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium
                   text-white transition hover:bg-blue-500"
      >
        + Add Contact
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div
            className="relative w-full max-w-lg rounded-xl border
                       border-slate-800 bg-slate-900 p-6 shadow-xl"
          >

            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Add Contact
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Add a new general business contact.
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-1 text-xl text-slate-400
                           transition hover:bg-slate-800 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <ClientForm
              onSuccess={() => setOpen(false)}
            />

          </div>
        </div>
      )}
    </>
  );
}