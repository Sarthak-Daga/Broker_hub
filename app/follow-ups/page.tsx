import { db } from "@/prisma/db";
import Header from "../components/header";
import Sidebar from "../components/sideBar";
import FollowUpEditModal from "./FollowUpEditModal";
import FollowUpActions from "./FollowUpActions";
import FollowUpModal from "../employees/followUpModal";

export default async function FollowUps() {
  const followUps = await db.orm.public.FollowUp.all();
  const employees = await db.orm.public.Employee.all();
  const clients = await db.orm.public.Client.all();

  const employeeMap = new Map(
    employees.map((employee) => [employee.id, employee.name]),
  );

  const clientMap = new Map(clients.map((client) => [client.id, client.name]));

  const now = new Date();

  const sortedFollowUps = [...followUps].sort((a, b) => {
    const aExpired = a.status === "PENDING" && new Date(a.dateTime) < now;

    const bExpired = b.status === "PENDING" && new Date(b.dateTime) < now;

    // Overdue first
    if (aExpired && !bExpired) return -1;
    if (!aExpired && bExpired) return 1;

    const statusOrder: Record<string, number> = {
      PENDING: 1,
      POSTPONED: 2,
      DONE: 3,
      CANCELLED: 4,
    };

    const statusDifference =
      (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);

    if (statusDifference !== 0) {
      return statusDifference;
    }

    return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
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
                  Follow-ups
                </h1>
            
                <p className="mt-2 text-sm text-slate-400">
                  View and manage scheduled client follow-ups.
                </p>
              </div>
            
              <FollowUpModal
                employees={employees}
                clients={clients}
              />
            </div>

            {/* Follow-up list */}
            {sortedFollowUps.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-xl">
                  📅
                </div>

                <h3 className="mt-4 text-sm font-medium text-white">
                  No follow-ups yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Scheduled follow-ups will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {sortedFollowUps.map((followUp) => {
                  const employeeName =
                    employeeMap.get(followUp.employeeId) ?? "Unknown Employee";

                  const clientName =
                    clientMap.get(followUp.clientId) ?? "Unknown Client";
                  const isExpired =
                    followUp.status === "PENDING" &&
                    new Date(followUp.dateTime) < new Date();
                  const isInactive =
                    followUp.status === "DONE" ||
                    followUp.status === "CANCELLED";

                  return (
                    <div
                      key={followUp.id}
                      className={`rounded-xl border p-5 transition ${
                        isInactive
                          ? "border-slate-900 bg-slate-950/40 opacity-50"
                          : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Main information */}
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-semibold text-white">
                              {employeeName}
                            </h2>

                            <span className="text-slate-600">→</span>

                            <h2 className="text-base font-semibold text-white">
                              {clientName}
                            </h2>
                          </div>

                          <p className="mt-2 text-sm text-slate-400">
                            {followUp.notes || "No notes added."}
                          </p>
                        </div>

                        {/* Status */}
                        <div className="flex shrink-0 items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              isExpired
                                ? "bg-red-600/10 text-red-400"
                                : followUp.status === "DONE"
                                  ? "bg-emerald-600/10 text-emerald-400"
                                  : followUp.status === "POSTPONED"
                                    ? "bg-amber-600/10 text-amber-400"
                                    : followUp.status === "CANCELLED"
                                      ? "bg-red-600/10 text-red-400"
                                      : "bg-blue-600/10 text-blue-400"
                            }`}
                          >
                            {isExpired ? "OVERDUE" : followUp.status}
                          </span>

                          <FollowUpEditModal
                            followUp={followUp}
                            employees={employees}
                            clients={clients}
                          />
                        </div>
                      </div>

                      {/* Bottom information */}
                      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-800 pt-4 text-xs text-slate-500">
                        <span>
                          🕐{" "}
                          {new Date(followUp.dateTime).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>

                        <span>🎯 {followUp.purpose}</span>

                        <span>
                          Follow-up #{String(followUp.id).padStart(3, "0")}
                        </span>
                      </div>
                      <FollowUpActions
                        followUpId={followUp.id}
                        status={followUp.status}
                      />
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
