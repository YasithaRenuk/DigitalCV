"use client";

import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

const SearchDigitalCV: React.FC = () => {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [errors, setErrors] = useState({ username: "", pin: "" });

  const handleSearch = () => {
    let valid = true;
    const newErrors = { username: "", pin: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required.";
      valid = false;
    }

    if (!pin.trim()) {
      newErrors.pin = "PIN is required.";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      console.log("Searching DigitalCV for:", { username, pin });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 w-3xl">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Search DigitalCV
      </h1>

      {/* Username Input */}
      <div className="w-full max-w-sm mb-4">
        <input
          type="text"
          placeholder="Enter username here"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full border rounded-md px-4 py-2 outline-none focus:ring-2 ${
            errors.username
              ? "border-red-500 ring-red-200"
              : "border-orange-400 focus:ring-orange-200"
          }`}
        />
        {errors.username && (
          <p className="text-sm text-red-500 mt-1">{errors.username}</p>
        )}
      </div>

      {/* PIN Input */}
      <div className="w-full max-w-sm mb-6 relative">
        <input
          type={showPin ? "text" : "password"}
          placeholder="Enter PIN here"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className={`w-full border rounded-md px-4 py-2 pr-10 outline-none focus:ring-2 ${
            errors.pin
              ? "border-red-500 ring-red-200"
              : "border-orange-400 focus:ring-orange-200"
          }`}
        />
        <button
          type="button"
          className="absolute right-3 top-2.5 text-gray-600"
          onClick={() => setShowPin(!showPin)}
        >
          {!showPin ? <EyeClosed size={20} /> : <Eye size={20} />}
        </button>
        {errors.pin && <p className="text-sm text-red-500 mt-1">{errors.pin}</p>}
      </div>

      {/* Search Button */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleSearch}
          className="w-full bg-secondary text-white font-semibold py-2 rounded-md hover:bg-white hover:text-secondary hover:border-secondary hover:border-2 transition-colors"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchDigitalCV;
