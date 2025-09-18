/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import UserTable from "./UserTable";
import { baseUrlAPI, baseUrlAPI2 } from "@/app/ip";

export default function SettingsPage() {
    const router = useRouter();
    const [darkMode, setDarkMode] = useState(false);
    const [todayCount, setTodayCount] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState(0);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const isDark = savedTheme === "dark";
        setDarkMode(isDark);
        document.documentElement.classList.toggle("dark", isDark);
    }, []);

    useEffect(() => {
        const raw = localStorage.getItem("authUser");
        if (!raw) {
            router.push("/");
            return;
        }

        try {
            const auth = JSON.parse(raw);
            const now = Date.now();
            const hasExpired = now > auth.expireAt;
            const inactiveTooLong = now - auth.lastActive > 5 * 60 * 1000;

            if (hasExpired || inactiveTooLong) {
                localStorage.removeItem("authUser");
                alert("เซสชันหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่");
                //  หน่วงเพื่อให้ alert ปิดก่อนค่อย redirect
                setTimeout(() => {
                    router.push("/");
                }, 100);
            }
        } catch {
            localStorage.removeItem("authUser");
            router.push("/");
        }
    }, [router]);

    const fetchPrescriptions = async () => {
        try {
            const res = await fetch(`${baseUrlAPI}/prescriptions`);
            const data = await res.json();

            if (!Array.isArray(data)) return;

            const today = new Date();
            const tzOffsetMs = 7 * 60 * 60 * 1000;

            const prescriptionsToday = data.filter((item: any) => {
                const createdUtc = new Date(item.createdAt);
                const createdThai = new Date(createdUtc.getTime() + tzOffsetMs);
                return (
                    createdThai.getDate() === today.getDate() &&
                    createdThai.getMonth() === today.getMonth() &&
                    createdThai.getFullYear() === today.getFullYear()
                );
            });

            setTodayCount(prescriptionsToday.length);
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

    return (
        <main className="p-6">
            <button
                onClick={() => (window.location.href = `${baseUrlAPI2}/dispense/dashboard`)}
                className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 rounded shadow"
            >
                🔙 กลับไปหน้าหลัก
            </button>
            <UserTable />
        </main>
    );
}
