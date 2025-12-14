"use client";

import React, { useEffect } from "react";
import Instructions from "../../components/CreateCV/Instructions";
import UploadCV from "../../components/CreateCV/UploadCV";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CreateCV = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status != "authenticated") {
      router.push("/loginpage");
    }
  }, [status, router]);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-150px)] pt-10 md:pt-0">
      {/* Left Section - Hidden on mobile */}
      <div className="hidden md:flex md:w-[50%] h-full items-center justify-center mt-2.5 mb-2.5">
        <Instructions />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-[50%] flex items-center justify-center">
        <UploadCV />
      </div>
    </div>
  );
};

export default CreateCV;
