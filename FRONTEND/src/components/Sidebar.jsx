// src/components/Sidebar.jsx
import React from "react";

export default function Sidebar({ user, history }) {
  return (
    <aside class="relative">
      <div
        id="hs-pro-chat-sidebar"
        class="hs-overlay [--auto-close:xl] sm:w-auto xl:w-80 xl:block xl:translate-x-0 xl:end-auto xl:bottom-0 [--auto-close-equality-type:less-than] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform size-full hidden fixed inset-y-0 start-0 z-59 bg-core-light border-r border-core-gray dark:bg-neutral-950"
        tabindex="-1"
        aria-labelledby="hs-pro-chat-sidebar-label"
      >
        <h3 className="font-semibold text-core-dark dark:text-neutral-200">
          Usuario
        </h3>
        <p>{user.name}</p>
        <p className="text-sm text-core-dark/60">{user.email}</p>
      </div>
      <div>
        <h3 className="font-semibold text-core-dark dark:text-neutral-200">
          Historial
        </h3>
        <ul className="space-y-2">
          {history.map((t, i) => (
            <li
              key={i}
              className="p-2 bg-core-gray/10 rounded-lg dark:bg-neutral-700"
            >
              <div className="flex justify-between">
                <span>{t.ticketId}</span>
                <span className="text-sm">{t.prioridad}</span>
              </div>
              <div className="text-sm text-core-dark/70 dark:text-neutral-300">
                {t.estado}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
