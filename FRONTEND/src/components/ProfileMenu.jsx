import React from "react";

export default function ProfileMenu() {
  // Placeholder: replace with actual profile dropdown
  return (
    <div className="flex items-center gap-2">
      <img
        src="/images/owis.jpg"
        alt="Avatar"
        className="w-8 h-8 rounded-full"
      />
      <div>
        <p className="text-sm font-medium text-core-dark dark:text-neutral-200">
          Usuario
        </p>
        <a
          href="#"
          className="text-xs text-core-dark/60 hover:underline dark:text-core-gray"
        >
          Cerrar sesión
        </a>
      </div>
    </div>
  );
}
