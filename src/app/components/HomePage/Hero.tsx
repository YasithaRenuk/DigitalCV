"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import hero from "../../../../public/newhero.png";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles,Search  } from 'lucide-react';

export default function Hero() {
  const { data: session } = useSession();
  const router = useRouter();

  const onClickCreate = () => {
    session ? router.push("/createcv") : router.push("/loginpage");
  };

  const onClickSearch = () => {
    router.push("/searchcv");
  };

  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-72 md:pt-24 pt-20">
      {/* LEFT */}
      <div className="flex flex-col md:items-start md:text-left space-y-6 lg:w-1/2 text-center items-center">
        {/* Badge */}
        <span className="bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1 rounded-full">
          ATS-Optimized Resume Builder
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-poppins">
          Land Your <br />
          Dream Job With{" "}
          <span className="text-orange-500">DigitalCV</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-lg">
          Your Gateway To Professional Success
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            onClick={onClickCreate}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-16 py-6 text-base"
          >
            <span className="flex items-center md:gap-5 gap-2">
              <Sparkles className="" /> Create Your CV
            </span>
          </Button>

          <Button
            onClick={onClickSearch}
            variant="outline"
            className="border-gray-300 font-semibold px-11 py-6 text-base"
          >
            <Search /> Search CV Database
          </Button>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden lg:flex lg:w-1/2 justify-center ml-8">
        <Image
          src={hero}
          alt="Digital CV Preview"
          className="max-w-[440px] w-full"
          priority
        />
      </div>

    </section>
  );
}
