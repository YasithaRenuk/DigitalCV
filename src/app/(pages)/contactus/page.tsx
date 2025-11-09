"use client";

import OurProcessCard from "../../components/ContactUS/OurProcessCard";
import InquiryForm from "../../components/ContactUS/InquiryForm";
import { useSearchParams } from "next/navigation";

const ContactUS = () => {
  const searchParams = useSearchParams();
  const reasonTopic = searchParams.get("reasonTopic") || "";

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-10 md:pt-1 items-center justify-center">
      {/* InquiryForm first on mobile, second on desktop */}
      {/* { console.log(reasonTopic) } */}
      <div className="w-full md:order-2 md:w-[50%] flex items-center justify-center">
        <InquiryForm reasonTopic={reasonTopic} />
      </div>

      {/* OurProcessCard second on mobile, first on desktop */}
      <div className="w-full md:order-1 md:w-[50%] flex items-center justify-center mt-8 md:mt-0">
        <OurProcessCard />
      </div>
    </div>
  );
};

export default ContactUS;
