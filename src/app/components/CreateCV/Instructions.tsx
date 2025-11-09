"use client";
import Image from "next/image";
import illustration from "../../../../public/1683258268891-removebg-preview 1.png";

export default function Instructions() {
  return (
    <div className="bg-white shadow-md shadow-primary rounded-lg p-4 md:p-6 w-[95%] md:w-[80%] mx-auto border-2 border-primary">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions :</h2>

      {/* Bullet points */}
      <div className="space-y-3 text-gray-700 text-xs md:text-sm">
        {/* 1 */}
        <div className="flex items-start">
          <span className="w-2 h-2 bg-secondary rounded-full mt-1 mr-2"></span>
          <p>Vorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        {/* 2 */}
        <div className="flex items-start">
          <span className="w-2 h-2 bg-secondary rounded-full mt-1 mr-2"></span>
          <div>
            <p>Vorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p className="mt-0.5 text-gray-600">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
            </p>
          </div>
        </div>

        {/* 3 */}
        <div className="flex items-start">
          <span className="w-2 h-2 bg-secondary rounded-full mt-1 mr-2"></span>
          <p>Vorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        {/* 4 */}
        <div className="flex items-start">
          <span className="w-2 h-2 bg-secondary rounded-full mt-1 mr-2"></span>
          <div>
            <p>Vorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p className="mt-0.5 text-gray-600">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
            </p>
          </div>
        </div>

        {/* 5 */}
        <div className="flex items-start">
          <span className="w-2 h-2 bg-secondary rounded-full mt-1 mr-2"></span>
          <div>
            <p>Vorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p className="mt-0.5 text-gray-600">
              Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
            </p>
          </div>
        </div>
      </div>

      {/* Illustration */}
      <div className="flex justify-center mt-6">
        <Image
          src={illustration}
          alt="Instructions Illustration"
          className="w-full max-w-sm h-auto"
        />
      </div>
    </div>
  );
}
