"use client";

import { useState } from "react";
import SearchableSelect from "../components/searchableSelect";
import { createArea, createColony } from "./action";

type Area = {
  id: number;
  name: string;
};

type Colony = {
  id: number;
  name: string;
  areaId: number;
};

type FlatFormProps = {
  areas: Area[];
  colonies: Colony[];
};

export default function FlatForm({ areas, colonies }: FlatFormProps) {
  // --------------------------------------------------
  // Selected hierarchy
  // --------------------------------------------------

  const [areaId, setAreaId] = useState<number | null>(null);
  const [colonyId, setColonyId] = useState<number | null>(null);

  // --------------------------------------------------
  // Local copies
  // --------------------------------------------------

  const [localAreas, setLocalAreas] = useState<Area[]>(areas);
  const [localColonies, setLocalColonies] = useState<Colony[]>(colonies);

  // --------------------------------------------------
  // Creation UI state
  // --------------------------------------------------

  const [addingArea, setAddingArea] = useState(false);
  const [addingColony, setAddingColony] = useState(false);

  const [newAreaName, setNewAreaName] = useState("");
  const [newColonyName, setNewColonyName] = useState("");

  const [creating, setCreating] = useState<"area" | "colony" | null>(null);

  // --------------------------------------------------
  // Cascading filters
  // --------------------------------------------------

  const filteredColonies = localColonies.filter(
    (colony) => colony.areaId === areaId,
  );

  // --------------------------------------------------
  // Create Area
  // --------------------------------------------------

  async function handleCreateArea() {
    if (!newAreaName.trim()) return;

    try {
      setCreating("area");

      const formData = new FormData();
      formData.append("name", newAreaName.trim());

      const area = await createArea(formData);

      setLocalAreas((current) => [...current, area]);
      setAreaId(area.id);
      setColonyId(null);

      setNewAreaName("");
      setAddingArea(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create area.");
    } finally {
      setCreating(null);
    }
  }

  // --------------------------------------------------
  // Create Colony
  // --------------------------------------------------

  async function handleCreateColony() {
    if (!areaId || !newColonyName.trim()) return;

    try {
      setCreating("colony");

      const formData = new FormData();
      formData.append("name", newColonyName.trim());
      formData.append("areaId", String(areaId));

      const colony = await createColony(formData);

      setLocalColonies((current) => [...current, colony]);
      setColonyId(colony.id);

      setNewColonyName("");
      setAddingColony(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create colony.");
    } finally {
      setCreating(null);
    }
  }

  return (
    <div className="space-y-5">
      {/* ================================================= */}
      {/* AREA */}
      {/* ================================================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Area
        </label>

        <SearchableSelect
          options={localAreas.map((area) => ({
            id: area.id,
            label: area.name,
          }))}
          value={areaId}
          onChangeAction={(value) => {
            setAreaId(value);
            setColonyId(null);
          }}
          placeholder="Search area..."
        />

        <div className="mt-2">
          {!addingArea ? (
            <button
              type="button"
              onClick={() => setAddingArea(true)}
              className="text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              + New Area
            </button>
          ) : (
            <CreationBox
              label="Area name"
              value={newAreaName}
              onChange={setNewAreaName}
              placeholder="e.g. Ahmedabad"
              onCancel={() => {
                setAddingArea(false);
                setNewAreaName("");
              }}
              onCreate={handleCreateArea}
              creating={creating === "area"}
            />
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* COLONY */}
      {/* ================================================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Colony
        </label>

        <SearchableSelect
          options={filteredColonies.map((colony) => ({
            id: colony.id,
            label: colony.name,
          }))}
          value={colonyId}
          onChangeAction={(value) => {
            setColonyId(value);
          }}
          placeholder={areaId ? "Search colony..." : "Select an area first"}
          disabled={!areaId}
        />

        {areaId && (
          <div className="mt-2">
            {!addingColony ? (
              <button
                type="button"
                onClick={() => setAddingColony(true)}
                className="text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                + New Colony
              </button>
            ) : (
              <CreationBox
                label="Colony name"
                value={newColonyName}
                onChange={setNewColonyName}
                placeholder="e.g. Shantigram"
                onCancel={() => {
                  setAddingColony(false);
                  setNewColonyName("");
                }}
                onCreate={handleCreateColony}
                creating={creating === "colony"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// Reusable creation box
// =====================================================

function CreationBox({
  label,
  value,
  onChange,
  placeholder,
  onCancel,
  onCreate,
  creating,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onCancel: () => void;
  onCreate: () => void;
  creating: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
      <label className="mb-2 block text-xs font-medium text-slate-400">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
      />

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={creating || !value.trim()}
          onClick={onCreate}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
}
