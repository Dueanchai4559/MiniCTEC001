/* eslint-disable @next/next/no-img-element */
"use client";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { text } from "@/app/page/vatext";
import { baseUrlAPI } from "@/app/ip";

export default function LoginPage() {
    const [language, setLanguage] = useState<"en" | "th">("en");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // รับ cardId จาก query string
    const cardId = searchParams.get("cardId");

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleLanguage = () => setLanguage(language === "en" ? "th" : "en");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            // 1️⃣ Login
            const response = await fetch(`${baseUrlAPI}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loginInput: email, password }),
            });

            if (!response.ok) {
                const errJson = await response.json();
                console.error("❌ Login Failed:", errJson);

                setErrorMessage(
                    language === "en"
                        ? text.login.invalidCredentials.en
                        : text.login.invalidCredentials.th
                );

                // log failed
                await fetch(`${baseUrlAPI}/logs1`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: null,
                        action: "C",
                        status: "failed",
                        reason: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
                        sessionId: null,
                    }),
                });

                return;
            }

            const resData = await response.json();
            const user = resData.user;
            if (!user) {
                setErrorMessage(language === "en" ? "User not found" : "ไม่พบผู้ใช้");
                return;
            }

            // 2️⃣ ตรวจสิทธิ์
            const allowedRoles = [
                "adminCT",
                "adminMedicine",
                "adminCabinet",
                "userMedicine",
                "userCabinet",
                "userMedCa",
            ];
            if (!user.role || !allowedRoles.includes(user.role)) {
                console.warn("⚠️ ผู้ใช้ไม่มีสิทธิ์เข้าใช้งาน:", user.role);
                setErrorMessage(
                    language === "en"
                        ? text.login.roleNotAllowed.en
                        : text.login.roleNotAllowed.th
                );
                return;
            }

            // 3️⃣ ถ้ามี cardId → ลงทะเบียนการ์ด
            if (cardId) {
                try {
                    const regRes = await fetch(`${baseUrlAPI}/register-cards/${cardId}/user`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: user.id }),
                    });

                    if (regRes.ok) {
                        console.log("✅ การ์ดลงทะเบียนเรียบร้อย");
                    } else {
                        console.warn("⚠️ การ์ดลงทะเบียนไม่สำเร็จ");
                    }
                } catch (err) {
                    console.error("❌ ผิดพลาดตอนบันทึกการ์ด:", err);
                }
            }


            // 4️⃣ เก็บ session
            const now = new Date();
            const expireAt = new Date();
            expireAt.setHours(23, 59, 59, 999);
            localStorage.setItem(
                "authUser",
                JSON.stringify({
                    user,
                    lastActive: now.getTime(),
                    expireAt: expireAt.getTime(),
                })
            );

            // log success
            await fetch(`${baseUrlAPI}/logs1`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    action: "C",
                    status: "success",
                    reason: "เข้าสู่ระบบเพื่อลงทะเบียนการ์ดสำเร็จ",
                    sessionId: null,
                }),
            });

            // 5️⃣ ไปหน้า register card
            router.push("/page/register");
        } catch (error: unknown) {
            console.error("🔥 Error:", error);
            setErrorMessage("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white w-full h-full">
            <div
                className="min-h-screen bg-white w-full h-full p-10 bg-cover bg-center shadow-xl flex flex-col items-center justify-center"
                style={{
                    backgroundImage: "url('/upload/logo.png')",
                    backgroundSize: "90%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* ปุ่มเปลี่ยนภาษา */}
                <div className="text-center mb-4 ml-[400px]">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center space-x-2 text-blue-500 hover:underline font-semibold text-2xl"
                    >
                        <img
                            src={`/upload/${language === "en" ? "TH.png" : "EN.png"}`}
                            alt="Language Icon"
                            className="w-12 h-10"
                        />
                        <span>{language === "en" ? "ไทย" : "EN"}</span>
                    </button>
                </div>

                {/* Heading */}
                <div className="text-center mb-5">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-wide hover:text-blue-600 transition-colors duration-300">
                        {language === "en" ? text.login.heading.en : text.login.heading.th}
                    </h1>
                    <h2 className="text-3xl font-medium text-gray-600 mb-6 italic tracking-wide">
                        {language === "en" ? "Register Card" : "ลงทะเบียนการ์ด"}
                    </h2>
                </div>

                {/* Error */}
                {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                            {language === "en" ? text.login.userNameLabel.en : text.login.userNameLabel.th}
                        </label>
                        <input
                            id="email"
                            type="text"
                            placeholder={language === "en" ? "Enter your user name" : "กรอกชื่อผู้ใช้"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                            {language === "en" ? text.login.passwordLabel.en : text.login.passwordLabel.th}
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={language === "en" ? "Enter your password" : "กรอกรหัสผ่านของคุณ"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute top-1/2 right-4 transform -translate-y-1/2"
                        >
                            {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                        </button>

                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            {language === "en" ? "Login & Register Card" : "เข้าสู่ระบบและลงทะเบียนการ์ด"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
