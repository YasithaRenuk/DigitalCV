"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UploadCV() {
  const [username, setUsername] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [cvFiles, setCvFiles] = useState<File[]>([]);
  const [showPword, setShowPword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();

  const [errors, setErrors] = useState<{
    username?: string;
    pin?: string;
    cv?: string;
  }>({});
  const [backendError, setBackendError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Username: lowercase only, no spaces, numbers & special chars allowed
  // (Disallows whitespace and uppercase letters)
  const usernameRegex =
    /^[a-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/;

  // PIN: exactly 4 digits
  const pinRegex = /^\d{4}$/;

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
      setErrors((prev) => ({ ...prev, cv: undefined }));
      setBackendError("");
    }
  };

  const handleRemoveFile = (index: number) => {
    setCvFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    // Clear previous messages
    setBackendError("");
    setSuccessMessage("");

    const newErrors: typeof errors = {};

    // ---- CLIENT VALIDATION ----
    const usernameValue = username;
    const pinValue = pin;

    // Required checks
    if (!usernameValue.trim()) {
      newErrors.username = "Username is required";
    } else if (!usernameRegex.test(usernameValue)) {
      newErrors.username =
        "Username must be lowercase, contain no spaces, and may include numbers/special characters.";
    }

    if (!pinValue.trim()) {
      newErrors.pin = "PIN is required";
    } else if (!pinRegex.test(pinValue)) {
      newErrors.pin = "PIN must be exactly 4 digits.";
    }

    if (cvFiles.length === 0) {
      newErrors.cv = "Please upload at least one file";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    // ---- END VALIDATION ----

    if (!session || !session.user) {
      setBackendError("Please log in to create a CV");
      setTimeout(() => router.push("/loginpage"), 2000);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", usernameValue);
      formData.append("password", pinValue);

      cvFiles.forEach((file) => {
        formData.append("cvFiles", file);
      });

      const response = await fetch("/api/usercv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.error || "Failed to create UserCV";

        if (response.status === 409) {
          // show as field error (username area)
          setErrors((prev) => ({
            ...prev,
            username: errorMessage,
          }));
          return;
        }

        if (response.status === 401 || response.status === 403) {
          setBackendError(
            "You are not authorized to perform this action. Please log in again."
          );
          setTimeout(() => router.push("/loginpage"), 2000);
          return;
        }

        setBackendError(errorMessage);
        return;
      }

      setUsername("");
      setPin("");
      setCvFiles([]);
      setErrors({});

      router.push(`/showcv?id=${data.userCV.id}`);
    } catch (error: unknown) {
      console.error("Error creating UserCV:", error);
      if (!backendError && !errors.username) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create CV. Please try again.";
        setBackendError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-2 text-gray-900 text-center">
        Upload Your CV
      </h2>
      <p className="text-gray-500 mb-6 text-center">
        Upload the CV to build your professional profile. We'll optimize the rest.
      </p>

      {/* Backend Error */}
      {backendError && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg border border-red-300 bg-red-50">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-600">{backendError}</p>
        </div>
      )}

      {/* Username */}
      <div className="mb-4">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => {
            const v = e.target.value.toLowerCase().replace(/\s+/g, "");
            setUsername(v);
            setErrors((prev) => ({ ...prev, username: undefined }));
          }}
          className={`h-12 ${
            errors.username ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        {errors.username && (
          <p className="text-sm text-red-500 mt-1">{errors.username}</p>
        )}
      </div>

      {/* PIN */}
      <div className="mb-6">
        <div className="relative">
          <Input
            type={showPword ? "text" : "password"}
            placeholder="4 Digit PIN"
            value={pin}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 4);
              setPin(v);
              setErrors((prev) => ({ ...prev, pin: undefined }));
            }}
            className={`h-12 pr-10 ${
              errors.pin ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          <span
            onClick={() => setShowPword(!showPword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPword ? <Eye /> : <EyeClosed />}
          </span>
        </div>
        {errors.pin && (
          <p className="text-sm text-red-500 mt-1">{errors.pin}</p>
        )}
      </div>

      {/* Upload Area */}
      <label
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 cursor-pointer transition
          ${
            errors.cv
              ? "border-red-500 bg-red-50"
              : "border-orange-400 hover:bg-orange-50"
          }`}
      >
        <input
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,image/*"
          onChange={handleUpload}
        />

        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mb-3">
          <img src="/UploadtoCloud.png" className="w-7 h-7" />
        </div>

        <p className="font-medium text-gray-700">Upload Existing CV</p>
        <p className="text-sm text-gray-400 mt-1">
          PDF, DOC, DOCX or Image
        </p>

        {errors.cv && (
          <p className="text-sm text-red-500 mt-3">{errors.cv}</p>
        )}
      </label>

      {/* Selected Files */}
      {cvFiles.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {cvFiles.map((file, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-gray-50 border rounded-lg px-3 py-2"
            >
              <span className="truncate">{file.name}</span>
              <button
                onClick={() => handleRemoveFile(idx)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Info */}
      <p className="text-xs text-center mt-5 bg-orange-100 text-orange-700 py-2 rounded-full">
        Keep your username & PIN safe — recruiters need them to view your CV.
      </p>

      {/* Submit */}
      <Button
        onClick={handleCreate}
        disabled={isLoading}
        variant="secondary"
        className="w-full mt-6 h-12 text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border-2"
      >
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </div>
  );

}
