// src/components/TicketsList.jsx
import React from "react";
import TicketListItem from "./TicketListItem.jsx";

export default function TicketsList({ tickets, onSelect }) {
  return (
    <div className="w-72 bg-core-light border-r border-core-gray/20 dark:bg-neutral-800 dark:border-neutral-700 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-core-gray/20 dark:border-neutral-700">
        <h2 className="font-semibold text-core-dark dark:text-neutral-200">
          Tickets
        </h2>
        <button className="p-2 rounded-full hover:bg-core-gray/10 dark:hover:bg-neutral-700">
          {/* + icon */}
          <span className="block w-5 h-5 bg-core-gray rounded-full"></span>
        </button>
      </div>
      <div className="p-2 overflow-y-auto flex-1 space-y-2">
        {tickets.map((t) => (
          <TicketListItem
            key={t.Base.ticketId}
            ticket={t}
            onClick={() => onSelect(t)}
          />
        ))}
      </div>
    </div>
  );
}
