import React from "react";

export function ModuleMenu({ items, onSelect }) {
  return (
    <nav className="flex space-x-4 border-b border-core-gray/20 dark:border-neutral-700">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="py-2 px-4 text-sm font-medium text-core-dark/70 hover:text-core-dark dark:text-core-gray dark:hover:text-neutral-200"
        >
          {item}
        </button>
      ))}
    </nav>
  );
}
