import React from "react";

interface PersonalStatsChartProps {
  username: string;
}

// Örnek veri: Son 7 günün çözüm sayısı
const exampleData = {
  labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
  values: [12, 15, 9, 18, 20, 7, 14],
};

const PersonalStatsChart: React.FC<PersonalStatsChartProps> = ({ username }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
      <div className="w-full h-40 flex items-end gap-2">
        {exampleData.values.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center justify-end flex-1">
            <div
              className="bg-sky-500 rounded-t-md"
              style={{ height: `${val * 6}px`, width: "20px" }}
              title={`${exampleData.labels[idx]}: ${val} soru`}
            ></div>
            <span className="text-xs mt-1 text-gray-600">{exampleData.labels[idx]}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-sm text-gray-700">{username} için son 7 gün</div>
    </div>
  );
};

export default PersonalStatsChart; 