"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Report {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  topic?: string;
  message?: string;
  createdAt: string;
}

export default function Inbox() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/reports");
        const data = await response.json();

        if (data.success) {
          setReports(data.reports);
        } else {
          setError(data.error || "Failed to fetch reports");
        }
      } catch (err) {
        setError("Failed to fetch reports");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) =>
    Object.values(report)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const allSelected =
    filteredReports.length > 0 &&
    filteredReports.every((r) => selectedReports.includes(r.id));

  // Handle single checkbox
  const toggleSelect = (id: string) => {
    setSelectedReports((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedReports((prev) =>
        prev.filter((id) => !filteredReports.map((r) => r.id).includes(id))
      );
    } else {
      const newSelected = [
        ...new Set([...selectedReports, ...filteredReports.map((r) => r.id)]),
      ];
      setSelectedReports(newSelected);
    }
  };

  // Handle delete action
  const handleDelete = async () => {
    if (selectedReports.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedReports.length} report(s)?`)) {
      return;
    }

    try {
      const response = await fetch("/api/reports", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedReports }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove deleted reports from state
        setReports((prev) => prev.filter((r) => !selectedReports.includes(r.id)));
        setSelectedReports([]);
      } else {
        alert(`Error: ${data.error || "Failed to delete reports"}`);
      }
    } catch (err) {
      console.error("Error deleting reports:", err);
      alert("Failed to delete reports");
    }
  };

  return (
    <div className="flex justify-center p-8 min-h-[90%]">
      <Card className="w-full max-w-5xl shadow-lg border border-gray-200 rounded-2xl">
        <CardHeader className="text-left border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-2xl font-semibold text-gray-800 ml-10">
            Inbox Reports
          </CardTitle>

          <div className="flex items-center gap-3 mr-10">
            {/* Delete Button */}
            {selectedReports.length > 0 && (
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                className="rounded-full"
              >
                <Trash2 size={18} />
              </Button>
            )}

            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto p-0 ml-10">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading reports...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              {error}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-gray-700 font-semibold w-12">
                    <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">ID</TableHead>
                  <TableHead className="text-gray-700 font-semibold">First Name</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Topic</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, index) => (
                    <TableRow
                      key={report.id}
                      className={`cursor-pointer hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                      onClick={() => router.push(`/admin/inbox/${report.id}`)}
                    >
                      <TableCell
                        className="font-medium text-gray-900"
                        onClick={(e) => e.stopPropagation()} // prevent row click
                      >
                        <Checkbox
                          checked={selectedReports.includes(report.id)}
                          onCheckedChange={() => toggleSelect(report.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {report.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="text-gray-800">{report.firstName}</TableCell>
                      <TableCell className="text-gray-600">{report.email || "N/A"}</TableCell>
                      <TableCell className="text-gray-700">{report.topic || "N/A"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No matching reports found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
