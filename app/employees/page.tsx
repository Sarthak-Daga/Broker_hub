import { db } from "@/prisma/db";
import Header from "../components/header";
import Sidebar from "../components/sideBar";
import EmployeeModal from "./employeeModal";
import FollowUpModal from "./followUpModal";
import { deleteEmployee } from "./action";

export default async function Employees() {
  const employees = await db.orm.public.Employee.all();
  const clients = await db.orm.public.Client.all();
  const followUps = await db.orm.public.FollowUp.all();

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
                  Employees
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Manage employees and their follow-ups.
                </p>
              </div>

              <div className="flex gap-3">
                <FollowUpModal employees={employees} clients={clients} />

                <EmployeeModal />
              </div>
            </div>

            {/* Employee Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="border-b border-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold">Employees</h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {employees.length} employee
                      {employees.length !== 1 ? "s" : ""} in your workspace
                    </p>
                  </div>
                </div>
              </div>

              {employees.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-xl">
                    👥
                  </div>

                  <h3 className="mt-4 text-sm font-medium text-white">
                    No employees yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Add your first employee to get started.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                        <th className="px-6 py-4 font-medium">Employee ID</th>

                        <th className="px-6 py-4 font-medium">Employee</th>

                        <th className="px-6 py-4 font-medium">Phone Number</th>

                        <th className="px-6 py-4 font-medium">Follow-ups</th>

                        <th className="px-6 py-4 text-right font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {employees.map((employee) => (
                        <tr
                          key={employee.id}
                          className="border-b border-slate-800/70 transition hover:bg-slate-900"
                        >
                          {/* Employee ID */}
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm text-blue-400">
                              {String(employee.id).padStart(3, "0")}
                            </span>
                          </td>

                          {/* Employee */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800">
                                👤
                              </div>

                              <div>
                                <p className="text-sm font-medium text-white">
                                  {employee.name}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Phone */}
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {employee.phoneNumber}
                          </td>

                          {/* Follow-ups */}
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                              {
                                followUps.filter(
                                  (followUp) =>
                                    followUp.employeeId === employee.id &&
                                    (followUp.status === "PENDING" ||
                                      followUp.status === "POSTPONED")
                                ).length
                              }
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <form action={deleteEmployee}>
                              <input
                                type="hidden"
                                name="employeeId"
                                value={employee.id}
                              />
                          
                              <button
                                type="submit"
                                className="rounded-lg border border-red-900/50 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-900/30"
                              >
                                Delete
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
