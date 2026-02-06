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
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
       <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
         {/* Left Column: Form */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100 md:order-1">
           <InquiryForm reasonTopic={reasonTopic} />
        </div>

        {/* Right Column: Process Card/Info */}
        <div className="border-2 rounded-2xl shadow-xl shadow-blue-200/50 p-6 sm:p-8 text-white md:order-2 flex flex-col justify-center h-full min-h-[400px]">
           <OurProcessCard />
        </div>
      </div>
    </div>
  );
}

export default function ContactUS() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ContactUSContent />
    </Suspense>
  );
}