"use client";

import Image from "next/image";
import LoginPage from "../../components/LoginPage/LoginPage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import img from "../../../../public/limage.jpeg";

const Page = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/createcv");
  }, [status, router]);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-150px)] pt-10 md:pt-1">
      {/* Left Section */}
      <div className="md:w-[60%] w-full relative min-h-[260px] md:min-h-[calc(100vh-150px)]">
        <Image src={img} alt="sideImg" fill className="object-cover" priority />
      </div>

      {/* Right Section */}
      <div className="md:w-[70%] w-full flex items-center justify-center">
        <LoginPage />
      </div>
    </div>
  );
};

export default Page;
