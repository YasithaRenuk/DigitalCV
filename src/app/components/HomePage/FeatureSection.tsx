"use client";

import { CheckSquare, Lock, Globe } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      icon: <CheckSquare className="w-10 h-10 text-white" />,
      title: "ATS - Optimized",
      description:
        "Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    },
    {
      icon: <Lock className="w-10 h-10 text-white" />,
      title: "Verified & Secure",
      description:
        "Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    },
    {
      icon: <Globe className="w-10 h-10 text-white" />,
      title: "Global Access",
      description:
        "Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
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
