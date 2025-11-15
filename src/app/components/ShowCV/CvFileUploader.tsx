"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

type CvFileUploaderProps = {
  userCVId: string;
};

export default function CvFileUploader({ userCVId }: CvFileUploaderProps) {
  const [cvFiles, setCvFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ cv?: string }>({});

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setCvFiles((prev) => [...prev, ...files]);
    setErrors({ cv: undefined });
  };

  const handleRemoveFile = (index: number) => {
    setCvFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (cvFiles.length === 0) {
      setErrors({ cv: "Please upload at least one file" });
      return;
    }

    console.log("UserCVId:", userCVId);
    console.log("Selected Files:", cvFiles);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg border">
      <h2 className="text-xl font-semibold text-center mb-4">Upload new Files</h2>

      {/* Upload Box */}
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
          <span className="text-gray-600">Upload your new files</span>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Supported: PDF, DOC, DOCX, Images
        </p>

        {errors.cv && (
          <div className="flex items-center gap-1 mt-2 justify-center">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-red-500 text-sm">{errors.cv}</p>
          </div>
        )}
      </label>

      {/* Selected Files List */}
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

      {/* Create Button */}
      <Button
        className="w-full  hover:bg-secondary hover:text-white hover:border-secondary hover:border-2"
        variant="outline"
        onClick={handleCreate}
      >
        Create
      </Button>
    </div>
  );
}
