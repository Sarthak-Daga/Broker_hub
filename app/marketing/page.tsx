"use server";

import { db } from "@/prisma/db";
import Header from "../components/header";
import Sidebar from "../components/sideBar";
import MarketingModal from "./MarketingModal";
import MarketingActions from "./MarketingActions";

type Marketing = {
  id: number;
  clientId: number;
  colonyId: number;
  employeeId?: number | null;
  status: "NONE" | "CALLED_NOT_VISITED" | "VISITED" | "NOT_INTERESTED";
  priority: "ONE_STAR" | "TWO_STAR" | "THREE_STAR" | "FOUR_STAR" | "FIVE_STAR";
  remarks?: string | null;
};

export default async function Marketing() {
  const marketing = await db.orm.public.Marketing.all();
  const clients = await db.orm.public.Client.all();
  const colonies = await db.orm.public.Colony.all();
  const employees = await db.orm.public.Employee.all(); // Note: prisma contract doesn't have marketing relations table view, using flat join

  const colonyMap = new Map(colonies.map((c) => [c.id, c.name as string]));
  const clientMap = new Map(clients.map((c) => [c.id, c.name as string]));
  const employeeMap = new Map(employees.map((e) => [e.id, e.name as string]));

  const now = new Date();

  const sortedMarketing = [...marketing].sort((a, b) => {
    const now = new Date();

    const priorityOrder: Record<string, number> = {
      ONE_STAR: 5,
      TWO_STAR: 4,
      THREE_STAR: 3,
      FOUR_STAR: 2,
      FIVE_STAR: 1,
      NONE: 99,
    };

    const priorityValue = priorityOrder[a.priority as string] ?? 99;
    const priorityValueB = priorityOrder[b.priority as string] ?? 99;
    const priorityChange = priorityValue - priorityValueB;

    if (priorityChange !== 0) return priorityChange;

    const statusOrder: Record<string, number> = {
      NONE: 1,
      CALLED_NOT_VISITED: 2,
      VISITED: 3,
      NOT_INTERESTED: 4,
    };

    const statusValue = statusOrder[a.status] ?? 99;
    const statusValueB = statusOrder[b.status] ?? 99;
    const statusChange = statusValue - statusValueB;

    if (statusChange !== 0) return statusChange;

    return new Date(a.id).getTime() - new Date(b.id).getTime();
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-5xl p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-500">Workspace</p>

                <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                  Marketing Leads
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Track marketing leads and client-colony interests.
                </p>
              </div>

              <MarketingModal allColonies={colonies} allClients={clients} allEmployees={employees} />
            </div>

            {/* Marketing leads list */}
            {sortedMarketing.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-xl">
                  📢
                </div>

                <h3 className="mt-4 text-sm font-medium text-white">
                  No marketing leads yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add a marketing lead to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {sortedMarketing.map((lead) => {
                  const employeeName = lead.employeeId
                    ? (employeeMap.get(lead.employeeId) ?? "Unassigned")
                    : "Unassigned";
                  const isInactive =
                    lead.status === "VISITED" || lead.status === "NOT_INTERESTED";

                  return (
                    <div
                      key={lead.id}
                      className={`rounded-xl border p-5 transition ${
                        isInactive
                          ? "border-slate-900 bg-slate-950/40 opacity-50"
                          : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Main information */}
                        <div className="flex-1">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-semibold text-white">
                              {clientMap.get(lead.clientId) ?? "Unknown Client"}
                            </h2>

                            <span className="text-slate-600">→</span>

                            <h2 className="text-base font-semibold text-white">
                              {colonyMap.get(lead.colonyId) ?? "Unknown Colony"}
                            </h2>

                            <span className="text-slate-600">•</span>

                            <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-amber-600/10 text-amber-400">
                              {lead.priority.replace("_", " ")}
                            </span>
                          </div>

                          <p className="text-sm text-slate-400">
                            {lead.remarks || "No remarks added."}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="flex shrink-0 items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              isInactive
                                ? "border border-slate-800 bg-slate-950 text-slate-400"
                                : lead.status === "NOT_INTERESTED"
                                  ? "bg-red-600/10 text-red-400"
                                  : lead.status === "VISITED"
                                    ? "bg-emerald-600/10 text-emerald-400"
                                    : lead.status === "CALLED_NOT_VISITED"
                                      ? "bg-amber-600/10 text-amber-400"
                                      : "bg-slate-600/10 text-slate-400"
                            }`}
                          >
                            {lead.status.replace(/_/g, " ")}
                          </span>

                          <MarketingActions leadId={lead.id} status={lead.status as any} />
                        </div>
                      </div>

                      {/* Bottom information */}
                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-800 pt-3 text-xs text-slate-500">
                        <span>👤 {lead.employeeId ? employeeName : "Unassigned"}</span>

                        {!isInactive && (
                          <span>
                            📅 {new Date(lead.id).toLocaleDateString("en-IN")}
                          </span>
                        )}

                        <span>
                          Lead #{String(lead.id).padStart(3, "0")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}