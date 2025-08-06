// components/EmailAlertSection.tsx

import { subscribeToAlerts } from "@/lib/api";
import { useState } from "react";

export default function EmailAlertSection() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    try {
      await subscribeToAlerts(email);
      setSuccess(true);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Subscription failed.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl rounded-lg overflow-hidden shadow-lg"
    >
      <input
        type="email"
        placeholder="Enter your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-grow px-4 py-3 text-black text-base focus:outline-none"
      />
      <button
        type="submit"
        className="bg-white text-[#2E7D32] p-3 flex items-center justify-center"
        aria-label="Submit email"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>

      {success && (
        <p className="text-green-600 ml-4">Subscribed successfully!</p>
      )}
      {error && <p className="text-red-600 ml-4">{error}</p>}
    </form>
  );
}
