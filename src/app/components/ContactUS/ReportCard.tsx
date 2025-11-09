"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, User, MessageSquare } from "lucide-react";

interface ReportCardProps {
  report: {
    id: string;
    firstName: string;
    lastName?: string;
    topic: string;
    message: string;
    createdAt: string | Date;
  };
}

export default function ReportCard({ report }: ReportCardProps) {
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-full max-w-xl mx-auto border-primary border-2 shadow-md">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          <CardTitle className="text-xl sm:text-2xl">
            Report Submitted Successfully
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* User Info */}
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Submitted by</p>
            <p className="font-semibold">
              {report.firstName} {report.lastName || ""}
            </p>
          </div>
        </div>

        {/* Topic */}
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">Topic</p>
            <Badge variant="secondary" className="text-sm">
              {report.topic}
            </Badge>
          </div>
        </div>

        {/* Message */}
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">Message</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {report.message}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-start gap-3 pt-2 border-t">
          <Calendar className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">Submitted on</p>
            <p className="text-sm font-medium">{formatDate(report.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

