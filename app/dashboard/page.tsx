import Header from "@/app/components/header";
import Sidebar from "@/app/components/sideBar";
import { db } from "@/prisma/db";

const modules = [
  {
    title: "Marketing",
    description: "Manage marketing clients, colonies and property interests.",
    icon: "📢",
    href: "/marketing",
  },
  {
    title: "Buyers & Sellers",
    description: "Manage property requirements and buyer-seller relationships.",
    icon: "🏠",
    href: "/buyers-sellers",
  },
  {
    title: "General Contacts",
    description: "Keep track of contacts and future business opportunities.",
    icon: "👥",
    href: "/contacts",
  },
];

export default async function Dashboard() {
  const clients = await db.orm.public.Client.all();
  const sellers = await db.orm.public.Seller.all();
  const followUps = await db.orm.public.FollowUp.all();
  const employees = await db.orm.public.Employee.all();

  const activeFollowUps = followUps.filter(
    (followUp) =>
      followUp.status === "PENDING" || followUp.status === "POSTPONED",
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Global Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Global Sidebar */}
        <Sidebar />

        {/* Dashboard Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">
            {/* Page Heading */}
            <div className="mb-8">
              <p className="text-sm text-slate-500">Overview</p>

              <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                Dashboard
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Manage your real estate relationships from one place.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="text-sm text-slate-500">Total Clients</p>

                <p className="mt-2 text-3xl font-semibold">
                  {clients.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="text-sm text-slate-500">Properties</p>

                <p className="mt-2 text-3xl font-semibold">
                  {sellers.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="text-sm text-slate-500">Active Follow-ups</p>

                <p className="mt-2 text-3xl font-semibold">
                  {activeFollowUps.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <p className="text-sm text-slate-500">Employees</p>

                <p className="mt-2 text-3xl font-semibold">
                  {employees.length}
                </p>
              </div>
            </div>

            {/* Modules */}
            <section>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Manage BrokerHub</h3>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a section to get started.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {modules.map((module) => (
                  <a
                    key={module.title}
                    href={module.href}
                    className="group rounded-xl border border-slate-800
                               bg-slate-900/50 p-6 transition
                               hover:-translate-y-1
                               hover:border-slate-700
                               hover:bg-slate-900"
                  >
                    {/* Icon */}
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl">
                      {module.icon}
                    </div>

                    {/* Text */}
                    <h4 className="text-lg font-semibold transition group-hover:text-blue-400">
                      {module.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {module.description}
                    </p>

                    {/* Arrow */}
                    <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-400 transition group-hover:text-blue-400">
                      Open section
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
