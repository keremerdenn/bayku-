import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${colorClass || "bg-sky-100"}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-sky-600">{value}</p>
      </div>
    </div>
  );
};

export default StatCard; 