"use client";

import { useState } from "react";

type PropertyStructureGeneratorProps = {
  colonyId: number;
  colonyName: string;
  onClose: () => void;
};

type WingConfig = {
  id: string;
  name: string;
  floors: number;
  flatsPerFloor: number;
};

type FlatConfig = {
  id: string;
  flatNumber: string;
  type: string;
  status: "AVAILABLE";
};

type FloorConfig = {
  id: string;
  floorNumber: number;
  flats: FlatConfig[];
};

function getDefaultWingName(index: number) {
  let name = "";

  index += 1;

  while (index > 0) {
    index--;

    name = String.fromCharCode(65 + (index % 26)) + name;
    index = Math.floor(index / 26);
  }

  return name;
}

export default function PropertyStructureGenerator({
  colonyId,
  colonyName,
  onClose,
}: PropertyStructureGeneratorProps) {
  const [wingCount, setWingCount] = useState("1");
  const [step, setStep] = useState<"count" | "wings" | "flats" | "review">(
    "count",
  );
  const [wings, setWings] = useState<WingConfig[]>([]);
  const [floorsByWing, setFloorsByWing] = useState<
    Record<string, FloorConfig[]>
  >({});
  const [selectedWingId, setSelectedWingId] = useState<string | null>(null);
  const [applyAllWingsOpen, setApplyAllWingsOpen] = useState(false);
  const [allWingFloors, setAllWingFloors] = useState("5");
  const [allWingFlatsPerFloor, setAllWingFlatsPerFloor] = useState("4");

  function getReviewSummary() {
    let totalFloors = 0;
    let totalFlats = 0;

    const typeCounts: Record<string, number> = {};

    for (const wing of wings) {
      const floors = floorsByWing[wing.id] ?? [];

      totalFloors += floors.length;

      for (const floor of floors) {
        totalFlats += floor.flats.length;

        for (const flat of floor.flats) {
          typeCounts[flat.type] = (typeCounts[flat.type] ?? 0) + 1;
        }
      }
    }

    return {
      totalFloors,
      totalFlats,
      typeCounts,
    };
  }
  function applyToAllWings() {
    const floors = Number(allWingFloors);
    const flatsPerFloor = Number(allWingFlatsPerFloor);

    if (
      !Number.isInteger(floors) ||
      floors < 1 ||
      !Number.isInteger(flatsPerFloor) ||
      flatsPerFloor < 1
    ) {
      alert("Floors and flats per floor must be at least 1.");
      return;
    }

    setWings((current) =>
      current.map((wing) => ({
        ...wing,
        floors,
        flatsPerFloor,
      })),
    );

    setApplyAllWingsOpen(false);
  }

  function updateAllFlatTypes(type: string) {
    setFloorsByWing((current) => {
      const updated: Record<string, FloorConfig[]> = {};
  
      for (const [wingId, floors] of Object.entries(current)) {
        updated[wingId] = floors.map((floor) => ({
          ...floor,
          flats: floor.flats.map((flat) => ({
            ...flat,
            type,
          })),
        }));
      }
  
      return updated;
    });
  }

  function handleContinue() {
    const count = Number(wingCount);

    if (!Number.isInteger(count) || count < 1) {
      alert("Number of wings must be at least 1.");
      return;
    }

    const generatedWings: WingConfig[] = Array.from(
      { length: count },
      (_, index) => ({
        id: `wing-${index}`,
        name: getDefaultWingName(index),
        floors: 5,
        flatsPerFloor: 4,
      }),
    );

    setWings(generatedWings);
    setStep("wings");
  }

  function generateFloorsForWings() {
    const structure: Record<string, FloorConfig[]> = {};

    for (const wing of wings) {
      structure[wing.id] = Array.from(
        { length: wing.floors },
        (_, floorIndex) => {
          const floorNumber = floorIndex + 1;

          const flats: FlatConfig[] = Array.from(
            { length: wing.flatsPerFloor },
            (_, flatIndex) => {
              const flatPosition = flatIndex + 1;

              return {
                id: `${wing.id}-floor-${floorNumber}-flat-${flatPosition}`,
                flatNumber: `${floorNumber}${String(flatPosition).padStart(2, "0")}`,
                type: "1 BHK",
                status: "AVAILABLE",
              };
            },
          );

          return {
            id: `${wing.id}-floor-${floorNumber}`,
            floorNumber,
            flats,
          };
        },
      );
    }

    setFloorsByWing(structure);
    setSelectedWingId(wings[0]?.id ?? null);
    setStep("flats");
  }
  const selectedWing = wings.find((wing) => wing.id === selectedWingId);

  const selectedFloors = selectedWingId
    ? (floorsByWing[selectedWingId] ?? [])
    : [];
  function updateFlatType(
    wingId: string,
    floorId: string,
    flatId: string,
    type: string,
  ) {
    setFloorsByWing((current) => ({
      ...current,
      [wingId]: current[wingId].map((floor) => {
        if (floor.id !== floorId) {
          return floor;
        }

        return {
          ...floor,
          flats: floor.flats.map((flat) =>
            flat.id === flatId
              ? {
                  ...flat,
                  type,
                }
              : flat,
          ),
        };
      }),
    }));
  }

  function updateFloorFlatTypes(wingId: string, floorId: string, type: string) {
    setFloorsByWing((current) => ({
      ...current,
      [wingId]: current[wingId].map((floor) => {
        if (floor.id !== floorId) {
          return floor;
        }

        return {
          ...floor,
          flats: floor.flats.map((flat) => ({
            ...flat,
            type,
          })),
        };
      }),
    }));
  }

  function updateWingFlatTypes(wingId: string, type: string) {
    setFloorsByWing((current) => ({
      ...current,
      [wingId]: current[wingId].map((floor) => ({
        ...floor,
        flats: floor.flats.map((flat) => ({
          ...flat,
          type,
        })),
      })),
    }));
  }

  function updateWing(
    wingId: string,
    field: "name" | "floors" | "flatsPerFloor",
    value: string,
  ) {
    setWings((current) =>
      current.map((wing) => {
        if (wing.id !== wingId) {
          return wing;
        }

        if (field === "name") {
          return {
            ...wing,
            name: value,
          };
        }

        const numericValue = Number(value);

        return {
          ...wing,
          [field]: Number.isInteger(numericValue)
            ? Math.max(1, numericValue)
            : 1,
        };
      }),
    );
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="shrink-0 p-6 pb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-blue-400">
              Property Structure
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-white">
              Generate Structure
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Build the physical structure of this colony.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-slate-500 transition hover:text-white"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
          {/* Colony */}
          <div className="mb-8 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Colony
            </p>

            <p className="mt-1 text-lg font-medium text-white">{colonyName}</p>
          </div>

          {/* Wing count */}
          {step === "count" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                How many wings does this colony have?
              </label>

              <input
                type="number"
                min="1"
                max="100"
                value={wingCount}
                onChange={(event) => setWingCount(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                placeholder="e.g. 7"
              />

              <p className="mt-2 text-xs text-slate-500">
                Wings will initially be named A, B, C and so on. You can edit
                their names in the next step.
              </p>
            </div>
          )}

          {step === "wings" && (
            <div>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Configure Wings
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Set the name, number of floors, and flats per floor for each
                    wing.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setApplyAllWingsOpen(true)}
                  className="shrink-0 rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-500/20"
                >
                  Apply to all wings
                </button>
              </div>

              {applyAllWingsOpen && (
                <div className="mb-5 rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
                  <div className="mb-4">
                    <h4 className="font-medium text-white">
                      Apply configuration to all wings
                    </h4>

                    <p className="mt-1 text-xs text-slate-400">
                      This changes floors and flats per floor for every wing.
                      Wing names will remain unchanged.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-xs font-medium text-slate-400">
                        Floors
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={allWingFloors}
                        onChange={(event) => {
                          setAllWingFloors(event.target.value);
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium text-slate-400">
                        Flats / floor
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={allWingFlatsPerFloor}
                        onChange={(event) => {
                          setAllWingFlatsPerFloor(event.target.value);
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setApplyAllWingsOpen(false)}
                      className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={applyToAllWings}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {wings.map((wing) => (
                  <div
                    key={wing.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <h4 className="font-semibold text-white">
                        Wing {wing.name}
                      </h4>

                      <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-400">
                        {wing.floors * wing.flatsPerFloor} flats
                      </span>
                    </div>

                    {/* Wing name */}
                    <div className="mb-4">
                      <label className="mb-2 block text-xs font-medium text-slate-400">
                        Wing name
                      </label>

                      <input
                        type="text"
                        value={wing.name}
                        onChange={(event) =>
                          updateWing(wing.id, "name", event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                        placeholder="e.g. A"
                      />
                    </div>

                    {/* Floors + flats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">
                          Floors
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={wing.floors}
                          onChange={(event) =>
                            updateWing(wing.id, "floors", event.target.value)
                          }
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-medium text-slate-400">
                          Flats / floor
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={wing.flatsPerFloor}
                          onChange={(event) =>
                            updateWing(
                              wing.id,
                              "flatsPerFloor",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}

          {step === "flats" && (
            <div>
              <div className="mb-6 flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Configure Flats
                  </h3>
              
                  <p className="mt-1 text-sm text-slate-400">
                    All flats start as 1 BHK and AVAILABLE. You can change
                    individual flats, floors, or entire wings.
                  </p>
                </div>
              
                <select
                  defaultValue=""
                  onChange={(event) => {
                    if (!event.target.value) return;
              
                    updateAllFlatTypes(event.target.value);
              
                    event.target.value = "";
                  }}
                  style={{ colorScheme: "dark" }}
                  className="shrink-0 rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-400 outline-none transition hover:bg-blue-500/20 focus:border-blue-500"
                >
                  <option value="">
                    Change all flats
                  </option>
              
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              {/* Wing selector */}
              <div className="mb-6 flex flex-wrap gap-2">
                {wings.map((wing) => (
                  <button
                    key={wing.id}
                    type="button"
                    onClick={() => setSelectedWingId(wing.id)}
                    className={
                      selectedWingId === wing.id
                        ? "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                        : "rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                    }
                  >
                    Wing {wing.name}
                  </button>
                ))}
              </div>

              {/* Selected wing */}
              {selectedWing && (
                <div>
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-semibold text-white">
                        Wing {selectedWing.name}
                      </h4>

                      <p className="mt-1 text-sm text-slate-400">
                        {selectedWing.floors} floors ·{" "}
                        {selectedWing.flatsPerFloor} flats per floor
                      </p>
                    </div>

                    <select
                      defaultValue=""
                      onChange={(event) => {
                        if (!event.target.value) return;

                        updateWingFlatTypes(
                          selectedWing.id,
                          event.target.value,
                        );

                        event.target.value = "";
                      }}
                      className="shrink-0 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500"
                    >
                      <option value="">Change all flats</option>

                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4 BHK">4 BHK</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>

                  <div className="space-y-5">
                    {selectedFloors.map((floor) => (
                      <div
                        key={floor.id}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                      >
                        {/* Floor header */}
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-white">
                              Floor {floor.floorNumber}
                            </h5>

                            <p className="mt-1 text-xs text-slate-500">
                              {floor.flats.length} flats
                            </p>
                          </div>

                          <select
                            defaultValue=""
                            onChange={(event) => {
                              if (!event.target.value) return;

                              updateFloorFlatTypes(
                                selectedWing.id,
                                floor.id,
                                event.target.value,
                              );

                              event.target.value = "";
                            }}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500"
                          >
                            <option value="">Change all flats</option>

                            <option value="1 BHK">1 BHK</option>
                            <option value="2 BHK">2 BHK</option>
                            <option value="3 BHK">3 BHK</option>
                            <option value="4 BHK">4 BHK</option>
                            <option value="Penthouse">Penthouse</option>
                          </select>
                        </div>

                        {/* Flats */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {floor.flats.map((flat) => (
                            <div
                              key={flat.id}
                              className="rounded-lg border border-slate-800 bg-slate-900 p-3"
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="font-medium text-white">
                                  {flat.flatNumber}
                                </span>

                                <span className="text-[10px] font-medium text-emerald-400">
                                  AVAILABLE
                                </span>
                              </div>

                              <select
                                value={flat.type}
                                onChange={(event) =>
                                  updateFlatType(
                                    selectedWing.id,
                                    floor.id,
                                    flat.id,
                                    event.target.value,
                                  )
                                }
                                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-xs text-slate-300 outline-none focus:border-blue-500"
                              >
                                <option value="1 BHK">1 BHK</option>
                                <option value="2 BHK">2 BHK</option>
                                <option value="3 BHK">3 BHK</option>
                                <option value="4 BHK">4 BHK</option>
                                <option value="Penthouse">Penthouse</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {step === "review" && (() => {
            const summary = getReviewSummary();
          
            return (
              <div>
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Review Property Structure
                  </h3>
          
                  <p className="mt-1 text-sm text-slate-400">
                    Review the structure before generating it.
                  </p>
                </div>
          
                {/* Colony */}
                <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Colony
                  </p>
          
                  <p className="mt-1 text-xl font-semibold text-white">
                    {colonyName}
                  </p>
                </div>
          
                {/* Summary cards */}
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Wings
                    </p>
          
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {wings.length}
                    </p>
                  </div>
          
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Floors
                    </p>
          
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {summary.totalFloors}
                    </p>
                  </div>
          
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Flats
                    </p>
          
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {summary.totalFlats}
                    </p>
                  </div>
                </div>
          
                {/* Flat type summary */}
                <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <h4 className="font-semibold text-white">
                    Flat Types
                  </h4>
          
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {[
                      "1 BHK",
                      "2 BHK",
                      "3 BHK",
                      "4 BHK",
                      "Penthouse",
                    ].map((type) => (
                      <div
                        key={type}
                        className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                      >
                        <p className="text-xs text-slate-500">
                          {type}
                        </p>
          
                        <p className="mt-1 text-xl font-semibold text-white">
                          {summary.typeCounts[type] ?? 0}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
          
                {/* Availability */}
                <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <h4 className="font-semibold text-white">
                    Availability
                  </h4>
          
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      AVAILABLE
                    </span>
          
                    <span className="font-semibold text-emerald-400">
                      {summary.totalFlats}
                    </span>
                  </div>
                </div>
          
                {/* Wings */}
                <div>
                  <h4 className="mb-3 font-semibold text-white">
                    Wings
                  </h4>
          
                  <div className="space-y-3">
                    {wings.map((wing) => {
                      const floors = floorsByWing[wing.id] ?? [];
          
                      const wingFlats = floors.flatMap(
                        (floor) => floor.flats,
                      );
          
                      const wingTypeCounts: Record<string, number> = {};
          
                      for (const flat of wingFlats) {
                        wingTypeCounts[flat.type] =
                          (wingTypeCounts[flat.type] ?? 0) + 1;
                      }
          
                      return (
                        <div
                          key={wing.id}
                          className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-semibold text-white">
                                Wing {wing.name}
                              </h5>
          
                              <p className="mt-1 text-sm text-slate-400">
                                {floors.length} floors ·{" "}
                                {wingFlats.length} flats
                              </p>
                            </div>
          
                            <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-400">
                              AVAILABLE
                            </span>
                          </div>
          
                          <div className="mt-4 flex flex-wrap gap-2">
                            {Object.entries(wingTypeCounts).map(
                              ([type, count]) => (
                                <span
                                  key={type}
                                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300"
                                >
                                  {type}: {count}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-800 pt-5">
            <button
              type="button"
              onClick={() => {
                if (step === "review") {
                  setStep("flats");
                  return;
                }
                
                if (step === "flats") {
                  setStep("wings");
                  return;
                }

                if (step === "wings") {
                  setStep("count");
                  return;
                }

                onClose();
              }}
              className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              {step === "count" ? "Cancel" : "← Back"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (step === "count") {
                  handleContinue();
                  return;
                }

                if (step === "wings") {
                  generateFloorsForWings();
                  return;
                }

                if (step === "flats") {
                  setStep("review");
                  return;
                }
              }}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              {step === "flats"
                ? "Review →"
                : step === "review"
                  ? "Generate Structure"
                  : "Continue →"}
            </button>
          </div>
        </div> 
      </div>
    </div>
  );
}
