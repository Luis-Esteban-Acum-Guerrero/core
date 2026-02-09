// src/components/TicketListItem.jsx
import React from "react";

export default function TicketListItem({ ticket, onClick }) {
  const {
    Base: { ticketId, estado, prioridad },
  } = ticket;
  return (
    <div
      onClick={onClick}
      className="p-3 bg-core-light rounded-lg hover:bg-core-gray/20 dark:bg-neutral-700 dark:hover:bg-neutral-600 cursor-pointer"
    >
      <div className="flex justify-between">
        <span className="font-medium">{ticketId}</span>
        <span className="text-sm">{prioridad}</span>
      </div>
      <div className="text-sm text-core-dark/70 dark:text-neutral-300">
        {estado}
      </div>
    </div>
  );
}
