"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import CvFileUploader from "@/app/components/ShowCV/CvFileUploader";
import { Button } from "@/components/ui/button";


function SearchCVContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "";
  
  useEffect(() => {
    if (id === "") {
        router.push("/");
    }
  }, [id, router]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-10 md:pt-1">
      {/* Left Section (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-[50%] h-[90%] items-center justify-center mt-5 mb-5">
        <div className="relative bg-white shadow-md shadow-primary rounded-lg w-[80%] mx-auto border-2 border-primary overflow-hidden aspect-square">
          <Image
            src="https://picsum.photos/300/400"
            alt="coverimg"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-[50%] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full gap-4">

          <CvFileUploader userCVId={id} />

          <span className="text-center w-full">
            or
          </span>

          <Button
            className="max-w-2xs w-full text-white hover:bg-white hover:text-secondary hover:border-secondary hover:border-2"
            variant="secondary"
          >
            Submit
          </Button>

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
