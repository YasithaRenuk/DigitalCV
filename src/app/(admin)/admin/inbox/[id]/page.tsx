"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

interface Report {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  message?: string;
  topic?: string;
  createdAt: string;
  updatedAt?: string;
}

function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const reportId = Array.isArray(id) ? id[0] : id;
        if (!reportId) {
          setError("Invalid report ID");
          return;
        }
        
        const response = await fetch(`/api/reports/${reportId}`);
        const data = await response.json();

        if (data.success) {
          setReport(data.report);
        } else {
          setError(data.error || "Failed to fetch report");
        }
      } catch (err) {
        setError("Failed to fetch report");
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center p-8 min-h-[90vh]">
        <Card className="w-full max-w-5xl shadow-md border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="text-center py-12 text-gray-500">
              Loading report...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex justify-center p-8 min-h-[90vh]">
        <Card className="w-full max-w-5xl shadow-md border border-gray-200 rounded-2xl">
          <CardHeader className="flex flex-row items-center gap-3 border-b px-6 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/inbox")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-lg font-semibold">Error</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-12 text-red-500">
              {error || "Report not found"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {report.topic || "No Topic"}
            </CardTitle>
          </div>
          <span className="text-sm text-gray-500">
            #{Array.isArray(id) ? id[0] : id}
          </span>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Sender Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-gray-700">
              <span className="font-medium">
                {report.firstName} {report.lastName || ""}
              </span>
              {report.email && (
                <>
                  {" "}
                  <span className="text-gray-500">&lt;{report.email}&gt;</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-400 mt-2 sm:mt-0">
              {new Date(report.createdAt).toLocaleDateString()}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Message */}
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {report.message || "No message content."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
