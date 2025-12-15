"use client";

import React, { useState, useEffect } from "react";
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
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";

interface Payment {
  id: string;
  userID: string;
  CVID: string;
  amount: number;
  currency: string;
  genieTransactionId: string;
  transactionId: string;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  } | null;
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch Payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/payment");
        const data = await response.json();

        if (data.success) {
          setPayments(data.payments);
        } else {
          setError(data.error || "Failed to fetch payments");
        }
      } catch (err) {
        setError("Failed to fetch payments");
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter payments by transactionId or email
  const filteredPayments = payments.filter((payment) => {
    const email = payment.user?.email ?? "";
    const transactionId = payment.transactionId ?? "";
    const genieTransactionId = payment.genieTransactionId ?? "";

    const searchLower = searchTerm.toLowerCase();

    return (
      email.toLowerCase().includes(searchLower) ||
      transactionId.toLowerCase().includes(searchLower) ||
      genieTransactionId.toLowerCase().includes(searchLower)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const allSelected =
    paginatedPayments.length > 0 &&
    paginatedPayments.every((payment) => selectedPayments.includes(payment.id));

  // Handle single checkbox
  const toggleSelect = (id: string) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedPayments((prev) =>
        prev.filter((id) => !paginatedPayments.map((p) => p.id).includes(id))
      );
    } else {
      const newSelected = [
        ...new Set([...selectedPayments, ...paginatedPayments.map((p) => p.id)]),
      ];
      setSelectedPayments(newSelected);
    }
  };

  // Mask email
  const maskEmail = (email: string) => {
    if (!email) return "N/A";
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
      return `${localPart[0]}*****@${domain}`;
    }
    return `${localPart.substring(0, 2)}*****@${domain}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500 text-white";
      case "PENDING":
        return "bg-yellow-500 text-white";
      case "FAILED":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format amount
  const formatAmount = (amount: number, currency: string) => {
    return `${currency} ${(amount/100).toFixed(2)}`;
  };

  return (
    <div className="flex justify-center p-8 min-h-[90%]">
      <Card className="w-full max-w-7xl shadow-lg border border-gray-200 rounded-2xl">
        <CardHeader className="text-left border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-2xl font-semibold text-gray-800 ml-10">
            Payments Management
          </CardTitle>

          <div className="flex items-center gap-3 mr-10">
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search by transaction ID or email..."
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
              Loading payments...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-gray-700 font-semibold w-12">
                    <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">User Email</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Transaction ID</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Amount</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Created Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedPayments.length > 0 ? (
                  paginatedPayments.map((payment, index) => (
                    <TableRow
                      key={payment.id}
                      className={`hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <TableCell
                        className="font-medium text-gray-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selectedPayments.includes(payment.id)}
                          onCheckedChange={() => toggleSelect(payment.id)}
                        />
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {payment.user?.email ? maskEmail(payment.user.email) : "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-600 font-mono text-sm">
                        {payment.transactionId || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-800 font-semibold">
                        {formatAmount(payment.amount, payment.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatDate(payment.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No matching payments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>

        {!loading && !error && filteredPayments.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredPayments.length}
          />
        )}
      </Card>
    </div>
  );
}
