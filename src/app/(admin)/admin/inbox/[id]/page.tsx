"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const report = {
  fristname: "Asd",
  lastname: "Asdasd",
  email: "asdasd@gmail.com",
  message: "Hello, I wanted to report a small issue with the system. It seems that when I try to upload a file, it doesn't process correctly. Please look into this when possible. Thank you!",
  topic: "System Bug Report",
  createdAt: "2025-11-10",
};

function Page() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="flex justify-center p-8 min-h-[90vh]">
      <Card className="w-full max-w-5xl shadow-md border border-gray-200 rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/inbox")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-lg font-semibold">
              {report.topic}
            </CardTitle>
          </div>
          <span className="text-sm text-gray-500">#{id}</span>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Sender Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-gray-700">
              <span className="font-medium">
                {report.fristname} {report.lastname}
              </span>{" "}
              <span className="text-gray-500">&lt;{report.email}&gt;</span>
            </div>
            <div className="text-sm text-gray-400 mt-2 sm:mt-0">
              {new Date(report.createdAt).toLocaleDateString()}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Message */}
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {report.message}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
