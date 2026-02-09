import React from "react";
import * as LucideIcons from "lucide-react";

export default function Icon({ icon, className = "", ...props }) {
  // Si no hay icono, dibujamos un placeholder
  if (!icon) {
    return (
      <span
        className={`inline-block w-4 h-4 bg-green-400 rounded ${className}`}
        {...props}
      />
    );
  }

  if (icon === "c0re") {
    return (
      <img src="/logos/core/core_dot.svg" className="w-7 h-7" alt="c0re" />
    );
  }

  // Si el icono es un string, buscamos el componente correspondiente
  if (typeof icon === "string") {
    const IconComponent =
      LucideIcons[icon.charAt(0).toUpperCase() + icon.slice(1)];
    if (!IconComponent) {
      console.warn(`Icon ${icon} not found in lucide-react`);
      return (
        <span
          className={`inline-block w-4 h-4 bg-yellow-400 rounded ${className}`}
          {...props}
        />
      );
    }
    return <IconComponent className={className} {...props} />;
  }

  // Si el icono es un componente, lo renderizamos directamente
  return React.createElement(icon, { className, ...props });
}
