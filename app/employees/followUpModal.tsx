"use client";

import { useState } from "react";
import { addFollowUP } from "./action";

type Employee = {
  id: number;
  name: string;
};

type Client = {
  id: number;
  name: string;
};

type FollowUpModalProps = {
  employees: Employee[];
  clients: Client[];
};

export default function FollowUpModal({
  employees,
  clients,
}: FollowUpModalProps) {
  const [open, setOpen] = useState(false);

  function closeModal() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
      >
        + Add Follow-up
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 shadow-xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Add Follow-up
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Schedule a follow-up for a client.
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

            {/* Form */}
            <form
              action={async (formData) => {
                await addFollowUP(formData);
                closeModal();
              }}
              className="space-y-5 p-6"
            >

              {/* Client */}
              <div>
                <label
                  htmlFor="clientId"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Client
                </label>

                <select
                  id="clientId"
                  name="clientId"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select client</option>

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
                  htmlFor="employeeId"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Employee
                </label>

                <select
                  id="employeeId"
                  name="employeeId"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select employee</option>

                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} (
                      {String(employee.id).padStart(3, "0")})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div>
                <label
                  htmlFor="DateTime"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Date & Time
                </label>

                <input
                  id="DateTime"
                  type="datetime-local"
                  name="DateTime"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Purpose */}
              <div>
                <label
                  htmlFor="purpose"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Purpose
                </label>

                <select
                  id="purpose"
                  name="purpose"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                  htmlFor="notes"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Notes
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Add notes about this follow-up..."
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                  Add Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}