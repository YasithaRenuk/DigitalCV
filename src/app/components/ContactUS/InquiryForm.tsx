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
import { Mail, Loader2, Send, CheckCircle2 } from "lucide-react";
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
    "Report an Issue on Your CV",
    "Change Username and PIN",
    "Account Support",
    "Extend Membership",
    "Feature Request",
    "Feedback",
    "Other"
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
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-900">Inquiry Sent Successfully!</h3>
            <p className="text-sm text-green-600 mt-2">
                We have received your message and will get back to you shortly.
            </p>
        </div>
        <ReportCard report={submittedReport} />
        <Button
          onClick={() => setSubmittedReport(null)}
          variant="outline"
          className="w-full border-2 hover:bg-gray-50 hover:text-gray-900 text-gray-700 font-medium py-6"
        >
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-8">
         <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Get in touch
        </h2>
        <p className="text-gray-500">
            We'd love to hear from you. Please fill out this form.
        </p>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
           <div className="shrink-0 mt-0.5">
             <div className="h-2 w-2 bg-red-500 rounded-full" />
           </div>
          <p className="text-sm text-red-600 font-medium">{submitError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
            <Input
              name="firstName"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              disabled={isSubmitting}
              className={`${
                errors.firstName ? "border-red-500 focus-visible:ring-red-500 bg-red-50/50" : "border-gray-200 focus-visible:ring-blue-500"
              } w-full h-11 text-base transition-all duration-200`}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 font-medium ml-1">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-1.5">
             <label className="text-sm font-medium text-gray-700">Last Name</label>
            <Input
              name="lastName"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              disabled={isSubmitting}
              className="border-gray-200 focus-visible:ring-blue-500 w-full h-11 text-base transition-all duration-200"
            />
          </div>
        </div>

        {/* Topic */}
        <div className="space-y-1.5">
           <label className="text-sm font-medium text-gray-700">Topic <span className="text-red-500">*</span></label>
          <Select
            value={form.topic || undefined}
            onValueChange={(value) => setForm({ ...form, topic: value })}
            disabled={isSubmitting}
          >
            <SelectTrigger
              className={`${
                errors.topic ? "border-red-500 focus:ring-red-500 bg-red-50/50" : "border-gray-200 focus:ring-blue-500"
              } w-full h-11 text-base transition-all duration-200`}
            >
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic} className="cursor-pointer">
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.topic && (
            <p className="text-xs text-red-500 font-medium ml-1">{errors.topic}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
           <label className="text-sm font-medium text-gray-700">Message <span className="text-red-500">*</span></label>
          <Textarea
            name="message"
            placeholder="How can we help you?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            disabled={isSubmitting}
            className={`resize-none min-h-[160px] p-4 text-base ${
              errors.message ? "border-red-500 focus-visible:ring-red-500 bg-red-50/50" : "border-gray-200 focus-visible:ring-blue-500"
            } transition-all duration-200`}
          />
          {errors.message && (
            <p className="text-xs text-red-500 font-medium ml-1">{errors.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-white font-semibold text-base shadow-lg shadow-blue-600/20 transition-all duration-300 transform active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
