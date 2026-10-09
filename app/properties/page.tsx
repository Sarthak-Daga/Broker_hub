
import { db } from "@/prisma/db";
import Header from "../components/header";
import Sidebar from "../components/sideBar";
import PropertyTypeModal from "./PropertyTypeModal";

export default async function Properties() {
  const [areas, colonies, wings, floors, flats] = await Promise.all([
    db.orm.public.Area.all(),
    db.orm.public.Colony.all(),
    db.orm.public.Wing.all(),
    db.orm.public.Floor.all(),
    db.orm.public.Flat.all(),
  ]);

  const totalAvailable = flats.filter(
    (flat) => flat.status === "AVAILABLE",
  ).length;

  const totalSold = flats.filter(
    (flat) => flat.status === "SOLD",
  ).length;

  const totalFloors = floors.length;
  const totalWings = wings.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">
            {/* Page header */}
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Workspace</p>

                <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                  Properties
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Manage your property inventory and locations.
                </p>
              </div>

              <PropertyTypeModal areas={areas} colonies={colonies} />
            </div>

            {/* Summary */}
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <SummaryCard label="Wings" value={totalWings} />
              <SummaryCard label="Floors" value={totalFloors} />
              <SummaryCard label="Total Flats" value={flats.length} />
              <SummaryCard
                label="Available Flats"
                value={totalAvailable}
              />
            </div>

            {/* Availability breakdown */}
            <div className="mb-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-400">
                {totalAvailable} Available
              </span>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-400">
                {totalSold} Sold
              </span>
            </div>

            {/* Property hierarchy */}
            <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="border-b border-slate-800 px-6 py-5">
                <h2 className="text-lg font-semibold">
                  Property Inventory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Browse areas, colonies, wings, floors, and flats.
                </p>
              </div>

              {areas.length === 0 || colonies.length === 0 ? (
                <EmptyState
                  title="No properties yet"
                  description="Add a property, select an area and colony, and generate its structure."
                />
              ) : (
                <div className="space-y-4 p-4 sm:p-6">
                  {areas.map((area) => {
                    const areaColonies = colonies.filter(
                      (colony) => Number(colony.areaId) === Number(area.id),
                    );

                    if (areaColonies.length === 0) return null;

                    return (
                      <details
                        key={area.id}
                        open
                        className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
                      >
                        <summary className="cursor-pointer list-none px-5 py-4 transition hover:bg-slate-900">
                          <span className="mr-2 text-blue-400">⌄</span>
                          <span className="font-semibold">{area.name}</span>

                          <span className="ml-2 text-sm text-slate-500">
                            {areaColonies.length}{" "}
                            {areaColonies.length === 1 ? "colony" : "colonies"}
                          </span>
                        </summary>

                        <div className="space-y-3 border-t border-slate-800 p-3 sm:p-4">
                          {areaColonies.map((colony) => {
                            const colonyWings = wings.filter(
                              (wing) =>
                                Number(wing.colonyId) === Number(colony.id),
                            );

                            const colonyFlatCount = colonyWings.reduce(
                              (count, wing) => {
                                const wingFloors = floors.filter(
                                  (floor) =>
                                    Number(floor.wingId) === Number(wing.id),
                                );

                                return (
                                  count +
                                  wingFloors.reduce(
                                    (floorCount, floor) =>
                                      floorCount +
                                      flats.filter(
                                        (flat) =>
                                          Number(flat.floorId) ===
                                          Number(floor.id),
                                      ).length,
                                    0,
                                  )
                                );
                              },
                              0,
                            );

                            return (
                              <details
                                key={colony.id}
                                open
                                className="overflow-hidden rounded-lg border border-slate-800"
                              >
                                <summary className="cursor-pointer list-none bg-slate-900/70 px-4 py-4 transition hover:bg-slate-900">
                                  <span className="mr-2 text-blue-400">
                                    ⌄
                                  </span>

                                  <span className="font-medium">
                                    {colony.name}
                                  </span>

                                  <span className="ml-2 text-xs text-slate-500">
                                    {colonyWings.length} wings ·{" "}
                                    {colonyFlatCount} flats
                                  </span>
                                </summary>

                                <div className="space-y-3 border-t border-slate-800 p-3 sm:p-4">
                                  {colonyWings.length === 0 ? (
                                    <p className="py-3 text-sm text-slate-500">
                                      No structure generated for this colony.
                                    </p>
                                  ) : (
                                    colonyWings.map((wing) => {
                                      const wingFloors = floors
                                        .filter(
                                          (floor) =>
                                            Number(floor.wingId) ===
                                            Number(wing.id),
                                        )
                                        .sort(
                                          (a, b) =>
                                            Number(a.floorNumber) -
                                            Number(b.floorNumber),
                                        );

                                      const wingFlatCount = wingFloors.reduce(
                                        (count, floor) =>
                                          count +
                                          flats.filter(
                                            (flat) =>
                                              Number(flat.floorId) ===
                                              Number(floor.id),
                                          ).length,
                                        0,
                                      );

                                      return (
                                        <details
                                          key={wing.id}
                                          className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950"
                                        >
                                          <summary className="cursor-pointer list-none px-4 py-3 hover:bg-slate-900">
                                            <span className="mr-2 text-blue-400">
                                              ▸
                                            </span>

                                            <span className="font-medium">
                                              Wing {wing.name}
                                            </span>

                                            <span className="ml-2 text-xs text-slate-500">
                                              {wingFloors.length} floors ·{" "}
                                              {wingFlatCount} flats
                                            </span>
                                          </summary>

                                          <div className="space-y-3 border-t border-slate-800 p-3">
                                            {wingFloors.map((floor) => {
                                              const floorFlats = flats
                                                .filter(
                                                  (flat) =>
                                                    Number(flat.floorId) ===
                                                    Number(floor.id),
                                                )
                                                .sort((a, b) =>
                                                  String(a.flatNumber).localeCompare(
                                                    String(b.flatNumber),
                                                    undefined,
                                                    { numeric: true },
                                                  ),
                                                );

                                              return (
                                                <div
                                                  key={floor.id}
                                                  className="rounded-lg border border-slate-800 bg-slate-900/60 p-4"
                                                >
                                                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                                    <h4 className="font-medium">
                                                      Floor {floor.floorNumber}
                                                    </h4>

                                                    <span className="text-xs text-slate-500">
                                                      {floorFlats.length} flats
                                                    </span>
                                                  </div>

                                                  {floorFlats.length === 0 ? (
                                                    <p className="text-sm text-slate-500">
                                                      No flats on this floor.
                                                    </p>
                                                  ) : (
                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                                      {floorFlats.map((flat) => (
                                                        <div
                                                          key={flat.id}
                                                          className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                                                        >
                                                          <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                              <p className="font-semibold">
                                                                Flat{" "}
                                                                {flat.flatNumber}
                                                              </p>

                                                              <p className="mt-1 text-sm text-slate-400">
                                                                {flat.type}
                                                              </p>
                                                            </div>

                                                            <span
                                                              className={
                                                                flat.status ===
                                                                "AVAILABLE"
                                                                  ? "rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400"
                                                                  : "rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400"
                                                              }
                                                            >
                                                              {flat.status}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </details>
                                      );
                                    })
                                  )}
                                </div>
                              </details>
                            );
                          })}
                        </div>
                      </details>
                    );
                  })}
                </div>
              )}

              {areas.length > 0 &&
                colonies.length > 0 &&
                !colonies.some((colony) =>
                  areas.some(
                    (area) =>
                      Number(area.id) === Number(colony.areaId),
                  ),
                ) && (
                  <p className="px-6 pb-6 text-sm text-slate-500">
                    No colonies are linked to the available areas yet.
                  </p>
                )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="text-5xl">🏢</div>

      <h3 className="mt-4 text-lg font-semibold">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}
