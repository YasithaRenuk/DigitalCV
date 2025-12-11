"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import CvFileUploader from "@/app/components/ShowCV/CvFileUploader";
import { Button } from "@/components/ui/button";
import CvTemplate, { CVData } from "@/app/components/ShowCV/CvTemplate";
import { ScrollArea } from "@/components/ui/scroll-area"; // ✅ ADD THIS
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
      } catch (error: any) {
        console.error("Error fetching CV", error);
        setCvError(error.message ?? "Error loading CV");
      } finally {
        setLoadingCV(false);
      }
    };

    fetchCV();
  }, [id, router]);

  const handleSubmit = async () => {
    try {
      const userId = (session as any)?.user?.id;

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
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-150px)] pt-10 md:pt-0 gap-6 md:gap-0">
      {/* CV Preview Section - Scrollable */}
      <div className="w-full md:w-[90%] flex items-center justify-center mt-2 mb-2 md:mt-5 md:mb-5">
        <ScrollArea
          className="relative bg-white shadow-md shadow-primary rounded-lg 
                   w-[90%] md:w-[80%] mx-auto border-2 border-primary 
                   h-[calc(100vh-150px)] md:h-[80vh]"
        >
          {loadingCV && (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
              Loading CV...
            </div>
          )}

          {!loadingCV && cvError && (
            <div className="w-full h-full flex items-center justify-center text-sm text-red-500 text-center px-4">
              {cvError}
            </div>
          )}

          {!loadingCV && !cvError && cvData && <CvTemplate data={cvData} />}
        </ScrollArea>
      </div>

      {/* Right Section – uploader + button */}
      <div className="w-full md:w-[50%] flex items-center justify-center pb-10 md:pb-0">
        <div className="flex flex-col items-center justify-center w-full gap-4 px-4 max-w-md">
          {/* <CvFileUploader userCVId={id} /> */}

          {/* <span className="text-center w-full">or</span> */}

          <Button
            className="max-w-2xs w-full text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border-2"
            variant="secondary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <span className="text-center w-full">or</span>
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                className="max-w-2xs w-full mt-2 text-white bg-red-500 hover:bg-white hover:text-red-500 hover:border-red-500 hover:border-2"
                variant="destructive"
              >
                Try Again
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this CV?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete the current CV so you can upload again. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCV} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete & Retry"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export default function SearchCV() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchCVContent />
    </Suspense>
  );
}
