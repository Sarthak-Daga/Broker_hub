"use client";

import { useState } from "react";
import { createLead } from "./action";

type Colony = {
  id: number;
  name: string;
  areaId: number;
};

type Client = {
  id: number;
  name: string;
  mobileNumber: string;
  address: string;
};

type Employee = {
  id: number;
  name: string;
  phoneNumber: string;
};

export default function MarketingModal({
  allColonies,
  allClients,
  allEmployees,
}: {
  allColonies: Colony[];
  allClients: Client[];
  allEmployees: Employee[];
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    clientId: "",
    colonyId: "",
    status: "NONE" as "NONE" | "CALLED_NOT_VISITED" | "VISITED" | "NOT_INTERESTED",
    priority: "ONE_STAR" as "ONE_STAR" | "TWO_STAR" | "THREE_STAR" | "FOUR_STAR" | "FIVE_STAR",
    remarks: "",
    employeeId: "",
  });

  function closeModal() {
    setOpen(false);
    setSubmitting(false);
    setFormData({
      clientId: "",
      colonyId: "",
      status: "NONE",
      priority: "ONE_STAR",
      remarks: "",
      employeeId: "",
    });
    setError("");
  }

  async function handleSubmit(event?: React.FormEvent) {
    if (event) {
      event.preventDefault();
    }

    setSubmitting(true);
    setError("");

    try {
      const form = new FormData();
      form.append("clientId", formData.clientId);
      form.append("colonyId", formData.colonyId);
      form.append("status", formData.status);
      form.append("priority", formData.priority);
      form.append("remarks", formData.remarks);
      if (formData.employeeId) {
        form.append("employeeId", formData.employeeId);
      }

      await createLead(form);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lead.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
      >
        + Add Lead
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Add Lead</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add a new marketing lead.
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
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {/* Client */}
              <div>
                <label
                  htmlFor="clientId"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Client *
                </label>
                <select
                  id="clientId"
                  name="clientId"
                  required
                  value={formData.clientId}
                  onChange={(e) =>
                    setFormData({ ...formData, clientId: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
                >
                  <option value="">Select client</option>
                  {allClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Colony */}
              <div>
                <label
                  htmlFor="colonyId"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Colony *
                </label>
                <select
                  id="colonyId"
                  name="colonyId"
                  required
                  value={formData.colonyId}
                  onChange={(e) =>
                    setFormData({ ...formData, colonyId: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
                >
                  <option value="">Select colony</option>
                  {allColonies.map((colony) => (
                    <option key={colony.id} value={colony.id}>
                      {colony.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
                  >
                    <option value="NONE">None</option>
                    <option value="CALLED_NOT_VISITED">Called - Not Visited</option>
                    <option value="VISITED">Visited</option>
                    <option value="NOT_INTERESTED">Not Interested</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label
                    htmlFor="priority"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    required
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as any,
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
                  >
                    <option value="ONE_STAR">★</option>
                    <option value="TWO_STAR">★★</option>
                    <option value="THREE_STAR">★★★</option>
                    <option value="FOUR_STAR">★★★★</option>
                    <option value="FIVE_STAR">★★★★★</option>
                  </select>
                </div>
              </div>

              {/* Employee */}
              <div>
                <label
                  htmlFor="employeeId"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Assign to (optional)
                </label>
                <select
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500"
                >
                  <option value="">Unassigned</option>
                  {allEmployees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label
                  htmlFor="remarks"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={3}
                  placeholder="Add notes about this lead..."
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

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
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}