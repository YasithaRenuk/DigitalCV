"use client";

import Link from "next/link";
import { Globe, AtSign } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../../../public/DigitalCVlogoThatICrop.png";

export default function HomeFooter() {
  const router = useRouter();

  return (
    <footer className="w-full bg-white border-t mt-10">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-center md:text-left">
        {/* Left */}
        <div className="flex flex-col items-center md:items-start">
          <div
            className="flex items-center cursor-pointer mb-4"
            onClick={() => router.push("/")}
          >
            <Image
              src={logo}
              alt="DigitalCV Logo"
              width={110}
              height={40}
              priority
            />
          </div>

          <p className="text-sm text-gray-600 max-w-sm mb-6">
            The smartest way to build your career. Create ATS-ready resumes,
            track applications, and get hired faster.
          </p>

          <div className="flex gap-4 text-gray-500 justify-center md:justify-start">
            <a href="/" className="hover:text-primary">
              <Globe size={18} />
            </a>
            <a href="mailto:support@igitlcv.lk" className="hover:text-primary">
              <AtSign size={18} />
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-center md:items-end">
          <Link href="/contactus" className="hover:text-primary">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
              Contact Us
            </h4>
          </Link>
        </div>
      </div>
    </footer>
  );
}
