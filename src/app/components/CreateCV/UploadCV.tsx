"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
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

  const [errors, setErrors] = useState<{ username?: string; pin?: string; cv?: string }>({});

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
      setErrors((prev) => ({ ...prev, cv: undefined }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setCvFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!pin.trim()) newErrors.pin = "PIN is required";
    if (cvFiles.length === 0) newErrors.cv = "Please upload at least one file";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (!session || !session.user) {
      alert("Please log in to create a CV");
      router.push("/loginpage");
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData to send username, password, and files
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", pin);
      
      // Append all CV files (accepted but not processed as per requirements)
      cvFiles.forEach((file) => {
        formData.append("cvFiles", file);
      });

      const response = await fetch("/api/usercv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create UserCV");
      }

      // Success - reset form and show success message
      alert("CV created successfully!");
      setUsername("");
      setPin("");
      setCvFiles([]);
      setErrors({});
    } catch (error: any) {
      console.error("Error creating UserCV:", error);
      alert(error.message || "Failed to create CV. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6">Upload Your CV</h2>

      {/* Username */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`border-orange-300 ${errors.username ? "border-red-500" : ""}`}
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
      </div>

      {/* PIN */}
      <div className="mb-4">
        <div className="relative">
          <Input
            type={showPword ? "text" : "password"}
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className={`pr-10 border-orange-300 ${errors.pin ? "border-red-500" : ""}`}
          />

          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPword(!showPword)}
          >
            {showPword ? <Eye /> : <EyeClosed />}
          </span>
        </div>

        {errors.pin && (
          <p className="text-red-500 text-sm mt-1">{errors.pin}</p>
        )}
      </div>


      {/* File Upload */}
      <label
        className={`block border rounded-lg p-6 text-center cursor-pointer mb-4 ${
          errors.cv ? "border-red-500 bg-red-50" : "border-orange-300"
        } hover:bg-orange-50 transition`}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx,image/*"
          className="hidden"
          multiple
          onChange={handleUpload}
        />
        <div className="flex flex-col items-center justify-center">
          <img src="/UploadtoCloud.png" alt="Upload Icon" className="w-10 h-10 mb-2" />
          <span className="text-gray-600">Upload Your CV here</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Supported: PDF, DOC, DOCX, or Image
        </p>
        {errors.cv && <p className="text-red-500 text-sm mt-1">{errors.cv}</p>}
      </label>

      {/* Selected Files */}
      {cvFiles.length > 0 && (
        <ul className="mb-4 text-sm text-gray-700 space-y-2">
          {cvFiles.map((file, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded"
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                className="text-red-500 text-sm hover:underline"
                onClick={() => handleRemoveFile(idx)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-center mb-4 bg-[#F1752F]/10 p-2 rounded-full">
        Keep your username & PIN safe — required for recruiters to access your CV.
      </p>

      {/* Create Button */}
      <Button 
        onClick={handleCreate} 
        className="w-full  text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border-2" 
        variant="secondary"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </div>
  );
}
