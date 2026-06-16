"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  Loader2, 
  ShieldCheck, 
  ArrowLeft, 
  Receipt,
  CheckCircle2
} from "lucide-react";

function BillContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          CVID: id,
        }),
      });

      if (!res.ok) {
        throw new Error("Payment initialization failed");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center ">
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

            {/* Included Features */}
            {/* <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Premium Access Included</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Custom sharable link</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Visible to top recruiters</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>PDF Download support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Unlimited layout edits</span>
                </li>
              </ul>
            </div> */}

            <div className="border-t border-dashed border-slate-200 my-6" />

            {/* Price Table */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-500">
                <span>DigitalCV Premium Activation</span>
                <span className="font-semibold text-slate-800">Rs. 2,500.00</span>
              </div>
              {/* <div className="flex justify-between text-sm text-slate-500">
                <span>Setup & Hosting Fee</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div> */}
              {/* <div className="flex justify-between text-sm text-slate-500">
                <span>Taxes & VAT</span>
                <span>Included</span>
              </div> */}

              <div className="border-t border-slate-150 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Total Amount</span>
                <span className="text-2xl font-extrabold text-secondary">Rs. 2,500.00</span>
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
                  Pay Now & Activate
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
