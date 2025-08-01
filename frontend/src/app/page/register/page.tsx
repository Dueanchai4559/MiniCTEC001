/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { baseUrlAPI } from "@/app/ip";

export interface RegisterCard {
    id: number;
    colorName: string;
    rfid?: string | null;
    bgColor: string;
    border: string;
    userName?: string | null;
    userId?: number | null;
    createdAt: string;
    registeredAt?: string | null;  // วันที่ลงทะเบียนล่าสุด
    loggedOutAt?: string | null;   // วันที่ออกจากระบบล่าสุด
    usageHours?: number;           // ชั่วโมงการใช้งาน (optional)
    usageMinutes?: number;         // นาทีการใช้งาน (optional)
}

export default function RegisterPage() {
    const router = useRouter();
    const [cards, setCards] = useState<RegisterCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [newCardRFID, setNewCardRFID] = useState("");
    const [newCardColor, setNewCardColor] = useState("");

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");
    useEffect(() => {
        fetchCards();

        const interval = setInterval(() => {
            fetchCards();
        }, 1000); // ทุก 1 วินาที

        return () => clearInterval(interval);
    }, []);


    const thaiKeyToEnglish: Record<string, string> = {
        "ๅ": "1", "/": "2", "-": "3",
        "ภ": "4", "ถ": "5", "ุ": "6",
        "ึ": "7", "ค": "8", "ต": "9", "จ": "0",
    };
    const convertThaiToEnglish = (input: string) =>
        input.split("").map((ch) => thaiKeyToEnglish[ch] || ch).join("");

    const inputRef = useRef<HTMLInputElement>(null);

    const showMsg = (text: string, type: "success" | "error" = "success") => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(""), 3000);
    };

    const handleLogoutCard = async (cardId: number) => {
        try {
            const res = await fetch(`${baseUrlAPI}/register-cards/${cardId}/logout`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("ออกจากระบบล้มเหลว");
            await fetchCards();
            showMsg("✅ ออกจากระบบสำเร็จ");
        } catch (err) {
            console.error(err);
            showMsg("❌ ออกจากระบบล้มเหลว", "error");
        }
    };


    const fetchCards = async () => {
        try {
            const res = await fetch(`${baseUrlAPI}/register-cards`);
            if (!res.ok) throw new Error("โหลดข้อมูลการ์ดล้มเหลว");
            const data = await res.json();
            setCards(data);
        } catch (err) {
            console.error(err);
            setError("โหลดข้อมูลการ์ดล้มเหลว");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCards(); }, []);

    const handleRegisterRedirect = (card: RegisterCard) => {
        router.push(`/page/register/login?cardId=${card.id}`);
    };

    const openCreatePopup = () => {
        setNewCardRFID("");
        setNewCardColor("");
        setShowCreatePopup(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleCreateCard = async () => {
        if (!newCardRFID || !newCardColor) {
            showMsg("⚠️ กรุณากรอกข้อมูลให้ครบ", "error");
            return;
        }
        const colorMap: Record<string, { bg: string; border: string }> = {
            red: { bg: "bg-red-500", border: "border-red-700" },
            green: { bg: "bg-green-500", border: "border-green-700" },
            blue: { bg: "bg-blue-500", border: "border-blue-700" },
            yellow: { bg: "bg-yellow-400", border: "border-yellow-600" },
            purple: { bg: "bg-purple-500", border: "border-purple-700" },
            orange: { bg: "bg-orange-500", border: "border-orange-700" },
            pink: { bg: "bg-pink-400", border: "border-pink-600" },
            sky: { bg: "bg-sky-400", border: "border-sky-600" },
            brown: { bg: "bg-amber-800", border: "border-amber-900" },
            gray: { bg: "bg-gray-500", border: "border-gray-700" },
            white: { bg: "bg-white", border: "border-gray-800" },
        };

        const colorKey = newCardColor.toLowerCase();
        const colorConfig = colorMap[colorKey] || colorMap.red;

        try {
            const res = await fetch(`${baseUrlAPI}/register-cards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rfid: convertThaiToEnglish(newCardRFID),
                    colorName: newCardColor,
                    bgColor: colorConfig.bg,
                    border: colorConfig.border,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                showMsg(`❌ สร้างการ์ดล้มเหลว: ${data.error}`, "error");
                return;
            }

            setShowCreatePopup(false);
            await fetchCards();
            showMsg("✅ สร้างการ์ดใหม่สำเร็จ");
        } catch (err) {
            console.error(err);
            showMsg("❌ สร้างการ์ดล้มเหลว", "error");
        }
    };

    const handleGoHome = () => router.push("/page/dispense");

    if (loading) return <div className="p-10 text-center">กำลังโหลด...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <div className="relative min-h-screen bg-white py-10 px-6 flex flex-col items-center">
            {message && (
                <div className={`fixed top-5 z-50 px-6 py-3 rounded-lg shadow-lg
          ${messageType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {message}
                </div>
            )}

            <div
                className="absolute inset-0 bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/upload/logoHOS2.png')",
                    backgroundSize: "40%",
                    opacity: 0.15,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            <button
                onClick={handleGoHome}
                className="absolute top-0 right-0 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100"
            >
                <img src="/upload/home-button.png" alt="Home" className="w-10 h-10 object-contain" />
            </button>

            <h1 className="text-3xl font-bold mb-10 z-10">โปรดสแกนบัตรเพื่อลงทะเบียน</h1>

            <button
                onClick={openCreatePopup}
                className="mb-10 px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow hover:bg-green-600 z-10"
            >
                + สร้างการ์ดใหม่
            </button>

            <div className="grid grid-cols-2 gap-10 z-10">
                {cards.map((card) => {
                    const isLight =
                        card.bgColor?.includes("white") ||
                        card.bgColor?.includes("yellow") ||
                        card.bgColor?.includes("pink");

                    return (
                        <div
                            key={card.id}
                            className={`relative w-56 h-64 rounded-2xl shadow-xl border-4 overflow-hidden transform hover:scale-105 transition-all duration-300
        ${card.bgColor || "bg-gray-200"} ${card.border || "border-gray-400"}`}
                        >
                            {/* Overlay*/}
                            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

                            <div className="relative z-10 flex flex-col justify-between h-full p-4">
                                {/* ====== ข้อมูลบัตรด้านบน ====== */}
                                <div
                                    className={`mb-2 p-2 rounded-xl shadow text-xs sm:text-sm leading-snug
                ${isLight ? "bg-black/20 text-black" : "bg-black/40 text-white"}`}
                                >
                                    <p className="font-bold text-xl text-center mb-1">ข้อมูลบัตร</p>
                                    {card.userName ? (
                                        <>
                                            <p className="font-bold text-sm text-left mb-1">ผู้ลงทะเบียน</p>
                                            <p> {card.userName}</p>
                                            <p>วันที่เวลา: {card.registeredAt ? new Date(card.registeredAt).toLocaleString() : "-"}</p>
                                            <p>
                                                ใช้งาน:{" "}
                                                {card.registeredAt
                                                    ? (() => {
                                                        const diffMs = Date.now() - new Date(card.registeredAt).getTime();
                                                        const hours = Math.floor(diffMs / (1000 * 60 * 60));
                                                        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
                                                        return `${hours} ชั่วโมง ${minutes} นาที`;
                                                    })()
                                                    : "-"}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p>ยังไม่มีผู้ลงทะเบียน</p>
                                            <p>วันที่เวลา: -</p>
                                            <p>ใช้งาน: -</p>
                                        </>
                                    )}
                                </div>
                                {/* ====== ปุ่ม ====== */}
                                {card.userName ? (
                                    <button
                                        onClick={() => handleLogoutCard(card.id)}
                                        className="mx-auto px-5 py-2 font-semibold rounded-xl shadow-md transition duration-200
                    bg-red-500 text-white hover:bg-red-600"
                                    >
                                        ออกจากระบบ
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleRegisterRedirect(card)}
                                        className="mx-auto px-5 py-2 font-semibold rounded-xl shadow-md transition duration-200
                    bg-white/90 text-gray-800 hover:bg-white"
                                    >
                                        ลงทะเบียน
                                    </button>
                                )}
                            </div>

                            {/* เอฟเฟกต์แสง */}
                            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white/30 rounded-br-full blur-2xl" />
                            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-white/20 rounded-tl-full blur-2xl" />
                        </div>

                    );
                })}
            </div>

            {/* Popup สร้างการ์ดใหม่ */}
            {showCreatePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative">
                        <h2 className="text-xl font-bold mb-4 text-center">สร้างการ์ดใหม่</h2>
                        <p className="text-lg mb-4 text-center">โปรดสแกนบัตรเพื่อลงทะเบียน</p>

                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full border rounded-lg p-2 mb-4"
                            placeholder="รหัสบัตร (สแกน)"
                            value={newCardRFID}
                            onChange={(e) => setNewCardRFID(convertThaiToEnglish(e.target.value))}
                            onBlur={(e) => { if (showCreatePopup) e.target.focus(); }}
                        />

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[
                                { name: "red", label: "แดง", bg: "bg-red-500" },
                                { name: "green", label: "เขียว", bg: "bg-green-500" },
                                { name: "blue", label: "น้ำเงิน", bg: "bg-blue-500" },
                                { name: "yellow", label: "เหลือง", bg: "bg-yellow-400" },
                                { name: "purple", label: "ม่วง", bg: "bg-purple-500" },
                                { name: "orange", label: "ส้ม", bg: "bg-orange-500" },
                                { name: "pink", label: "ชมพู", bg: "bg-pink-400" },
                                { name: "sky", label: "ฟ้า", bg: "bg-sky-400" },
                                { name: "brown", label: "น้ำตาล", bg: "bg-amber-800" },
                                { name: "gray", label: "เทา", bg: "bg-gray-500" },
                                { name: "white", label: "ขาว", bg: "bg-white" },
                            ].map((color) => (
                                <button
                                    key={color.name}
                                    type="button"
                                    className={`h-12 rounded-lg font-bold shadow
          ${color.bg}
          ${color.name === "white" ? "text-black" : "text-white"}
          ${newCardColor === color.name ? "ring-4 ring-black" : ""}`}
                                    onClick={() => setNewCardColor(color.name)}
                                >
                                    {color.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowCreatePopup(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={handleCreateCard}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                ตกลง
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
