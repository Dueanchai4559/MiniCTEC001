/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useSessionHeartbeat from "@/app/hooks/useSessionHeartbeat";
import { baseUrlAPI } from "@/app/ip";

import Menu1Page from "@/app/page/Menu1/page";
import Menu2Page from "@/app/page/Menu2/page";
import Menu16Page from "@/app/page/Menu16/page";
import axios from "axios";
interface Notification {
    id: number;
    title: string;
    message: string;
    createdAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [showHeader, setShowHeader] = useState(true);
    const [showNotificationPopup, setShowNotificationPopup] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const bellButtonRef = useRef<HTMLButtonElement>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState<"en" | "th">("th");
    const toggleTheme = () => setDarkMode((prev) => !prev);
    const toggleLanguage = () => setLanguage((prev) => (prev === "th" ? "en" : "th"));
    const [activeMenu, setActiveMenu] = useState("menu1");
    const [user, setUser] = useState<any>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [profileImage, setProfileImage] = useState("/upload/user.png");
    useEffect(() => {
        if (typeof window !== "undefined") {
            const raw = localStorage.getItem("authUser");
            if (raw) {
                const auth = JSON.parse(raw);
                const currentUser = auth?.user;
                setProfileImage(currentUser?.profileImage || "/upload/user.png");
            }
        }
    }, []);



