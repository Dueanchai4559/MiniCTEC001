interface TabButtonsProps {
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
}

const tabs = [
  "สถิติ",
  "รายงานใบสั่งยา",
  "รายงานข้อมูลยา",
  "รายงานการดาวน์โหลด",
  "รายงานผู้ใช้งาน",
  "รายงานผู้ป่วย",
  "รายงานกล้อง CCTV",
  "รายงาน แท็บเล็ต",

];

export default function TabButtons({ selectedTab, setSelectedTab }: TabButtonsProps) {
  return (
    <div className="flex space-x-4 mt-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`px-4 py-2 rounded-lg font-semibold ${selectedTab === tab
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
