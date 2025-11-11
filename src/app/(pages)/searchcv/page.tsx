"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Image from "next/image";
import SearchDigitalCV from "../../components/SearchCV/SearchDigitalCV";
import { useSearchParams } from "next/navigation";

function SearchCVContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";
  const pin = searchParams.get("pin") || "";

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-10 md:pt-1">
      {/* Left Section (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-[50%] h-[90%] items-center justify-center mt-5 mb-5">
        <div className="relative bg-white shadow-md shadow-primary rounded-lg w-[80%] mx-auto border-2 border-primary overflow-hidden aspect-[3/4]">
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
        <SearchDigitalCV username={username} pin={pin} />
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
