"use client";

import { useEffect, useRef, useState } from "react";

type Option = {
  id: number;
  label: string;
};

type SearchableSelectProps = {
  options: Option[];
  value: number | null;
  onChangeAction: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function SearchableSelect({
  options,
  value,
  onChangeAction,
  placeholder = "Search...",
  disabled = false,
}: SearchableSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (option) => option.id === value
  );

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex items-center rounded-lg border bg-slate-950 transition ${
          disabled
            ? "cursor-not-allowed border-slate-800 opacity-50"
            : "border-slate-700 focus-within:border-blue-500"
        }`}
      >
        <span className="pl-3 text-sm text-slate-500">
          🔍
        </span>

        <input
          type="text"
          value={open ? query : selectedOption?.label ?? ""}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (!disabled) {
              setQuery("");
              setOpen(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
        />

        {selectedOption && !open && (
          <button
            type="button"
            onClick={() => {
              onChangeAction(null);
              setQuery("");
            }}
            className="mr-3 text-slate-500 hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      {open && !disabled && (
        <div className="absolute z-50 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-slate-800 bg-slate-900 p-1 shadow-xl">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-3 text-sm text-slate-500">
              No results found.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChangeAction(option.id);
                  setQuery("");
                  setOpen(false);
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                  option.id === value
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}