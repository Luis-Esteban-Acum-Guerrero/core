// src/components/TextBox.jsx
import React, { useState } from "react";

export default function TextBox() {
  const [text, setText] = useState("");
  const send = () => setText("");
  return (
    <div className="p-4 border-t border-core-gray/20 dark:border-neutral-700 flex items-center space-x-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe un mensaje..."
        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
      />
      <button
        onClick={send}
        className="px-4 py-2 bg-core-primary text-core-dark rounded-lg hover:opacity-80"
      >
        Enviar
      </button>
    </div>
  );
}
