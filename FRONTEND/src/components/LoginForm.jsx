// File: components/LoginForm.jsx
import React from "react";

export function LoginForm({ onSubmit }) {
  const [phone, setPhone] = React.useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(phone);
      }}
      className="space-y-4"
    >
      <input
        type="tel"
        placeholder="+56 9 XXXX XXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full py-2 px-3 border rounded-lg"
      />
      <button
        type="submit"
        className="w-full py-2 bg-core-primary text-core-dark rounded-lg hover:opacity-80"
      >
        Send OTP
      </button>
    </form>
  );
}
