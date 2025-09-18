/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// interface สำหรับ user object
interface AuthUser {
  user: {
    id: number;
    name: string;
    role: string;
  };
  expireAt: number;
  lastActive: number;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser["user"] | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    if (!raw) {
      router.push("/");
      return;
    }

    try {
      const auth: AuthUser = JSON.parse(raw);
      setUser(auth.user);
      const now = Date.now();
      const hasExpired = now > auth.expireAt;
      const inactiveTooLong = now - auth.lastActive > 5 * 60 * 1000;

      if (hasExpired || inactiveTooLong) {
        localStorage.removeItem("authUser");
        setTimeout(() => {
          alert("เซสชันหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่");
          router.push("/");
        }, 100);
      }
    } catch {
      localStorage.removeItem("authUser");
      router.push("/");
    }
  }, [router]);


  const menuItems = [
    {
      label: "🔐 การยืนยันตัวตนผู้ใช้งานใหม่",
      onClick: () => router.push("/page/settings/users"),
      visible: user?.role === "adminCT" || user?.role === "admin",
    },
    {
      label: "📘 ข้อมูลการใช้งานเบื้องต้น",
      onClick: () => router.push("/page/settings/user-guide"),
      visible: true,
    },
    {
      label: "👥 ข้อมูลทีมงานผู้พัฒนา",
      onClick: () => router.push("/page/settings/team-info"),
      visible: true,
    },
    {
      label: "💡 เครดิตและเทคโนโลยีที่ใช้",
      onClick: () => router.push("/page/settings/credits"),
      visible: true,
    },
    {
      label: (
        <div className="flex items-center space-x-2">
          <img
            src="https://scdn.line-apps.com/n/line_add_friends/btn/th.png"
            alt="เพิ่มเพื่อนใน LINE"
            className="h-6"
          />
          <span className="text-lg font-medium">เพิ่มเพื่อนใน LINE Bot</span>
        </div>
      ),
      onClick: () =>
        window.open("https://lin.ee/xxxxxxxx", "_blank"),
      visible: true,
    },
  ];

  return (
    <main className="p-6 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 text-center">เมนูการตั้งค่า</h1>
      <div className="grid gap-4">
        {menuItems
          .filter((item) => item.visible)
          .map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full bg-white border border-gray-200 p-4 rounded-2xl shadow-md hover:bg-gray-100 transition-all text-left text-lg flex items-center space-x-3"
            >
              {item.label}
            </button>
          ))}
      </div>
    </main>
  );
}
