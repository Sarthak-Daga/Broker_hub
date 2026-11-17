"use client";

import { useState, useMemo, forwardRef, useImperativeHandle } from "react";
import SearchableSelect from "../components/searchableSelect";
import { createArea, createColony } from "./action";
import { createPlot, updatePlotStatus } from "./plotAction";
import { createSeller } from "../buyers-sellers/action";

type Area = {
  id: number;
  name: string;
};

type Colony = {
  id: number;
  name: string;
  areaId: number;
};

type Seller = {
  id: number;
  name: string;
  phoneNumber: string;
};

export type PlotFormHandle = {
  savePlot: () => Promise<void>;
};

export default forwardRef<PlotFormHandle, any>(function PlotForm(
  { areas, colonies, onColonyChange }: any,
  ref,
) {
  const [areaId, setAreaId] = useState<number | null>(null);
  const [colonyId, setColonyId] = useState<number | null>(null);

  const [localAreas, setLocalAreas] = useState<Area[]>(areas);
  const [localColonies, setLocalColonies] = useState<Colony[]>(colonies);

  const [addingArea, setAddingArea] = useState(false);
  const [addingColony, setAddingColony] = useState(false);

  const [newAreaName, setNewAreaName] = useState("");
  const [newColonyName, setNewColonyName] = useState("");

  const [creating, setCreating] = useState<"area" | "colony" | null>(null);

  const [plotData, setPlotData] = useState({
    title: "",
    location: "",
    length: "",
    width: "",
    salePricePerSqFt: "",
    sellerId: "",
    status: "AVAILABLE" as "AVAILABLE" | "UNAVAILABLE" | "SOLD",
    remarks: "",
  });

  const filteredColonies = useMemo(
    () =>
      localColonies.filter((colony) => colony.areaId === areaId),
    [localColonies, areaId],
  );

  const totalArea = useMemo(() => {
    const lengthNum = Number(plotData.length);
    const widthNum = Number(plotData.width);

    if (!isNaN(lengthNum) && !isNaN(widthNum) && lengthNum > 0 && widthNum > 0) {
      return lengthNum * widthNum;
    }

    return 0;
  }, [plotData.length, plotData.width]);

  const totalPrice = useMemo(() => {
    const pricePerSqFt = Number(plotData.salePricePerSqFt);

    if (!isNaN(pricePerSqFt) && pricePerSqFt > 0 && totalArea > 0) {
      return totalArea * pricePerSqFt;
    }

    return 0;
  }, [plotData.salePricePerSqFt, totalArea]);

  async function handleCreateArea() {
    if (!newAreaName.trim()) return;

    try {
      setCreating("area");

      const formData = new FormData();
      formData.append("name", newAreaName.trim());

      const area = await createArea(formData);

      setLocalAreas((current) => [...current, area]);
      setAreaId(area.id);

      setNewAreaName("");
      setAddingArea(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create area.");
    } finally {
      setCreating(null);
    }
  }

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
      onColonyChange?.(colony.id);

      setNewColonyName("");
      setAddingColony(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create colony.");
    } finally {
      setCreating(null);
    }
  }

  function getValidSellers() {
    return localColonies.flatMap((colony) =>
      (colony as any).sellers || []
    );
  }

  async function savePlot() {
    if (!areaId) {
      alert("Please select an area first.");
      return;
    }

    if (!colonyId) {
      alert("Please select a colony first.");
      return;
    }

    if (!plotData.sellerId) {
      alert("Please select a seller for this plot.");
      return;
    }

    if (!plotData.length || Number(plotData.length) <= 0) {
      alert("Please enter a valid length.");
      return;
    }

    if (!plotData.width || Number(plotData.width) <= 0) {
      alert("Please enter a valid width.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", plotData.title || "");
      formData.append("areaId", String(areaId));
      formData.append("location", plotData.location || "");
      formData.append("length", plotData.length);
      formData.append("width", plotData.width);
      formData.append("salePricePerSqFt", plotData.salePricePerSqFt || "");
      formData.append("sellerId", plotData.sellerId);
      formData.append("remarks", plotData.remarks || "");

      await createPlot(formData);
      alert("Plot created successfully!");

      // Reset form
      setPlotData({
        title: "",
        location: "",
        length: "",
        width: "",
        salePricePerSqFt: "",
        sellerId: "",
        status: "AVAILABLE",
        remarks: "",
      });
      setColonyId(null);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to create plot.");
    }
  }

  useImperativeHandle(ref, () => ({ savePlot }), [savePlot]);

  return (
    <div className="space-y-5">
      {/* AREA */}
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

      {/* COLONY */}
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
            onColonyChange?.(value);
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

      {/* PROPERTY DETAILS */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-400">Property Details</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Title (optional)
            </label>
            <input
              type="text"
              value={plotData.title}
              onChange={(e) =>
                setPlotData({ ...plotData, title: e.target.value })
              }
              placeholder="e.g. Commercial Plot XYZ"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Location (optional)
            </label>
            <input
              type="text"
              value={plotData.location}
              onChange={(e) =>
                setPlotData({ ...plotData, location: e.target.value })
              }
              placeholder="e.g. Near the main highway"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Remarks
            </label>
            <textarea
              value={plotData.remarks}
              onChange={(e) =>
                setPlotData({ ...plotData, remarks: e.target.value })
              }
              placeholder="Add any additional notes..."
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* DIMENSIONS */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-400">Dimensions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Length (feet)
            </label>
            <input
              type="number"
              min="1"
              value={plotData.length}
              onChange={(e) =>
                setPlotData({ ...plotData, length: e.target.value })
              }
              placeholder="e.g. 100"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Width (feet)
            </label>
            <input
              type="number"
              min="1"
              value={plotData.width}
              onChange={(e) =>
                setPlotData({ ...plotData, width: e.target.value })
              }
              placeholder="e.g. 30"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm">
          <span className="text-slate-400">Total Area: </span>
          <span className="font-medium text-white">{totalArea} sq ft</span>
        </div>
      </div>

      {/* PRICING */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-400">Pricing</h3>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            Price per sq ft (optional)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={plotData.salePricePerSqFt}
            onChange={(e) =>
              setPlotData({ ...plotData, salePricePerSqFt: e.target.value })
            }
            placeholder="e.g. 5000"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
          {totalPrice > 0 && (
            <div className="mt-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-sm">
              <span className="text-slate-400">Estimated Total Price: </span>
              <span className="font-medium text-emerald-400">₹{totalPrice.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* SELLER SELECTION */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Seller
        </label>
        <SearchableSelect
          options={getValidSellers().map((seller) => ({
            id: seller.id,
            label: `${seller.name} (${String(seller.id).padStart(3, "0")})`,
          }))}
          value={plotData.sellerId ? Number(plotData.sellerId) : null}
          onChangeAction={(value) => {
            setPlotData({ ...plotData, sellerId: String(value) });
          }}
          placeholder="Select a seller"
        />
      </div>

      {/* SAVE BUTTON */}
      <div className="pt-4">
        <button
          type="button"
          onClick={savePlot}
          disabled={!plotData.sellerId}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save Plot
        </button>
      </div>
    </div>
  );
});

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
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
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