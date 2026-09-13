import { db } from "@/prisma/db";
import Header from "../components/header";
import Sidebar from "../components/sideBar";
import ContactsTable from "./ContactTable";
import ContactModal from "./ContactModal";

export default async function Contacts() {
  const clients = await db.orm.public.Client.all();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Global Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-4rem)]">

        {/* Global Sidebar */}
        <Sidebar />

        {/* Contacts Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-6 lg:p-8">

            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Workspace
                </p>

                <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                  Contacts
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Manage your general business contacts.
                </p>
              </div>

              <ContactModal />

            </div>

            {/* Contacts Table */}
            <ContactsTable clients={clients} />

          </div>
        </main>

      </div>
    </div>
  );
}