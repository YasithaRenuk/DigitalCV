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
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit2, Trash2, Calendar, Ticket, BarChart2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";

interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  referenceName?: string;
  usedCount: number;
  createdAt: string;
}

interface CouponUsage {
  id: string;
  couponCode: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  cvId: string;
  paymentId: string;
  discountPercentage: number;
  discountAmount: number;
  createdAt: string;
}

type ViewMode = "coupons" | "usages";

export default function CouponsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("coupons");
  const [searchTerm, setSearchTerm] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [usages, setUsages] = useState<CouponUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formCode, setFormCode] = useState("");
  const [formDiscount, setFormDiscount] = useState<number>(10);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formReferenceName, setFormReferenceName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // Usages dialog
  const [usagesDialogOpen, setUsagesDialogOpen] = useState(false);
  const [selectedCouponUsages, setSelectedCouponUsages] = useState<CouponUsage[]>([]);
  const [selectedCouponCode, setSelectedCouponCode] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch Coupons (and optionally usages)
  const fetchCoupons = async (withUsages = false) => {
    try {
      setLoading(true);
      const url = withUsages ? "/api/coupon?usages=1" : "/api/coupon";
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setCoupons(data.coupons);
        if (data.usages) setUsages(data.usages);
      } else {
        setError(data.error || "Failed to fetch coupons");
      }
    } catch (err) {
      setError("Failed to fetch coupons");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(true);
  }, []);

  const handleOpenCreateDialog = () => {
    setEditingCoupon(null);
    setFormCode("");
    setFormDiscount(10);
    setFormIsActive(true);
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 1);
    const formattedEnd = targetDate.toISOString().split("T")[0];
    setFormStartDate(formattedToday);
    setFormEndDate(formattedEnd);
    setFormReferenceName("");
    setFormError(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormCode(coupon.code);
    setFormDiscount(coupon.discountPercentage);
    setFormIsActive(coupon.isActive);
    setFormStartDate(coupon.startDate ? coupon.startDate.split("T")[0] : "");
    setFormEndDate(coupon.endDate ? coupon.endDate.split("T")[0] : "");
    setFormReferenceName(coupon.referenceName || "");
    setFormError(null);
    setDialogOpen(true);
  };

  const handleOpenUsagesDialog = (coupon: Coupon) => {
    setSelectedCouponCode(coupon.code);
    setSelectedCouponUsages(usages.filter((u) => u.couponCode === coupon.code));
    setUsagesDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formCode.trim()) { setFormError("Coupon code is required"); return; }
    if (formDiscount < 0 || formDiscount > 100) { setFormError("Discount percentage must be between 0 and 100"); return; }
    if (!formStartDate || !formEndDate) { setFormError("Start date and End date are required"); return; }
    if (new Date(formStartDate) > new Date(formEndDate)) { setFormError("Start date cannot be after end date"); return; }

    try {
      setFormSubmitting(true);
      const payload = {
        id: editingCoupon?.id,
        code: formCode.trim().toUpperCase(),
        discountPercentage: Number(formDiscount),
        isActive: formIsActive,
        startDate: formStartDate,
        endDate: formEndDate,
        referenceName: formReferenceName.trim() || undefined,
      };

      const method = editingCoupon ? "PUT" : "POST";
      const response = await fetch("/api/coupon", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setDialogOpen(false);
        fetchCoupons(true);
      } else {
        setFormError(data.error || "Something went wrong");
      }
    } catch (err) {
      setFormError("Failed to save coupon");
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteClick = (coupon: Coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;
    try {
      const response = await fetch("/api/coupon", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: couponToDelete.id }),
      });
      const data = await response.json();
      if (data.success) {
        setDeleteDialogOpen(false);
        setCouponToDelete(null);
        fetchCoupons(true);
      } else {
        alert(data.error || "Failed to delete coupon");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete coupon");
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const s = `${coupon.code} ${coupon.referenceName || ""} ${coupon.discountPercentage}`.toLowerCase();
    return s.includes(searchTerm.toLowerCase());
  });

  const filteredUsages = usages.filter((u) => {
    const s = `${u.couponCode} ${u.userEmail || ""} ${u.userName || ""}`.toLowerCase();
    return s.includes(searchTerm.toLowerCase());
  });

  // Pagination
  const activePaginationList = viewMode === "coupons" ? filteredCoupons : filteredUsages;
  const totalPages = Math.ceil(activePaginationList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + itemsPerPage);
  const paginatedUsages = filteredUsages.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, viewMode]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const isCouponValid = (coupon: Coupon) => {
    if (!coupon.isActive) return false;
    const now = new Date();
    const start = new Date(coupon.startDate);
    const end = new Date(coupon.endDate);
    end.setHours(23, 59, 59, 999);
    return now >= start && now <= end;
  };

  return (
    <div className="flex justify-center p-8 min-h-[90%]">
      <Card className="w-full max-w-7xl shadow-lg border border-gray-200 rounded-2xl bg-white">
        {/* Header */}
        <CardHeader className="text-left border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 sm:px-10">
          <div>
            <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              {viewMode === "usages" ? (
                <>
                  <BarChart2 className="text-orange-500" size={24} />
                  Coupon Usage Logs
                </>
              ) : (
                <>
                  <Ticket className="text-orange-500" size={24} />
                  Coupons Management
                </>
              )}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {viewMode === "usages"
                ? "View which users used which coupon codes and the discount details."
                : "Create, edit, and monitor discount coupon codes for checking out."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder={viewMode === "usages" ? "Search by code or user..." : "Search coupons..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400 w-full"
              />
            </div>

            {viewMode === "coupons" ? (
              <>
                <Button
                  onClick={() => { setSearchTerm(""); setViewMode("usages"); }}
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 font-medium px-4 py-2 rounded-xl flex items-center gap-2 w-full sm:w-auto"
                >
                  <BarChart2 size={16} />
                  Usage Logs
                </Button>
                <Button
                  onClick={handleOpenCreateDialog}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-xl flex items-center gap-2 w-full sm:w-auto"
                >
                  <Plus size={18} />
                  Create Coupon
                </Button>
              </>
            ) : (
              <Button
                onClick={() => { setSearchTerm(""); setViewMode("coupons"); }}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 font-medium px-4 py-2 rounded-xl flex items-center gap-2 w-full sm:w-auto"
              >
                <ArrowLeft size={16} />
                Back to Coupons
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto p-0 px-6 sm:px-10">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : viewMode === "coupons" ? (
            /* ── COUPONS TABLE ── */
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100/55 hover:bg-gray-100/55">
                  <TableHead className="text-gray-700 font-semibold">Code</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Reference Name</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Discount</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Used</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Date Range</TableHead>
                  <TableHead className="text-gray-700 font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCoupons.length > 0 ? (
                  paginatedCoupons.map((coupon, index) => {
                    const active = isCouponValid(coupon);
                    return (
                      <TableRow
                        key={coupon.id}
                        className={`hover:bg-gray-50/80 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                      >
                        <TableCell className="font-semibold text-gray-900 tracking-wider">
                          <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-md text-xs font-mono">
                            {coupon.code}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {coupon.referenceName || <span className="text-gray-400 italic text-xs">None</span>}
                        </TableCell>
                        <TableCell className="text-gray-800 font-medium">{coupon.discountPercentage}% OFF</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleOpenUsagesDialog(coupon)}
                            className="flex items-center gap-1.5 text-gray-600 hover:text-orange-600 transition"
                            title="View usage logs"
                          >
                            <span className="font-semibold text-sm">{coupon.usedCount}</span>
                            <BarChart2 size={13} className="opacity-60" />
                          </button>
                        </TableCell>
                        <TableCell>
                          {active ? (
                            <Badge className="bg-green-100 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-medium px-2 py-0.5 rounded-full">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 hover:bg-gray-100 text-gray-500 border border-gray-200 text-xs font-medium px-2 py-0.5 rounded-full">
                              {!coupon.isActive ? "Inactive" : "Expired / Upcoming"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400" />
                            {formatDate(coupon.startDate)} – {formatDate(coupon.endDate)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenEditDialog(coupon)}
                            className="h-8 w-8 text-gray-600 border-gray-300 hover:bg-gray-100 rounded-lg"
                          >
                            <Edit2 size={13} />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteClick(coupon)}
                            className="h-8 w-8 rounded-lg"
                          >
                            <Trash2 size={13} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500 italic">
                      No coupons found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            /* ── USAGE LOGS TABLE ── */
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100/55 hover:bg-gray-100/55">
                  <TableHead className="text-gray-700 font-semibold">Coupon Code</TableHead>
                  <TableHead className="text-gray-700 font-semibold">User Name</TableHead>
                  <TableHead className="text-gray-700 font-semibold">User Email</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Discount</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Saved Amount</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Used On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsages.length > 0 ? (
                  paginatedUsages.map((usage, index) => (
                    <TableRow
                      key={usage.id}
                      className={`hover:bg-gray-50/80 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                    >
                      <TableCell>
                        <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-md text-xs font-mono font-semibold">
                          {usage.couponCode}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-800 font-medium">
                        {usage.userName || <span className="text-gray-400 italic text-xs">N/A</span>}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        {usage.userEmail || <span className="text-gray-400 italic text-xs">N/A</span>}
                      </TableCell>
                      <TableCell className="text-gray-800 font-medium">{usage.discountPercentage}% OFF</TableCell>
                      <TableCell className="text-emerald-700 font-semibold">
                        − Rs. {(usage.discountAmount / 100).toLocaleString("en-IN")}.00
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">{formatDateTime(usage.createdAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500 italic">
                      No coupon usage records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>

        {!loading && !error && activePaginationList.length > 0 && (
          <div className="py-4 border-t px-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={activePaginationList.length}
            />
          </div>
        )}
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {editingCoupon ? "Edit Coupon Code" : "Create New Coupon Code"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editingCoupon
                ? "Update the details for the coupon code. Changing the code must remain unique."
                : "Fill out the fields to register a new discount code."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label htmlFor="code" className="text-sm font-medium text-gray-700">Coupon Code</Label>
                <Input
                  id="code"
                  placeholder="e.g. SAVE20"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="uppercase font-mono tracking-wider border-gray-300 focus-visible:ring-orange-400"
                  disabled={formSubmitting}
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <Label htmlFor="discount" className="text-sm font-medium text-gray-700">Discount Percentage (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="10"
                  value={formDiscount}
                  onChange={(e) => setFormDiscount(Number(e.target.value))}
                  className="border-gray-300 focus-visible:ring-orange-400"
                  disabled={formSubmitting}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="referenceName" className="text-sm font-medium text-gray-700">
                Reference Name <span className="text-gray-400 text-xs">(Optional)</span>
              </Label>
              <Input
                id="referenceName"
                placeholder="e.g. Summer Sale 2026 Campaign"
                value={formReferenceName}
                onChange={(e) => setFormReferenceName(e.target.value)}
                className="border-gray-300 focus-visible:ring-orange-400"
                disabled={formSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="border-gray-300 focus-visible:ring-orange-400"
                  disabled={formSubmitting}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                  className="border-gray-300 focus-visible:ring-orange-400"
                  disabled={formSubmitting}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isActive"
                checked={formIsActive}
                onCheckedChange={(checked) => setFormIsActive(!!checked)}
                disabled={formSubmitting}
              />
              <Label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                Mark this coupon code as Active
              </Label>
            </div>

            <DialogFooter className="pt-4 border-t flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={formSubmitting}
                className="border-gray-300 hover:bg-gray-50 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={formSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-xl"
              >
                {formSubmitting ? "Saving..." : editingCoupon ? "Save Changes" : "Create Coupon"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Usages per Coupon Dialog */}
      <Dialog open={usagesDialogOpen} onOpenChange={setUsagesDialogOpen}>
        <DialogContent className="sm:max-w-2xl bg-white p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BarChart2 size={20} className="text-orange-500" />
              Usage Log —{" "}
              <span className="font-mono text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md text-base">
                {selectedCouponCode}
              </span>
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {selectedCouponUsages.length === 0
                ? "This coupon has not been used yet."
                : `${selectedCouponUsages.length} usage record(s) found.`}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto mt-2">
            {selectedCouponUsages.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-600 font-semibold text-xs">User</TableHead>
                    <TableHead className="text-gray-600 font-semibold text-xs">Discount</TableHead>
                    <TableHead className="text-gray-600 font-semibold text-xs">Saved</TableHead>
                    <TableHead className="text-gray-600 font-semibold text-xs">Used On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCouponUsages.map((u) => (
                    <TableRow key={u.id} className="hover:bg-gray-50">
                      <TableCell>
                        <p className="text-sm font-medium text-gray-800">{u.userName || "—"}</p>
                        <p className="text-xs text-gray-500">{u.userEmail || "—"}</p>
                      </TableCell>
                      <TableCell className="text-gray-700 font-medium text-sm">{u.discountPercentage}% OFF</TableCell>
                      <TableCell className="text-emerald-700 font-semibold text-sm">
                        − Rs. {(u.discountAmount / 100).toLocaleString("en-IN")}.00
                      </TableCell>
                      <TableCell className="text-gray-500 text-xs">{formatDateTime(u.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center py-10 text-gray-400 text-sm italic">
                No usage records for this coupon.
              </div>
            )}
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setUsagesDialogOpen(false)}
              className="border-gray-300 hover:bg-gray-50 rounded-xl"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white p-6 rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Confirm Delete</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Are you sure you want to delete the coupon code{" "}
              <span className="font-semibold text-red-600">{couponToDelete?.code}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => { setDeleteDialogOpen(false); setCouponToDelete(null); }}
              className="border-gray-300 hover:bg-gray-50 rounded-xl"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="rounded-xl">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
