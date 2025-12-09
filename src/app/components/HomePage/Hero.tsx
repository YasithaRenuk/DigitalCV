"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import hero from "../../../../public/hero.png";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { data: session } = useSession();
  const router = useRouter();

  const onClickCreate = () => {
    if (session) {
      router.push("/createcv");
    } else {
      router.push("/loginpage");
    }
  };

  const onClickSearch = () => {
    router.push("/searchcv");
  };

  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-20 pb-20 md:pt-0 pt-10">
      {/* Left Section */}
      <div className="flex flex-col items-start text-left space-y-6 lg:w-1/2 ml-0 md:ml-28">
        <p className="text-lg text-primary font-medium">
          5861 <span className="text-gray-600">resumes created today</span>
        </p>

        <h2 className="text-4xl font-medium text-gray-700">Welcome To</h2>
        <h1 className="text-5xl lg:text-8xl font-extrabold text-black">
          DIGITAL<span className="text-black">CV</span>
        </h1>

        <p className="text-gray-700 text-xl lg:text-3xl font-medium">
          Your Gateway To Professional Success
        </p>

        <div className="flex space-x-5">
          <Button className="font-bold px-5" onClick={onClickCreate}>
            CREATE CV
          </Button>
          <Button className="font-bold px-5" onClick={onClickSearch}>
            SEARCH CV
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-10 space-y-3 sm:space-y-0 mt-6">
          <div className="flex flex-col items-start space-y-1">
            <span className="bg-[#F1E829] text-secondary font-bold px-3 py-1 rounded text-lg">
              48%
            </span>
            <span className="text-gray-700 text-lg">
              more likely to get hired
            </span>
          </div>

          <div className="flex flex-col items-start space-y-1">
            <span className="bg-[#ECD37766] font-bold px-3 py-1 rounded text-lg">
              12%
            </span>
            <span className="text-gray-700 text-lg">
              better pay with your next job
            </span>
          </div>
        </div>
      </div>

      {/* Right Section (Image) — Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 justify-center mb-10 lg:mb-0">
        <Image src={hero} alt="Resume Preview" width={547} height={587} />
      </div>
    </section>
  );
}
