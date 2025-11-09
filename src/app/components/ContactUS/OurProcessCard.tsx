import { Mail, UserCheck, HandHeart } from "lucide-react";

export default function OurProcessCard() {
  const steps = [
    {
      icon: <Mail className="w-10 h-10 md:w-12 md:h-12 text-black" />,
      text: "Dorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: <UserCheck className="w-10 h-10 md:w-12 md:h-12 text-black" />,
      text: "Dorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      icon: <HandHeart className="w-10 h-10 md:w-12 md:h-12 text-black" />,
      text: "Dorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md shadow-primary border-primary border-2 rounded-xl p-6 md:p-8 text-center mb-10">
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">Our Process</h2>
      <p className="text-gray-600 mb-8 text-base md:text-lg px-2">
        Dorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
        libero et velit interdum, ac aliquet odio mattis.
      </p>

      {/* Steps */}
      <div className="flex flex-col space-y-6 mt-6 md:mt-10">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center md:items-start md:space-x-4 text-center md:text-left bg-yellow-50 rounded-lg p-4"
          >
            <div className="bg-yellow-200 rounded-full p-4 md:p-6 flex items-center justify-center mb-3 md:mb-0">
              {step.icon}
            </div>
            <p className="text-gray-700 text-base md:text-lg px-2 md:px-0">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
