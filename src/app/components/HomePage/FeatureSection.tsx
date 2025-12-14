"use client";

import { CheckSquare, Lock, Globe } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      icon: <CheckSquare className="w-10 h-10 text-white" />,
      title: "ATS - Optimized",
      description:
        "Convert your resume or handwritten CV into a world-recognized, ATS-friendly Digital CV",
    },
    {
      icon: <Lock className="w-10 h-10 text-white" />,
      title: "Verified & Secure",
      description:
        "Your CV is hosted on a verified, world-recognized DigitalCV platform. Host your portfolio here to become even more professional and secure.",
    },
    {
      icon: <Globe className="w-10 h-10 text-white" />,
      title: "Global Access",
      description:
        "Create a unique username and remember your 4-digit PIN. Access your DigitalCV anywhere, anytime",
    },
  ];

  return (
    <section className="bg-[#ECD377] py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#F1E82926] shadow-lg rounded-lg p-8 text-center flex flex-col items-center hover:shadow-xl transition-shadow"
          >
            <div className="bg-[#F1E829] w-20 h-20 flex items-center justify-center rounded-full mb-6">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-black mb-4">
              {feature.title}
            </h3>
            <p className="text-black/80 leading-relaxed text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
