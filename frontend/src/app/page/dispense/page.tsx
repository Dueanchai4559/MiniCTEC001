/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { baseUrlAPI } from "./list/ip";

interface Prescription {
    id: number;
    number: string;
    hnCode: string | null;
    anCode: string | null;
    name: string | null;
    colors: string | null;
    createdAt: string;
}

interface RegisterCard {
    id: number;
    colorName: string;
    bgColor: string;
    border: string;
}

export default function DispensePage() {
    const router = useRouter();
    const [language, setLanguage] = useState<"en" | "th">("th");
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [cards, setCards] = useState<RegisterCard[]>([]);
    const [loading, setLoading] = useState(true);

    const toggleLanguage = () => setLanguage((prev) => (prev === "en" ? "th" : "en"));

    // ---------------- ฟังก์ชันเลือกสีข้อความ ----------------
    const getTextColorClass = (bgColor: string) => {
        const darkKeywords = [
            "black", "gray-700", "gray-800", "gray-900",
            "red-700", "red-800", "red-900",
            "purple-600", "purple-700", "purple-800", "purple-900",
            "blue-700", "blue-800", "blue-900",
            "green-700", "green-800", "green-900",
        ];
        return darkKeywords.some(k => bgColor.includes(k)) ? "text-white" : "text-black";
    };

    // ---------------- Mapping สี ----------------
    const colorMapping: Record<string, string> = {
        "ม่วง": "purple", "purple": "purple",
        "แดง": "red", "red": "red",
        "เขียว": "green", "green": "green",
        "น้ำเงิน": "blue", "ฟ้า": "blue", "blue": "blue", "sky": "blue",
        "ชมพู": "pink", "pink": "pink",
        "เหลือง": "yellow", "yellow": "yellow",
        "ส้ม": "orange", "orange": "orange",
        "ขาว": "white", "white": "white",
        "เทา": "gray", "gray": "gray",
        "ดำ": "black", "black": "black",
    };

    const normalizeColor = (color: string | null) => {
        if (!color) return "";
        const key = color.trim().toLowerCase();
        return colorMapping[key] || "";
    };

    // ---------------- โหลดข้อมูล ----------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [preRes, cardRes] = await Promise.all([
                    fetch(`${baseUrlAPI}/prescriptions`),
                    fetch(`${baseUrlAPI}/register-cards`),
                ]);

                const data: Prescription[] = await preRes.json();
                const cardData: RegisterCard[] = await cardRes.json();

                console.log("=== 🔹 โหลดข้อมูลสำเร็จ ===");
                console.log("✅ ใบสั่งยาทั้งหมด:", data);
                console.log("✅ บัตรทั้งหมด:", cardData);

                // filter เฉพาะใบสั่งยาวันนี้
                const today = new Date();
                const tzOffset = 7 * 60; // GMT+7
                const todayStr = new Date(today.getTime() + tzOffset * 60 * 1000)
                    .toISOString()
                    .slice(0, 10);

                const todayPrescriptions = data.filter((p) => {
                    const created = new Date(p.createdAt);
                    const createdThai = new Date(created.getTime() + tzOffset * 60 * 1000);
                    return createdThai.toISOString().slice(0, 10) === todayStr;
                });

                const sorted = todayPrescriptions.sort(
                    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );

                // 🔹 Debug: แสดงสีทั้งหมดของใบสั่งยา
                console.log("=== 🔹 ตรวจสอบสีใบสั่งยา วันนี้ ===");
                sorted.forEach((p) => {
                    console.log(
                        `🟢 ใบสั่งยา ${p.number} | สีใน DB: "${p.colors}" | สีแมป: "${normalizeColor(p.colors)}"`
                    );
                });

                // 🔹 Debug: แสดงสีทั้งหมดของบัตร
                console.log("=== 🔹 ตรวจสอบสีบัตรทั้งหมด ===");
                cardData.forEach((c) => {
                    console.log(
                        `🔹 บัตร ${c.colorName} | สีแมป: "${normalizeColor(c.colorName)}"`
                    );
                });

                setPrescriptions(sorted);
                setCards(cardData);
            } catch (err) {
                console.error("❌ Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
                {language === "en" ? "Loading..." : "กำลังโหลด..."}
            </div>
        );
    }

    // ---------------- จัดกลุ่มตามสี ----------------
    const grouped = cards.map((card) => {
        const cardColorKey = normalizeColor(card.colorName);
        const prescriptionsOfColor = prescriptions.filter((p) => {
            const presColorKey = normalizeColor(p.colors);
            const match = presColorKey === cardColorKey;

            // 🔹 Debug: ตรวจสอบการจับคู่
            console.log(
                `🎨 เช็คใบสั่ง ${p.number} [${presColorKey}] กับบัตร ${card.colorName} [${cardColorKey}] => ${match ? "✅ ตรง" : "❌ ไม่ตรง"}`
            );

            return match;
        });
        return {
            ...card,
            prescriptions: prescriptionsOfColor,
        };
    });

    // ---------------- ใบสั่งยาที่ไม่มีสี ----------------
    const noColorPrescriptions = prescriptions.filter((p) => {
        const presColorKey = normalizeColor(p.colors);
        return !cards.some((c) => normalizeColor(c.colorName) === presColorKey);
    });

    if (noColorPrescriptions.length > 0) {
        console.log("⚠️ พบใบสั่งยาที่ไม่ตรงกับสีบัตร:", noColorPrescriptions.map(p => p.number));
        grouped.push({
            id: 0,
            colorName: "ไม่มีสี",
            bgColor: "bg-gray-100",
            border: "border-gray-300",
            prescriptions: noColorPrescriptions,
        });
    }

    // ---------------- Render ----------------
    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-white relative">
            <h1 className="text-3xl font-bold mt-10 mb-8 text-black">
                {language === "en" ? "Please scan the card to dispense" : "โปรดสแกนบัตรเพื่อจัดยา"}
            </h1>

            <div className="flex flex-col gap-4 w-full max-w-2xl">
                {grouped.map((group, index) => {
                    const firstPrescription = group.prescriptions[0];
                    const total = group.prescriptions.length;
                    const textColor = getTextColorClass(group.bgColor);

                    return (
                        <div
                            key={index}
                            className={`relative rounded-xl shadow-md p-4 flex flex-col ${group.bgColor} border ${group.border}`}
                        >
                            {total > 0 && (
                                <div className="absolute top-2 right-2 flex flex-col items-center">
                                    <div className="w-7 h-7 mb-1 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold shadow">
                                        {total}
                                    </div>
                                </div>
                            )}

                            <div className={`flex items-center mb-2 ${textColor}`}>
                                <div className={`w-5 h-5 rounded-full ${group.border} mr-2`} />
                                <span className="text-lg font-bold">{group.colorName}</span>
                            </div>

                            {total === 0 ? (
                                <div className={`text-sm opacity-70 ${textColor}`}>
                                    {language === "en" ? "No prescriptions" : "ไม่มีใบสั่งยา"}
                                </div>
                            ) : (
                                <div className={`text-sm border-t border-gray-200 pt-2 ${textColor}`}>
                                    <div>
                                        {language === "en"
                                            ? `Prescription Number: ${firstPrescription.number}  HN: ${firstPrescription.hnCode || "-"}  AN: ${firstPrescription.anCode || "-"}`
                                            : `เลขใบสั่งยา : ${firstPrescription.number}  HN: ${firstPrescription.hnCode || "-"}  AN: ${firstPrescription.anCode || "-"}`}
                                    </div>
                                    <div>
                                        {language === "en"
                                            ? `Patient: ${firstPrescription.name || "Unknown"}`
                                            : `ชื่อผู้ป่วย : ${firstPrescription.name || "ไม่ทราบชื่อ"}`}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between w-full max-w-2xl mt-10">
                <button
                    onClick={() => router.push("/page")}
                    className="px-8 py-3 bg-cyan-400 text-white font-bold rounded-xl shadow hover:bg-cyan-500 transition"
                >
                    {language === "en" ? "Go Back" : "ย้อนกลับ"}
                </button>
            </div>
        </div>
    );
}
