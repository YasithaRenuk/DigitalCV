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

  // Username: lowercase only, no spaces
  const usernameRegex =
    /^[a-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/;

  // PIN: exactly 4 digits
  const pinRegex = /^\d{4}$/;

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      setErrors((prev) => ({ ...prev, cv: undefined }));
      setBackendError("");
    }
  };

  const handleRemoveFile = (index: number) => {
    setCvFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    setBackendError("");

    const newErrors: typeof errors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (!usernameRegex.test(username)) {
      newErrors.username =
        "Username must be lowercase, contain no spaces, and may include numbers/special characters.";
    }

    if (!pin.trim()) {
      newErrors.pin = "PIN is required";
    } else if (!pinRegex.test(pin)) {
      newErrors.pin = "PIN must be exactly 4 digits.";
    }

    if (cvFiles.length === 0) {
      newErrors.cv = "Please upload at least one file";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (!session?.user) {
      setBackendError("Please log in to create a CV");
      setTimeout(() => router.push("/loginpage"), 2000);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", pin);

      cvFiles.forEach((file) => {
        formData.append("cvFiles", file);
      });

      const response = await fetch("/api/usercv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors((prev) => ({
            ...prev,
            username: data?.error || "Username already exists",
          }));
          return;
        }

        if (response.status === 401 || response.status === 403) {
          setBackendError("Session expired. Please log in again.");
          setTimeout(() => router.push("/loginpage"), 2000);
          return;
        }

        setBackendError(data?.error || "Failed to create CV");
        return;
      }

      setUsername("");
      setPin("");
      setCvFiles([]);
      setErrors({});

      router.push(`/showcv?id=${data.userCV.id}`);
    } catch (err) {
      setBackendError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-5 sm:pl-8 sm:pr-8 mx-auto">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 text-center">
        Upload Your CV
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-6 text-center">
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
              setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
              setErrors((prev) => ({ ...prev, pin: undefined }));
            }}
            className={`h-12 pr-12 ${
              errors.pin ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          <span
            onClick={() => setShowPword(!showPword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 p-1"
          >
            {showPword ? <Eye /> : <EyeClosed />}
          </span>
        </div>
        {errors.pin && (
          <p className="text-sm text-red-500 mt-1">{errors.pin}</p>
        )}
      </div>

      {/* Upload */}
      <label
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 sm:p-10 cursor-pointer transition
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
              className="flex items-center justify-between gap-3 bg-gray-50 border rounded-lg px-3 py-2"
            >
              <span className="truncate max-w-[180px] sm:max-w-full">
                {file.name}
              </span>
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
      <p className="text-[11px] sm:text-xs text-center mt-5 bg-orange-100 text-orange-700 py-2 px-3 rounded-full">
        Keep your username & PIN safe — recruiters need them to view your CV.
      </p>

      {/* Submit */}
      <Button
        onClick={handleCreate}
        disabled={isLoading}
        variant="secondary"
        className="w-full mt-6 h-12 text-white transition sm:hover:bg-white sm:hover:text-secondary sm:hover:border-secondary sm:hover:border-2"
      >
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </div>
  );
}
