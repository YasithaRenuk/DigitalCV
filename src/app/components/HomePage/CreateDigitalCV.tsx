"use client";

import Image from "next/image";
import img from "../../../../public/bb.png";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreateDigitalCV() {
  const { data: session } = useSession();
  const router = useRouter();

  const onClickCreate = () => {
    if (session) {
      router.push("/createcv");
    } else {
      router.push("/loginpage");
    }
  };

  return (
    <section className="w-full px-4 md:px-52 pt-16 pb-10">
      <div className="relative rounded-3xl bg-linear-to-r from-orange-500 to-orange-400 drop-shadow-[#FED7AA] drop-shadow-xl/50">

        {/* Mobile floating image */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 md:hidden w-64">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={img}
              alt="Professional woman holding CV"
              width={400}
              height={300}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 
                        pt-32 md:pt-8 p-8 md:px-12">

          {/* Left Text */}
          <div className="text-white text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Create your digitalCV <br /> now
            </h1>

            <p className="mt-4 text-sm md:text-base text-orange-50 max-w-md mx-auto md:mx-0">
              Join over a thousands professionals advancing their careers today.
              It’s takes less than 10 minutes.
            </p>

            <button
              onClick={onClickCreate}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white 
                         px-6 py-3 text-sm font-semibold text-orange-500 
                         shadow hover:bg-orange-50 transition mx-auto md:mx-0"
            >
              Create Your CV
              <span className="text-lg">→</span>
            </button>
          </div>

          {/* Desktop Image (unchanged) */}
          <div className="hidden md:flex justify-end">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl">
              <Image
                src={img}
                alt="Professional woman holding CV"
                width={600}
                height={400}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
