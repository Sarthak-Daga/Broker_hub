import { db } from "@/prisma/db";
import Header from "../components/header";
import Sidebar from "../components/sideBar";
import PropertyTypeModal from "./PropertyTypeModal";

export default async function Properties() {
  const areas = await db.orm.public.Area.all();
  const colonies = await db.orm.public.Colony.all();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Workspace</p>

                <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                  Properties
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Manage your property inventory and locations.
                </p>
              </div>

              <PropertyTypeModal
                areas={areas}
                colonies={colonies}
              />
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-2">
              <button className="rounded-lg bg-blue-600/10 px-4 py-2 text-sm text-blue-400">
                All
              </button>

              <button className="rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white">
                Flats
              </button>

              <button className="rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white">
                Plots / Land
              </button>
            </div>

            {/* Empty State */}
            <div className="flex min-h-100 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="text-center">
                <div className="mb-4 text-5xl">🏢</div>

                <h2 className="text-lg font-semibold">No properties yet</h2>

                <p className="mt-2 text-sm text-slate-500">
                  Add your first property to start building your inventory.
                </p>

                <div className="mt-10">
                  <PropertyTypeModal
                    areas={areas}
                    colonies={colonies}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
