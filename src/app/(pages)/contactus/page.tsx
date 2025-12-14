"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import OurProcessCard from "../../components/ContactUS/OurProcessCard";
import InquiryForm from "../../components/ContactUS/InquiryForm";
import { useSearchParams } from "next/navigation";

function ContactUSContent() {
  const searchParams = useSearchParams();
  const reasonTopic = searchParams.get("reasonTopic") || "";

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-150px)] pt-10 md:pt-1 items-center justify-center">
      <div className="w-full md:order-2 md:w-[50%] flex items-center justify-center mt-2.5 mb-2.5">
        <InquiryForm reasonTopic={reasonTopic} />
      </div>

      <div className="w-full md:order-1 md:w-[50%] flex items-center justify-center mt-8 md:mt-0">
        <OurProcessCard />
      </div>
    </div>
  );
}

export default function ContactUS() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactUSContent />
    </Suspense>
  );
}