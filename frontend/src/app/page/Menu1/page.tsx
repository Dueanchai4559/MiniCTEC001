/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserTable from "./tableuser"
import MedicineTable from "./tablemedicine"
import MedicineuseTable from "./tableMediuse"
import MedicineCabinetTable from "./tablemedicinerefill"
import Chart1 from "./chart1"
import Chart2 from "./chart2"
import Chart3 from "./chart3"
import { baseUrlAPI } from "@/app/ip";

function StatCard({
  icon,
  count,
  label,
}: {
  icon: string;
  count: number;
  label: string;
}) {
  return (
    <div className="bg-blue-100 p-2 rounded-xl shadow-sm hover:shadow-md transition duration-200 text-center w-full">
      <div className="text-3xl mb-2">{icon}</div> {/* ใหญ่ขึ้น + ห่างขึ้น */}
      <div className="text-4xl font-bold text-gray-900 mb-2">{count}</div> {/* เพิ่ม mb */}
      <div className="text-base font-medium text-gray-800">{label}</div>
    </div>
  );
}

export default function Menu1Page() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("สถิติ");
  const [language] = useState("th");
  const [showImageModal, setShowImageModal] = useState(false);
  const [user, setUser] = useState<{ name?: string; image?: string } | null>(
    null
  );
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    try {
      if (raw) {
        const auth = JSON.parse(raw);
        const currentUser = auth?.user;
        setUser(currentUser);
      }
    } catch {
      localStorage.removeItem("authUser");
      router.push("/");
    }
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch(`${baseUrlAPI}/prescriptions`);
      const data = await res.json();

      if (!Array.isArray(data)) return;


      const tzOffsetMs = 7 * 60 * 60 * 1000;

      const now = new Date();
      now.setHours(now.getHours() + 7); // timezone ไทย

      const endTime = new Date(now);
      const startTime = new Date(now);
      startTime.setHours(startTime.getHours() - 24);

      const prescriptionsToday = data.filter((item: any) => {
        const createdUtc = new Date(item.createdAt);
        const createdThai = new Date(createdUtc.getTime() + tzOffsetMs);
        return createdThai >= startTime && createdThai <= endTime;
      });


      const countsByStatus: { [key: string]: number } = {};
      prescriptionsToday.forEach((item: any) => {
        const status = item.statusnow1?.toString() || "unknown";
        countsByStatus[status] = (countsByStatus[status] || 0) + 1;
      });

      setTodayCount(prescriptionsToday.length);
      setTotalCount(data.length);
      setStatusCounts(countsByStatus);
    } catch (err) {
      console.error("ไม่สามารถโหลดใบสั่งยา:", err);
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const res = await fetch(`${baseUrlAPI}/users`);
      const data = await res.json();
      const onlineCount = data.filter(
        (user: any) => user.statusWork?.toString() === "1"
      ).length;
      setOnlineUsers(onlineCount);
    } catch (err) {
      console.error("ไม่สามารถโหลดผู้ใช้งานออนไลน์:", err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    fetchOnlineUsers();
  }, []);
  const statList = [
    { label: "กำลังคัดแยก", statusnow1: "1", icon: "🧬" },
    { label: "กำลังจัดยา", statusnow1: "2", icon: "💊" },
    { label: "กำลังตรวจสอบ", statusnow1: "3", icon: "🔍" },
    { label: "รอจ่ายยา", statusnow1: "4", icon: "📦" },
    { label: "พักตะกร้านอก", statusnow1: "8", icon: "🧺" },
    { label: "พักตะกร้าใน", statusnow1: "10", icon: "📥" },
    { label: "จ่ายยาสำเร็จ", statusnow1: "5", icon: "✅" },
    { label: "ยกเลิก", statusnow1: "6", icon: "🚫" },
    { label: "จัดใหม่", statusnow1: "9", icon: "🔄" },
    { label: "ใบสั่งยาวันนี้", count: todayCount, icon: "📅" },
    { label: "ใบสั่งยาทั้งหมด", count: totalCount, icon: "🗂️" },
    { label: "ใช้งานอยู่ตอนนี้", count: onlineUsers, icon: "🟢" },
  ];

  return (
    <main className=" max-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="flex items-center space-x-4 ">
        <>
          <img
            onClick={() => setShowImageModal(true)}
            src={user?.image ? `${baseUrlAPI}${user.image}` : "/upload/user.png"}
            alt="โปรไฟล์"
            width={60}
            height={60}
            className="rounded-full border border-gray-400 object-cover cursor-pointer hover:scale-105 transition-transform"
          />

          {showImageModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
              onClick={() => setShowImageModal(false)}
            >
              <img
                src={user?.image ? `${baseUrlAPI}${user.image}` : "/upload/user.png"}
                alt="ขยายโปรไฟล์"
                className="max-w-full max-h-full rounded shadow-lg border-4 border-white"
              />
            </div>
          )}
        </>
        <div className="animate-fade-in">
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-wide">
            {language === "th"
              ? `✨ ยินดีต้อนรับ แผนกจัดยา!`
              : `✨ Welcome to Dispensing Department!`}
          </h1>

          <p className="text-sm text-gray-600  italic">
            {language === "th"
              ? `🕒 วันนี้: ${new Intl.DateTimeFormat("th-TH", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(new Date())}`
              : `🕒 Today is: ${new Intl.DateTimeFormat("en-US", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(new Date())}`}
          </p>
        </div>

      </div>
      {/*แสดงปุ่มแท็บ */}
      {selectedTab === "สถิติ" && (
        <>
          <div className="overflow-x-auto mt-2">
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-12 gap-4 mt-6">
              {statList.map((stat, i) => (
                <StatCard
                  key={i}
                  icon={stat.icon}
                  label={stat.label}
                  count={
                    stat.count !== undefined
                      ? stat.count
                      : statusCounts[stat.statusnow1] ?? 0
                  }
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4 p-2 flex-nowrap">
            <div className="w-1/2 p-4 rounded-xl shadow-lg border border-gray-200 bg-white">
              <Chart3 />
            </div>
            <div className="w-1/2 p-4 rounded-xl shadow-lg border border-gray-200 bg-white">
              <MedicineCabinetTable />
            </div>
          </div>

          <div className="flex gap-4 p-2 flex-nowrap">
            <div className="w-1/2 p-4 rounded-xl shadow-lg border border-gray-200 bg-white">
              <Chart1 />
            </div>
            <div className="w-1/2 p-4 rounded-xl shadow-lg border border-gray-200 bg-white">
              <Chart2 />
            </div>
          </div>

          <div className="flex gap-4 p-2 flex-nowrap">
            <div className="w-1/2 p-4 rounded-xl shadow-lg border border-gray-200 bg-white">
              <MedicineTable />
            </div>
            <div className="w-1/2 p-4 rounded-xl shadow-lg border border-gray-200 bg-white">
              <UserTable />
            </div>
          </div>

          <div className="flex gap-4 p-2 flex-nowrap">
            <div className="w-1/2 p-4 rounded-xl shadow-lg border border-gray-200 bg-white">
              <MedicineuseTable />
            </div>
            <div className="w-1/2 p-4 rounded-xl shadow-lg border border-gray-200 bg-white">
              <UserTable />
            </div>
          </div>

        </>
      )}

    </main>
  );
}
