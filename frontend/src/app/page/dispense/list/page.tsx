/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { baseUrlAPI } from "./ip";

interface MedItem {
    name: string;
    amoung: number;
    unit: string;
    items?: MedItem[];
}

interface Prescription {
    id: number;
    number: string;
    hnCode: string;
    anCode: string;
    name: string;
    createdAt: string;
    items?: MedItem[];
}

export default function PrescriptionDetailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [scanCode, setScanCode] = useState("");
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    const queryNumber = searchParams.get("number") || "";
    const queryId = searchParams.get("id") || "";

    // โหลดข้อมูลใบสั่งยา
    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const res = await fetch(`${baseUrlAPI}/prescriptions`);
                if (!res.ok) throw new Error("Failed to fetch prescriptions");
                const data: Prescription[] = await res.json();
                setPrescriptions(data);

                if (queryNumber) {
                    setScanCode(queryNumber);
                } else if (queryId) {
                    const found = data.find((p) => p.id.toString() === queryId);
                    if (found) setScanCode(found.number);
                }
            } catch (error) {
                console.error("❌ Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, [queryNumber, queryId]);

    const filtered = prescriptions.filter(
        (p) =>
            scanCode &&
            (p.number === scanCode ||
                p.hnCode === scanCode ||
                p.anCode === scanCode)
    );

    const current = filtered[0];

    const handleGoHome = () => router.push("/page/dispense");

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-3xl text-gray-600">
                กำลังโหลดข้อมูล...
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-white py-10 px-6 flex flex-col items-center">
            {/* โลโก้พื้นหลัง 15% */}
            <div
                className="absolute inset-0 bg-center bg-no-repeat opacity-15"
                style={{
                    backgroundImage: "url('/upload/logoHOS2.png')",
                    backgroundSize: "40%", // โลโก้เล็กลงเหลือ 25% ของความกว้างจอ
                }}
            />

            <div className="w-full max-w-2xl relative z-10">

                {/* โลโก้ด้านบนซ้าย */}
                <img
                    src="/upload/logo2.jpg"
                    alt="Logo"
                    className="absolute top-0 left-0 w-28 h-auto object-contain"
                />

                {/* ปุ่ม Home ด้านบนขวา */}
                <button
                    onClick={handleGoHome}
                    className="absolute top-0 right-0 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100"
                >
                    <img
                        src="/upload/home-button.png"
                        alt="Home"
                        className="w-10 h-10 object-contain"
                    />
                </button>

                {/* หัวข้อ */}
                <h1 className="text-4xl font-bold text-center mb-8 mt-12">
                    รายละเอียดใบสั่งยา
                </h1>

                {/* กล่องรายละเอียดใบสั่งยา */}
                {current ? (
                    <div className="bg-pink-100 rounded-2xl p-6 shadow-lg mb-6 relative text-lg">
                        <div className="absolute top-3 right-6 text-2xl font-bold">
                            {current.number}
                        </div>
                        <p className="font-semibold mb-1">
                            HN : {current.hnCode || "-"} &nbsp; AN : {current.anCode || "-"}
                        </p>
                        <p>ชื่อผู้ป่วย : {current.name || "-"}</p>
                    </div>
                ) : (
                    <div className="bg-pink-100 rounded-2xl p-6 shadow-lg mb-6 text-center text-gray-500 text-lg">
                        {scanCode ? "ไม่พบข้อมูลที่สแกน" : "กรุณาสแกนใบสั่งยา"}
                    </div>
                )}

                {/* ตารางรายการยา */}
                <div className="overflow-x-auto max-h-[350px] rounded-xl border border-pink-200 text-lg">
                    <table className="w-full text-center">
                        <thead>
                            <tr className="bg-pink-200 font-semibold text-black">
                                <th className="py-3 border border-pink-300">ลำดับ</th>
                                <th className="py-3 border border-pink-300">รายการยา</th>
                                <th className="py-3 border border-pink-300">จำนวน</th>
                                <th className="py-3 border border-pink-300">หน่วย</th>
                            </tr>
                        </thead>
                        <tbody>
                            {current?.items?.length ? (
                                current.items.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={`${idx % 2 === 0 ? "bg-pink-50" : "bg-pink-100"
                                            }`}
                                    >
                                        <td className="py-3 border border-pink-200">{idx + 1}</td>
                                        <td className="py-3 border border-pink-200">{item.name}</td>
                                        <td className="py-3 border border-pink-200">{item.amoung}</td>
                                        <td className="py-3 border border-pink-200">{item.unit}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-6 text-gray-400 italic border border-pink-200"
                                    >
                                        ไม่มีข้อมูลยา
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* จำนวนทั้งหมด */}
                <div className="text-right mt-3 text-lg">
                    จำนวนยาทั้งหมด{" "}
                    <span className="font-bold">{current?.items?.length || 0}</span> รายการ
                </div>

                {/* ปุ่มเริ่มจัดยา */}
                <div className="text-right mt-6 text-lg">
                    <button
                        onClick={() => {
                            if (current) {
                                router.push(`/page/dispense/${current.id}?number=${scanCode}`);
                            }
                        }}
                        disabled={!current}
                        className={`px-12 py-3 text-xl font-bold rounded-xl shadow-lg ${!current
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-lime-400 hover:bg-lime-500 text-black"
                            }`}
                    >
                        เริ่มจัดยา
                    </button>
                </div>
            </div>
        </div>
    );
}
