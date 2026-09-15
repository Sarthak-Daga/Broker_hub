"use client";

import { useState } from "react";
import EmployeeForm from "./employeeForm";

export default function EmployeeModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
      >
        + Add Employee
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Add Employee
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new employee to BrokerHub.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xl text-slate-500 transition hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <EmployeeForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}