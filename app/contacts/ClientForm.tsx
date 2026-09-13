"use client";

import { useState } from "react";
import { createClient } from "./action";

type ClientFormProps = {
  onSuccess: () => void;
};

export default function ClientForm({ onSuccess }: ClientFormProps) {
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");
  const [mobNo, setMobNo] = useState("");
  const [remarks, setRemarks] = useState("");

  async function handleSubmit(formData: FormData) {
    await createClient(formData);

    // Tell the modal that the client was successfully added
    onSuccess();
  }

  return (
    <form action={handleSubmit} className="space-y-5">

      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Name
        </label>

        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-700
                     bg-slate-950 px-3 py-2.5 text-sm text-white
                     outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Address */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Address
        </label>

        <input
          type="text"
          name="addr"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          className="w-full rounded-lg border border-slate-700
                     bg-slate-950 px-3 py-2.5 text-sm text-white
                     outline-none focus:border-blue-500"
        />
      </div>

      {/* Mobile Number */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Mobile Number
        </label>

        <input
          type="text"
          name="mobNo"
          value={mobNo}
          onChange={(e) => setMobNo(e.target.value)}
          className="w-full rounded-lg border border-slate-700
                     bg-slate-950 px-3 py-2.5 text-sm text-white
                     outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Remarks */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Remarks
        </label>

        <textarea
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-700
                     bg-slate-950 px-3 py-2.5 text-sm text-white
                     outline-none focus:border-blue-500"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5
                   text-sm font-medium text-white
                   transition hover:bg-blue-500"
      >
        Add Client
      </button>

    </form>
  );
}