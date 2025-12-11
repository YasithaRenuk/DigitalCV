"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Image from "next/image";
import SearchDigitalCV from "../../components/SearchCV/SearchDigitalCV";
import { useSearchParams } from "next/navigation";
import img from '../../../../public/p1.webp' 

function SearchCVContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";
  const pin = searchParams.get("pin") || "";

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-150px)] pt-10 md:pt-1">
      {/* Left Section (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-[50%] items-center justify-center mt-5 mb-5">
        <div className="relative bg-white shadow-md shadow-primary rounded-lg w-[70%] mx-auto border-2 border-primary overflow-hidden aspect-square">
          <Image
            src = {img}
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
