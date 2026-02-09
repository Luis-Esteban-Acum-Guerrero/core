// File: components/OTPForm.jsx
import React from "react";

export function OTPForm({ onVerify }) {
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const handleChange = (i, v) => {
    const arr = [...code];
    arr[i] = v;
    setCode(arr);
  };
  return (
    <div className="flex items-center space-x-2">
      {code.map((d, i) => (
        <input
          key={i}
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          className="w-10 h-10 text-center border rounded-lg"
        />
      ))}
      <button
        onClick={() => onVerify(code.join(""))}
        className="ml-4 py-2 bg-core-primary text-core-dark rounded-lg hover:opacity-80"
      >
        Verify
      </button>
    </div>
  );
}
