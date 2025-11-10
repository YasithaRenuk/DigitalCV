"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Mail, Loader2 } from "lucide-react";
import ReportCard from "./ReportCard";

interface InquiryFormProps {
  reasonTopic?: string;
}

export default function InquiryForm({ reasonTopic = "" }: InquiryFormProps) {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    topic: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);
  const [submitError, setSubmitError] = useState<string>("");

  const topics = [
    "Report an issue on Your CV",
    "Change username and PIN",
    "Account Support",
    "Extend membership",
    "Feature Request",
    "Feedback",
  ];

  // Prefill user's first name
  useEffect(() => {
    if (session?.user?.name) {
      const [first] = session.user.name.split(" ");
      setForm((prev) => ({ ...prev, firstName: first }));
    }
  }, [session]);

  // Auto-select topic if valid reasonTopic is provided
  useEffect(() => {
    if (reasonTopic && topics.includes(reasonTopic)) {
      console.log("reasonTopic",reasonTopic)
      setForm((prev) => ({ ...prev, topic: reasonTopic }));
    }
  }, [reasonTopic]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.topic.trim()) newErrors.topic = "Please select a topic";
    if (!form.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          topic: form.topic,
          message: form.message,
          email: session?.user.email? session?.user.email : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit report");
      }

      // Show the submitted report card
      setSubmittedReport(data.report);
      
      // Reset form
      setForm({
        firstName: session?.user?.name?.split(" ")[0] || "",
        lastName: "",
        topic: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error submitting report:", error);
      setSubmitError(error.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If report was submitted successfully, show the report card
  if (submittedReport) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 md:px-8">
        <ReportCard report={submittedReport} />
        <Button
          onClick={() => setSubmittedReport(null)}
          variant="outline"
          className="w-full mt-4"
        >
          Submit Another Report
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-6 md:px-8">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900 text-center md:text-left">
        Send An Inquiry To Us
      </h2>

      {/* Error Message */}
      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name fields */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              disabled={isSubmitting}
              className={`${
                errors.firstName ? "border-red-500" : "border-secondary"
              } w-full`}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="flex-1">
            <Input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              disabled={isSubmitting}
              className="border-secondary w-full"
            />
          </div>
        </div>

        {/* Topic */}
        <div>
          <Select
            value={form.topic || undefined}
            onValueChange={(value) => setForm({ ...form, topic: value })}
            disabled={isSubmitting}
          >
            <SelectTrigger
              className={`${
                errors.topic ? "border-red-500" : "border-secondary"
              } border w-full`}
            >
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.topic && (
            <p className="text-sm text-red-500 mt-1">{errors.topic}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <Textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            disabled={isSubmitting}
            className={`resize-none h-40 sm:h-48 ${
              errors.message ? "border-red-500" : "border-secondary"
            }`}
          />
          {errors.message && (
            <p className="text-sm text-red-500 mt-1">{errors.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="secondary"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-6 text-base sm:text-lg font-medium hover:border-secondary hover:text-black hover:border-2 hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              Send
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
