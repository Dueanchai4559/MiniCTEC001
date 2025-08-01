/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { text } from "@/app/page/vatext";

export default function SettingsPage() {
    const router = useRouter();
    const [language, setLanguage] = useState<"en" | "th">("th");
    const toggleLanguage = () =>
        setLanguage((prev) => (prev === "en" ? "th" : "en"));

    const title = text.chooseRole.menuItems[3].title;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
            {/* ปุ่มสลับภาษา */}
            <div className="text-center mb-4 ml-[600px]">
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

            <h1 className="text-4xl font-bold mb-4">
                {language === "en" ? title.en : title.th}
            </h1>
            <p className="text-gray-600 mb-8">
                {language === "en"
                    ? "Application settings go here."
                    : "ตั้งค่าระบบจะมาอยู่ตรงนี้"}
            </p>

            <button
                onClick={() => router.push("/page")}
                className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
            >
                {language === "en" ? "Back to Menu" : "กลับสู่เมนู"}
            </button>
        </div>
    );
}