    // ตรวจจับว่า fullscreen เปลี่ยนหรือไม่
    useEffect(() => {
        const handleChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleChange);
        return () => document.removeEventListener("fullscreenchange", handleChange);
    }, []);

    const handleToggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    useSessionHeartbeat();
    useEffect(() => {
        const raw = localStorage.getItem("authUser");
        if (!raw) {
            router.push("/"); // ไม่มีข้อมูล user เลย → กลับหน้า login
            return;
        }

        try {
            const auth = JSON.parse(raw);
            const currentUser = auth?.user;

            // //   ถ้าไม่มีสิทธิ์เข้า Dashboard (do1) → ไปหน้าเลือกเมนูทันที
            // if (!currentUser?.role1?.do1) {
            //   console.warn("⛔ ไม่มีสิทธิ์เข้า Dashboard → redirect ไป MenuSelectPage");
            //   router.push("/dashboardse");
            //   return;
            // }

            setUser(currentUser);
            setProfileImage(currentUser?.image || currentUser?.profileImage || "/upload/user.png");
        } catch (e) {
            console.error("ไม่สามารถอ่านข้อมูล authUser:", e);
            router.push("/");
        }
    }, []);

    useEffect(() => {
        const handleProfileUpdated = () => {
            const raw = localStorage.getItem("authUser");
            if (raw) {
                const auth = JSON.parse(raw);
                const currentUser = auth?.user;
                setProfileImage(currentUser?.image || currentUser?.profileImage || "/upload/user.png");
            }
        };

        window.addEventListener("profile-updated", handleProfileUpdated);
        return () => {
            window.removeEventListener("profile-updated", handleProfileUpdated);
        };
    }, []);

    // โหลดแจ้งเตือน
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`${baseUrlAPI}/notifications`);
                setNotifications(res.data || []);
            } catch (err) {
                console.error("โหลดแจ้งเตือนไม่ได้:", err);
            }
        };

        if (showNotificationPopup) fetchNotifications();
    }, [showNotificationPopup]);

    // ปิด popup เมื่อคลิกนอก
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                bellButtonRef.current &&
                !bellButtonRef.current.contains(e.target as Node)
            ) {
                setShowNotificationPopup(false);
            }
        };
        if (showNotificationPopup) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
    }, [showNotificationPopup]);


    const handleLogout = async () => {
        const authData = JSON.parse(localStorage.getItem("authUser") || "{}");
        const user = authData.user;
        const sessionId = authData.sessionId;

        if (!user || !user.id) {
            console.warn("⚠️ ไม่พบข้อมูลผู้ใช้ใน localStorage");
            localStorage.clear();
            window.location.href = "/";
            return;
        }

        try {
            //   อัปเดตสถานะผู้ใช้
            await fetch(`${baseUrlAPI}/users/${user.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    statusWork: "2",
                    statusTime: new Date().toISOString(),
                }),
            });

            //   บันทึก log การออกจากระบบ (logs1)
            await fetch(`${baseUrlAPI}/logs1`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    action: "C",
                    status: "logout",
                    reason: "ออกจากระบบ",
                    sessionId: sessionId,
                }),
            });

        } catch (err) {
            console.error("❌ Error ระหว่าง logout:", err);
        }

        localStorage.clear();
        window.location.href = "/";
    };

    const renderContent = () => {
        switch (activeMenu) {
            case "menu1": return <Menu1Page />;
            case "menu2": return <Menu2Page />;
            case "menu16": return <Menu16Page />;
            default: return <div>🔍 ไม่พบเมนูที่เลือก</div>;
        }
    };

    return (
        <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-gray-800 min-h-screen"}>
            <header
                className={`overflow-hidden transition-all duration-500 ease-in-out
    ${showHeader ? "max-h-[500px] opacity-100 py-4 border-b" : "max-h-0 opacity-0 py-0 border-0"}
    flex justify-between items-center px-6 bg-opacity-50 backdrop-blur`}
            >
                {/* เมนู 6 ไอคอน */}
                <div className="flex space-x-6 text-lg">
                    <button onClick={() => setActiveMenu("menu1")} title="1.หน้าหลัก">
                        <img
                            src="/upload/menu1.png"
                            alt="หน้าหลัก"
                            className="w-6 sm:w-8 md:w-10 max-w-[40px] h-auto"
                        />
                    </button>
                    <button onClick={() => setActiveMenu("menu2")} title="3.หน้าคัดแยก">
                        <img
                            src="/upload/menu2.png"
                            alt="หน้าหลัก"
                            className="w-6 sm:w-8 md:w-10 max-w-[40px] h-auto"
                        />
                    </button>
                    <button onClick={() => setActiveMenu("menu16")} title="16.หน้าจัดยาลอง">
                        <img src="/upload/dispensary.png" alt="หน้าจัดยาลอง" className="w-6 sm:w-8 md:w-10 max-w-[40px] h-auto"
                        />
                    </button>
                </div>
                {/* ไอคอนด้านขวา */}
                <div className="flex items-center space-x-4">
                    <button onClick={handleLogout} title="ออกจากระบบ">
                        <img src="/upload/switch.png" alt="ออกจากระบบ" className="w-6 sm:w-8 md:w-10 max-w-[40px] h-auto"
                        />
                    </button>
                </div>
            </header>
            {showHeader ? (
                <button
                    onClick={() => setShowHeader(false)}
                    title="ซ่อนเมนู"
                    className="fixed top-13 left-5 z-50"
                >
                    <img
                        src="/upload/up.png"
                        alt="ซ่อนเมนู"
                        width={30}
                        height={30}
                    />
                </button>
            ) : (
                <button
                    onClick={() => setShowHeader(true)}
                    title="แสดงเมนู"
                    className="fixed top-1 left-5 z-50"
                >
                    <img
                        src="/upload/down.png"
                        alt="เปิดเมนู"
                        width={30}
                        height={30}
                        className="opacity-50"
                    />
                </button>
            )}
            {showNotificationPopup && (
                <div
                    className="absolute bg-white border border-gray-300 shadow-lg rounded-lg w-80 z-50"
                    style={{
                        position: "absolute",
                        top: bellButtonRef.current?.getBoundingClientRect().bottom ?? 80,
                        right: 20,
                    }}
                >
                    <div className="p-4">
                        <h2 className="font-bold text-lg mb-2">🔔 การแจ้งเตือน</h2>

                        {/* ปุ่มทดสอบแจ้งเตือน */}
                        <div className="mt-3 flex justify-between items-center">
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await fetch(`${baseUrlAPI}/notifications/mock`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                        });
                                        if (res.ok) {
                                            console.log("✅ แจ้งเตือนจำลองถูกสร้าง");
                                            const updated = await fetch(`${baseUrlAPI}/notifications`);
                                            const list = await updated.json();
                                            setNotifications(list);
                                        }
                                    } catch (err) {
                                        console.error("❌ สร้างแจ้งเตือนไม่สำเร็จ:", err);
                                    }
                                }}
                                className="text-sm text-red-600 hover:underline"
                            >
                                + ทดสอบแจ้งเตือน
                            </button>
                        </div>

                        {/* รายการแจ้งเตือน */}
                        <ul className="max-h-60 overflow-y-auto divide-y mt-2">
                            {notifications.length === 0 ? (
                                <li className="py-2 text-gray-500 text-center">
                                    ยังไม่มีการแจ้งเตือน
                                </li>
                            ) : (
                                notifications.slice(0, 5).map((item) => (
                                    <li
                                        key={item.id}
                                        className="py-2 px-2 hover:bg-gray-100 cursor-pointer text-sm"
                                        onClick={async () => {
                                            console.log("เลือกแจ้งเตือน", item);
                                            setShowNotificationPopup(false);
                                            setActiveMenu("menu15");

                                            // ✅ บันทึกว่าอ่านแล้ว
                                            try {
                                                const raw = localStorage.getItem("authUser");
                                                const user = raw ? JSON.parse(raw).user : null;
                                                if (user?.id) {
                                                    await fetch(`${baseUrlAPI}/notifications/${item.id}/read`, {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ userId: user.id }),
                                                    });
                                                }
                                            } catch (err) {
                                                console.error("❌ บันทึกว่าอ่านแจ้งเตือนไม่ได้:", err);
                                            }
                                        }}
                                    >
                                        <div className="font-medium">{item.title}</div>
                                        <div className="text-gray-600 truncate">{item.message}</div>
                                        <div className="text-gray-400 text-xs">
                                            {new Date(item.createdAt).toLocaleString("th-TH")}
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>

                        {/* ปุ่มไปหน้าทั้งหมด */}
                        {/* ปุ่มไปหน้าทั้งหมด */}
                        <div className="mt-3 text-right">
                            <button
                                onClick={async () => {
                                    try {
                                        const raw = localStorage.getItem("authUser");
                                        const user = raw ? JSON.parse(raw).user : null;
                                        if (user?.id) {
                                            for (const n of notifications) {
                                                try {
                                                    await fetch(`${baseUrlAPI}/notifications/${n.id}/read`, {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ userId: user.id }),
                                                    });
                                                } catch (err) {
                                                    console.warn(`⚠️ อ่านแจ้งเตือน ${n.id} ไม่สำเร็จ`, err);
                                                }
                                            }
                                        }
                                    } catch (err) {
                                        console.error("❌ เกิดข้อผิดพลาดขณะอ่านทั้งหมด:", err);
                                    }

                                    setActiveMenu("menu15");
                                    setShowNotificationPopup(false);
                                }}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                แสดงแจ้งเตือนทั้งหมด →
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* ส่วนเนื้อหาหน้า dashboard */}
            <main className={`p-6 transition-all duration-300 overflow-hidden ${showHeader ? 'h-[calc(100vh-80px)]' : 'h-[100vh]'}`}>

                {renderContent()}
            </main>
        </div>
    );
}
