"use client";

import { useState } from "react";
import { deleteClient } from "./action";

type Client = {
  id: number;
  name: string;
  address: string;
  mobileNumber: string;
  remarks: string | null;
};

type ContactsTableProps = {
  clients: Client[];
};

export default function ContactsTable({ clients }: ContactsTableProps) {
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter((client) => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      client.name.toLowerCase().includes(query) ||
      client.mobileNumber.toLowerCase().includes(query) ||
      client.address.toLowerCase().includes(query) ||
      client.remarks?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <span
            className="pointer-events-none absolute left-4 top-1/2
                           -translate-y-1/2 text-slate-500"
          >
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full rounded-xl border border-slate-800
                       bg-slate-900/50 py-3 pl-11 pr-4
                       text-sm text-white
                       placeholder:text-slate-500
                       outline-none
                       transition
                       focus:border-blue-500"
          />
        </div>
      </div>

      {/* Result count */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filteredClients.length}{" "}
          {filteredClients.length === 1 ? "contact" : "contacts"}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
        {/* Header */}
        <div className="grid grid-cols-12 border-b border-slate-800 px-6 py-4">
          <div className="col-span-3 text-xs font-medium uppercase tracking-wider text-slate-500">
            Name
          </div>

          <div className="col-span-3 text-xs font-medium uppercase tracking-wider text-slate-500">
            Mobile
          </div>

          <div className="col-span-4 text-xs font-medium uppercase tracking-wider text-slate-500">
            Address
          </div>

          <div className="col-span-2 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
            Actions
          </div>
        </div>

        {/* Rows */}
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="grid grid-cols-12 items-center
                         border-b border-slate-800 px-6 py-4
                         last:border-b-0
                         transition hover:bg-slate-800/30"
            >
              {/* Name */}
              <div className="col-span-3">
                <p className="font-medium text-white">{client.name}</p>

                {client.remarks && (
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {client.remarks}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div className="col-span-3 text-sm text-slate-400">
                {client.mobileNumber}
              </div>

              {/* Address */}
              <div className="col-span-4 truncate text-sm text-slate-400">
                {client.address}
              </div>

              {/* Delete */}
              <div className="col-span-2 flex justify-end">
                <form action={deleteClient}>
                  <input type="hidden" name="id" value={client.id} />

                  <button
                    type="submit"
                    className="rounded-lg px-3 py-2 text-sm
                               text-red-400
                               transition
                               hover:bg-red-500/10
                               hover:text-red-300"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-300">
              No contacts found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try a different search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
