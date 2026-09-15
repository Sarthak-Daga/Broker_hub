"use client";

import { useState } from "react";
import { createEmployee } from "./action";

export default function EmployeeForm() {
  const [name, setName] = useState("");
  const [phNo, setPhNo] = useState("");

  async function handleSubmit(formData: FormData) {
    await createEmployee(formData);

    setName("");
    setPhNo("");
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Name
        </label>

        <input
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter employee name"
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phoneNumber"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Phone Number
        </label>

        <input
          id="phoneNumber"
          type="tel"
          name="phoneNumber"
          value={phNo}
          onChange={(e) => setPhNo(e.target.value)}
          placeholder="Enter phone number"
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 active:bg-blue-700"
      >
        Add Employee
      </button>
    </form>
  );
}