import React from "react";

export function FilterButtons({ filters, active, onChange }) {
  return (
    <div className="flex space-x-2">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`py-1 px-3 rounded-lg ${
            active === f
              ? "bg-core-primary text-core-dark"
              : "bg-core-gray/10 dark:bg-neutral-700 text-core-dark dark:text-neutral-300"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
