"use client";

import { CheckSquare, Lock, Globe, ArrowRight } from "lucide-react";

export default function FeatureSection() {
  return (
    <section className="bg-[#FFF8EF] py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* LEFT CONTENT */}
        <div className="lg:col-span-1">
          <h2 className="text-4xl font-bold text-black mb-6 leading-tight">
            Why Choose <br /> DigitalCV?
          </h2>
          <p className="text-black/70 mb-6">
            Build a career profile that stands out to humans and gets through
            screening algorithms effortlessly.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-orange-500 font-medium hover:underline"
          >
            Learn more about our tech
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* RIGHT CARDS */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-5">
              <CheckSquare className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              ATS - Optimized
            </h3>
            <p className="text-black/70 text-sm leading-relaxed">
              Convert your resume or handwritten CV into a world-recognized,
              ATS-friendly Digital CV
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-5">
              <Lock className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              Verified & Secure
            </h3>
            <p className="text-black/70 text-sm leading-relaxed">
              Your CV is hosted on a verified, world-recognized DigitalCV
              platform. Host your portfolio here to become even more
              professional and secure.
            </p>
          </div>

          {/* Card 3 (FULL WIDTH) */}
          <div className="md:col-span-2 bg-white rounded-xl p-8 shadow-sm border">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-5">
              <Globe className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              Global Access
            </h3>
            <p className="text-black/70 text-sm leading-relaxed">
              Create a unique username and remember your 4-digit PIN. Access
              your DigitalCV anywhere, anytime.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}