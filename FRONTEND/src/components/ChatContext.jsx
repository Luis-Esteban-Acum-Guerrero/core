// src/components/ChatContext.jsx
import React from "react";

export default function ChatContext({ messages }) {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg.from === "soporte1" ? "justify-start" : "justify-end"
          }`}
        >
          <div className="max-w-xs px-4 py-2 bg-core-gray/10 rounded-lg dark:bg-neutral-700">
            <p className="text-sm">{msg.msg}</p>
            <span className="text-xs text-core-dark/60">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
