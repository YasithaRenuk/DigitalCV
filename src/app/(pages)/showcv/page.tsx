"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import CvTemplate, { CVData } from "@/app/components/ShowCV/CvTemplate";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertCircle, CreditCard, Trash2, FileText } from "lucide-react";

type GetCVResponse = {
  success: boolean;
  data: CVData;
};

function SearchCVContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "";

  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loadingCV, setLoadingCV] = useState<boolean>(true);
  const [cvError, setCvError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCV = async () => {
      if (!id) {
        router.push("/");
        return;
      }

      try {
        setLoadingCV(true);
        setCvError(null);

        const response = await fetch("/api/getCVWithId", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch CV");
        }

        const json: GetCVResponse = await response.json();
        console.log("CV response:", json);

        if (!json.success || !json.data) {
          throw new Error("CV not found");
        }

        setCvData(json.data);
      } catch (error) {
        console.error("Error fetching CV", error);
        setCvError(error instanceof Error ? error.message : "Error loading CV");
      } finally {
        setLoadingCV(false);
      }
    };

    fetchCV();
  }, [id, router]);

  const handleSubmit = async () => {
    try {
      // safe access to user id
      const userId = (session?.user as { id?: string } | undefined)?.id;

      if (!userId || !id) {
        console.error("Missing userId or CVID");
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
        console.error("Payment API failed", res.status);
        return;
      }

      const data = await res.json();

      if (data?.success && data?.url) {
        router.push(data.url);
      } else {
        console.error("Unexpected payment response", data);
      }
    } catch (err) {
      console.error("Error calling payment API", err);
    }
  };

  const handleDeleteCV = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/usercv/delete-own", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });
      if (res.ok) {
        router.push("/createcv");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete CV");
      }
    } catch (err) {
      console.error("Error deleting CV", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-slate-50/50">
      {/* Left Section - CV Preview */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden">
        <div className="w-full max-w-4xl h-full flex flex-col">
          <div className="mb-4 flex items-center gap-2 text-slate-500 lg:hidden">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">CV Preview</span>
          </div>
          
          <div className="relative flex-1 w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
            <ScrollArea className="h-[60vh] lg:h-[calc(100vh-140px)] w-full">
              <div className="min-h-full flex flex-col items-center justify-center p-4">
                {loadingCV && (
                  <div className="flex flex-col items-center gap-4 text-slate-500 animate-in fade-in duration-500">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium">Preparing your CV...</p>
                  </div>
                )}

                {!loadingCV && cvError && (
                  <div className="flex flex-col items-center gap-4 text-red-500 max-w-sm text-center p-8 bg-red-50 rounded-lg border border-red-100">
                    <AlertCircle className="h-10 w-10" />
                    <p className="text-sm font-medium">{cvError}</p>
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-2">
                      Reload Page
                    </Button>
                  </div>
                )}

                {!loadingCV && !cvError && cvData && (
                  <div className="w-full h-full bg-white">
                    <CvTemplate data={cvData} />
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="lg:w-96 w-full flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200 bg-white lg:bg-white/50 backdrop-blur-sm p-6 lg:p-8 gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">One Last Step!</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your CV is ready. Proceed to payment to make it availabil for searchs.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <Button
            className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
            onClick={handleSubmit}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Make CV Online With Payment
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or</span>
            </div>
          </div>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                size="lg"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Discard & Start Over
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this CV?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the current CV draft. You will need to re-enter your information to create a new one.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteCV} 
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete & Retry"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mt-auto pt-8 text-center text-xs text-slate-400">
           Secure payment powered by Genie Business.
        </div>
      </div>
    </div>
  );
}

export default function SearchCV() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    }>
      <SearchCVContent />
    </Suspense>
  );
}
