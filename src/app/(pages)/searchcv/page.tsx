"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Image from "next/image";
import SearchDigitalCV from "../../components/SearchCV/SearchDigitalCV";
import { useSearchParams } from "next/navigation";
import img from '../../../../public/simage.jpeg' 

function SearchCVContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "";
  const pin = searchParams.get("pin") || "";

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-150px)] pt-10 md:pt-1">
      
      {/* Right Section */}
      <div className="w-full md:w-full flex items-center justify-center">
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
