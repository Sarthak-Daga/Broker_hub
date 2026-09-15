"use client";

import { useState } from "react";
import { updateFollowUp } from "./action";

type Employee = {
  id: number;
  name: string;
};

type Client = {
  id: number;
  name: string;
};

type FollowUp = {
  id: number;
  clientId: number;
  employeeId: number;
  dateTime: string;
  notes: string | null;
  purpose: string;
  status: string;
};

type Props = {
  followUp: FollowUp;
  employees: Employee[];
  clients: Client[];
};

function getCurrentDateTime() {
  const now = new Date();

  const offset = now.getTimezoneOffset();

  const localNow = new Date(
    now.getTime() - offset * 60 * 1000
  );

  return localNow.toISOString().slice(0, 16);
}

export default function FollowUpEditModal({
  followUp,
  employees,
  clients,
}: Props) {
  const [open, setOpen] = useState(false);

  function closeModal() {
    setOpen(false);
  }

  const dateValue = new Date(followUp.dateTime)
    .toISOString()
    .slice(0, 16);

  
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 shadow-xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Edit Follow-up
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the follow-up details.
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

            <form
              action={async (formData) => {
                await updateFollowUp(formData);
                closeModal();
              }}
              className="space-y-5 p-6"
            >
              <input
                type="hidden"
                name="followUpId"
                value={followUp.id}
              />

              {/* Client */}
              <div>
                <label
                  htmlFor={`client-${followUp.id}`}
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Client
                </label>

                <select
                  id={`client-${followUp.id}`}
                  name="clientId"
                  defaultValue={followUp.clientId}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee */}
              <div>
                <label
                  htmlFor={`employee-${followUp.id}`}
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Employee
                </label>

                <select
                  id={`employee-${followUp.id}`}
                  name="employeeId"
                  defaultValue={followUp.employeeId}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} (
                      {String(employee.id).padStart(3, "0")})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor={`date-${followUp.id}`}
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Date & Time
                </label>

                <input
                  id={`date-${followUp.id}`}
                  type="datetime-local"
                  name="DateTime"
                  min={getCurrentDateTime()}
                  defaultValue={dateValue}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Purpose */}
              <div>
                <label
                  htmlFor={`purpose-${followUp.id}`}
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Purpose
                </label>

                <select
                  id={`purpose-${followUp.id}`}
                  name="purpose"
                  defaultValue={followUp.purpose}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="GENERAL">General</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="BUYER">Buyer</option>
                  <option value="SELLER">Seller</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor={`notes-${followUp.id}`}
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Notes
                </label>

                <textarea
                  id={`notes-${followUp.id}`}
                  name="notes"
                  defaultValue={followUp.notes ?? ""}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}