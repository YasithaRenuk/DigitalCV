"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchDigitalCVProps {
  username?: string;
  pin?: string;
}

const SearchDigitalCV: React.FC<SearchDigitalCVProps> = ({
  username: initialUsername = "",
  pin: initialPin = "",
}) => {
  const router = useRouter();
  const [username, setUsername] = useState(initialUsername);
  const [pin, setPin] = useState(initialPin);
  const [showPin, setShowPin] = useState(false);
  const [errors, setErrors] = useState({ username: "", pin: "" });
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialUsername) setUsername(initialUsername);
    if (initialPin) setPin(initialPin);
  }, [initialUsername, initialPin]);

  const handleSearch = async () => {
    let valid = true;
    const newErrors = { username: "", pin: "" };
    setApiError("");

    if (!username.trim()) {
      newErrors.username = "Username is required.";
      valid = false;
    }

    if (!pin.trim()) {
      newErrors.pin = "PIN is required.";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/serchCV", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          pin: pin.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.id) {
        setApiError(data?.error || "Invalid username or PIN.");
        return;
      }

      router.push(`/CV?id=${data.id}`);
    } catch (error) {
      console.error(error);
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <h2 className="text-xl font-bold mb-2  text-center">
          Digital<span className="text-orange-500">CV</span>
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Please enter your details to search your DigitalCV
        </p>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full border rounded-md px-4 py-2 outline-none focus:ring-2 ${
              errors.username
                ? "border-red-500 ring-red-200"
                : "border-gray-300 focus:ring-orange-200"
            }`}
          />
          {errors.username && (
            <p className="text-xs text-red-500 mt-1">
              {errors.username}
            </p>
          )}
        </div>

        {/* PIN */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium mb-1">
            PIN
          </label>
          <input
            type={showPin ? "text" : "password"}
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className={`w-full border rounded-md px-4 py-2 pr-10 outline-none focus:ring-2 ${
              errors.pin
                ? "border-red-500 ring-red-200"
                : "border-gray-300 focus:ring-orange-200"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showPin ? <Eye size={18} /> : <EyeClosed size={18} />}
          </button>
          {errors.pin && (
            <p className="text-xs text-red-500 mt-1">
              {errors.pin}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full bg-orange-500 text-white font-semibold py-2 rounded-md hover:bg-orange-600 transition"
        >
          {isLoading ? "Searching..." : "Search CV"}
        </button>

        {apiError && (
          <p className="text-sm text-red-500 mt-3 text-center">
            {apiError}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchDigitalCV;
