"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Receipt,
  Ticket,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const BASE_PRICE = 2500;

function BillContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponValidating, setCouponValidating] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercentage: number;
  } | null>(null);

  const discountAmount = appliedCoupon
    ? Math.round(BASE_PRICE * (appliedCoupon.discountPercentage / 100))
    : 0;
  const finalPrice = BASE_PRICE - discountAmount;

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    setCouponValidating(true);
    setCouponError(null);
    setAppliedCoupon(null);

    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (data.success && data.coupon) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountPercentage: data.coupon.discountPercentage,
        });
        setCouponError(null);
      } else {
        setCouponError(data.error || "Invalid coupon code.");
      }
    } catch (err) {
      setCouponError("Failed to validate coupon. Please try again.");
    } finally {
      setCouponValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(null);
  };

  const handlePay = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = (session?.user as { id?: string } | undefined)?.id;

      if (!userId || !id) {
        setError("Missing user session or CV identification. Please try logging in again.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/startpayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          CVID: id,
          ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Payment initialization failed");
      }

      const data = await res.json();

      if (data?.success && data?.url) {
        router.push(data.url);
      } else {
        throw new Error("Invalid response received from payment gateway");
      }
    } catch (err: any) {
      console.error("Payment error", err);
      setError(err?.message || "An unexpected error occurred while starting payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-xl">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/showcv?id=${id}`)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to CV Preview
        </button>

        {/* Billing Card */}
        <Card className="border-slate-200/80 shadow-2xl shadow-slate-100 bg-white/95 backdrop-blur-md overflow-hidden rounded-2xl">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-secondary via-secondary to-primary text-white p-6 sm:p-8 relative">
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
              <Receipt className="w-24 h-24" />
            </div>
            <p className="text-xs uppercase tracking-wider font-semibold text-indigo-200 mb-1">Billing Summary</p>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Activate Your Digital CV</CardTitle>
            <p className="text-indigo-100 text-sm mt-2 max-w-sm">
              Complete your activation to unlock lifetime access and make your profile search-ready for recruiters.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* CV Reference */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CV Reference</span>
              <span className="text-xs font-mono font-medium text-slate-600 select-all">{id}</span>
            </div>

            <div className="border-t border-dashed border-slate-200 my-2" />

            {/* Coupon Code Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5" />
                Coupon Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800 font-mono tracking-wider">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-xs text-emerald-600">
                        {appliedCoupon.discountPercentage}% discount applied — you save Rs.{" "}
                        {discountAmount.toLocaleString("en-IN")}.00
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-slate-400 hover:text-red-500 transition-colors ml-2"
                    title="Remove coupon"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    className="font-mono uppercase tracking-wider border-slate-200 focus-visible:ring-orange-400"
                    disabled={couponValidating}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={couponValidating || !couponInput.trim()}
                    variant="outline"
                    className="shrink-0 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 font-semibold rounded-xl px-5"
                  >
                    {couponValidating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              )}

              {couponError && (
                <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  {couponError}
                </p>
              )}
            </div>

            <div className="border-t border-dashed border-slate-200" />

            {/* Price Table */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-500">
                <span>DigitalCV Premium Activation</span>
                <span className={`font-semibold ${appliedCoupon ? "line-through text-slate-400" : "text-slate-800"}`}>
                  Rs. {BASE_PRICE.toLocaleString("en-IN")}.00
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Coupon Discount ({appliedCoupon.discountPercentage}% OFF)</span>
                  <span className="font-semibold">− Rs. {discountAmount.toLocaleString("en-IN")}.00</span>
                </div>
              )}

              <div className="border-t border-slate-150 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Total Amount</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-secondary">
                    Rs. {finalPrice.toLocaleString("en-IN")}.00
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-medium flex gap-2.5 items-start">
                <span className="shrink-0 mt-0.5 font-bold">⚠️</span>
                <span>{error}</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-6 sm:p-8 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-4">
            <Button
              onClick={handlePay}
              disabled={loading}
              className="w-full h-14 text-base font-bold bg-orange-500 hover:bg-orange-600 active:bg-primary text-white shadow-xl shadow-indigo-100 transition-all rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initializing Secure Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay Now &amp; Activate
                  {appliedCoupon && (
                    <span className="ml-1 text-sm font-normal opacity-90">
                      — Rs. {finalPrice.toLocaleString("en-IN")}.00
                    </span>
                  )}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Payments are processed securely via Genie Business</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function BillPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <BillContent />
    </Suspense>
  );
}
