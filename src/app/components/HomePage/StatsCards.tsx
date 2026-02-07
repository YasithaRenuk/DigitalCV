import { FileText, CheckCircle, DollarSign } from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      icon: <FileText className="w-6 h-6 text-orange-500" />,
      title: "CVS CREATED",
      value: "1,500+",
      footer: "+15% this month",
      footerColor: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-orange-500" />,
      title: "HIRE SUCCESS",
      value: "84%",
      subtitle: "More likely to get hired",
    },
    {
      icon: <DollarSign className="w-6 h-6 text-orange-500" />,
      title: "BETTER PAY",
      value: "12%",
      subtitle: "Average salary increase",
    },
  ];

  const renderCard = (item: any) => (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 text-[11px] md:text-sm text-gray-500 font-medium">
        {item.icon}
        {item.title}
      </div>

      {/* Value */}
      <div className="mt-4 text-4xl font-bold text-gray-900">
        {item.value}
      </div>

      {/* Footer / Subtitle */}
      {item.footer ? (
        <div
          className={`inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-sm font-medium ${item.bg} ${item.footerColor}`}
        >
          {item.footer}
        </div>
      ) : (
        <p className="mt-3 text-gray-500 text-sm">{item.subtitle}</p>
      )}
    </div>
  );


  return (
    <div className="w-full lg:px-52 pt-24 pb-10">

      {/* Mobile layout */}
      <div className="flex flex-col gap-6 md:hidden px-6">
        {/* First card - full width */}
        <div className="border border-orange-200 rounded-2xl p-6 bg-white">
          {renderCard(stats[0])}
        </div>

        {/* Bottom two cards */}
        <div className="grid grid-cols-2 gap-4">
          {stats.slice(1).map((item, index) => (
            <div
              key={index}
              className="border border-orange-200 rounded-2xl p-6 bg-white"
            >
              {renderCard(item)}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop layout - UNCHANGED */}
      <div className="hidden md:flex gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex-1 border border-orange-200 rounded-2xl p-6 bg-white"
          >
            {renderCard(item)}
          </div>
        ))}
      </div>

    </div>
  );
};

export default StatsCards;
