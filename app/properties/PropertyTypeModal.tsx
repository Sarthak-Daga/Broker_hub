"use client";

import { useState } from "react";
import FlatForm from "./FlatForm";

type Area = {
  id: number;
  name: string;
};

type Colony = {
  id: number;
  name: string;
  areaId: number;
};


type PropertyTypeModalProps = {
  areas: Area[];
  colonies: Colony[];
};

export default function PropertyTypeModal({
  areas,
  colonies,
}: PropertyTypeModalProps) {
  const [open, setOpen] = useState(false);
  const [propertyType, setPropertyType] = useState<
    "flat" | "land" | null
  >(null);

  function closeModal() {
    setOpen(false);
    setPropertyType(null);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
      >
        + Add Property
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
              {propertyType ? "Property Details" : "Property Type"}
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              {propertyType === "flat"
                ? "Add Flat"
                : propertyType === "land"
                  ? "Add Plot / Land"
                  : "Add Property"}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {propertyType === "flat"
                ? "Select the flat you want to add."
                : propertyType === "land"
                  ? "Add an independent plot or piece of land."
                  : "What type of property are you adding?"}
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

        {/* Property Type Selection */}
        {!propertyType && (
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Flat */}
            <button
              type="button"
              onClick={() => setPropertyType("flat")}
              className="group rounded-xl border border-slate-800 bg-slate-950 p-6 text-left transition hover:border-blue-500 hover:bg-slate-950/80"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-2xl">
                🏢
              </div>

              <h3 className="font-semibold">
                Flat / Apartment
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add a flat inside an area, colony, wing and floor.
              </p>

              <div className="mt-4 text-sm text-blue-400">
                Select →
              </div>
            </button>

            {/* Land */}
            <button
              type="button"
              onClick={() => setPropertyType("land")}
              className="group rounded-xl border border-slate-800 bg-slate-950 p-6 text-left transition hover:border-blue-500 hover:bg-slate-950/80"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-2xl">
                🏞️
              </div>

              <h3 className="font-semibold">
                Plot / Land
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add independent land using location and dimensions.
              </p>

              <div className="mt-4 text-sm text-blue-400">
                Select →
              </div>
            </button>

          </div>
        )}

        {/* Flat Form */}
        {propertyType === "flat" && (
          <>
            <FlatForm
              areas={areas}
              colonies={colonies}
            />

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-5">
              <button
                type="button"
                onClick={() => setPropertyType(null)}
                className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                Back
              </button>

              <button
                type="button"
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {/* Land - temporary */}
        {propertyType === "land" && (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-8 text-center">
            <div className="text-4xl">🏞️</div>

            <p className="mt-3 text-sm text-slate-400">
              Plot / Land form coming next.
            </p>

            <button
              type="button"
              onClick={() => setPropertyType(null)}
              className="mt-4 text-sm text-blue-400 hover:text-blue-300"
            >
              ← Back
            </button>
          </div>
        )}

      </div>
    </div>
  );
}