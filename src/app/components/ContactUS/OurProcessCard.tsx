import { Mail, UserCheck, HandHeart } from "lucide-react";

export default function OurProcessCard() {
  const steps = [
    {
      icon: <Mail className="w-10 h-10 md:w-12 md:h-12 text-black" />,
      text: "Send us your details and let us know what you’re looking for. We review every ticket carefully.",
      title:"Submit Your Inquiry"
    },
    {
      icon: <UserCheck className="w-10 h-10 md:w-12 md:h-12 text-black" />,
      text: "Our team review your request and identifies the best solution for your needs.",
      title:"Get Expert Review"
    },
    {
      icon: <HandHeart className="w-10 h-10 md:w-12 md:h-12 text-black" />,
      text: "We’ll contact you with clear next steps and provide ongoing assistance until it’s resolved.",
      title:"Quick Response & Support"
    },
  ];

  return (
    <div className="max-w-2xl mx-auto shadow-md shadow-primary border-primary border-2 rounded-xl p-6 md:p-8 text-center ">
      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">Our Process</h2>
     
      {/* Steps */}
      <div className="flex flex-col space-y-6 mt-6 md:mt-5">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center md:items-start md:space-x-4 text-center md:text-left bg-yellow-50 rounded-lg p-4"
          >
            <div className="bg-yellow-200 rounded-full p-4 md:p-6 flex items-center justify-center mb-3 md:mb-0">
              {step.icon}
            </div>
            <div>
              <p className="text-gray-700 text-base font-bold md:text-lg px-2 md:px-0">
                {step.title}
              </p>
              <p className="text-gray-700 text-base md:text-lg px-2 md:px-0">
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
