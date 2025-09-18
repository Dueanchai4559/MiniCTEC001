/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import SlotInfoPopup from "./SlotInfoPopup";
import AddCabinetPopup from "./AddCabinetPopup";
import { baseUrlAPI } from "@/app/ip";

interface CabinetMed {
    id: number;
    row: string;
    slot: string;
    medName?: string | null;
    medCode?: string | null;
    quantity?: number | null;
    image1?: string | null;
    location?: string | null;
    cabinetName?: string | null;
}

export default function CabinetGridPage() {
    const [cabinets, setCabinets] = useState<CabinetMed[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [creating, setCreating] = useState(false);

    // Tabs สำหรับเปลี่ยนตู้
    const [serverTabs, setServerTabs] = useState<string[]>([]);
    const [tabs, setTabs] = useState<string[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>("");

    // ป๊อปอัพเพิ่มตู้ใหม่
    const [showAddCabinetPopup, setShowAddCabinetPopup] = useState(false);
    const [newCabinetName, setNewCabinetName] = useState("");

    /** โหลดข้อมูลตู้ยา */
    const fetchCabinets = async () => {
        try {
            const res = await fetch(`${baseUrlAPI}/cabinets`);
            const data = await res.json();

            const normalized: CabinetMed[] = data.map((c: any) => ({
                ...c,
                row: c.row?.toString() ?? "0",
                slot: c.slot?.toString() ?? "0",
                medName: c.medName ?? c.medication?.name ?? null,
                medCode: c.medCode ?? c.medication?.code ?? null,
                quantity: c.quantity ?? c.medication?.quantity ?? 0,
                image1: c.image1 ?? c.medication?.image1 ?? null,
                cabinetName: c.cabinetName ?? "ไม่ระบุ",
                location: c.location ?? null,
            }));

            setCabinets(normalized);

            const uniqueCabinets = Array.from(new Set(normalized.map((c) => c.cabinetName || "ไม่ระบุ")));
            setServerTabs(uniqueCabinets);

            // merge กับ local
            setTabs((prev) => Array.from(new Set([...prev, ...uniqueCabinets])));

            // ตั้งค่า tab เริ่มต้น
            if (!selectedTab && uniqueCabinets.length > 0) {
                setSelectedTab(uniqueCabinets[0]);
            }
        } catch (err) {
            console.error("โหลดข้อมูลตู้ยาไม่สำเร็จ:", err);
        } finally {
            setLoading(false);
        }
    };

    /** โหลดข้อมูลทุก 3 วิ (หยุดเมื่อ popup เปิด) */
    useEffect(() => {
        fetchCabinets();
        if (showAddCabinetPopup) return;
        const interval = setInterval(fetchCabinets, 3000);
        return () => clearInterval(interval);
    }, [showAddCabinetPopup]);

    // ข้อมูลช่องของตู้ที่เลือก
    const currentCabinetSlots = cabinets.filter((c) => c.cabinetName === selectedTab);

    // กริด 9x9
    const gridSlots = Array.from({ length: 81 }, (_, i) => {
        const row = (Math.floor(i / 9) + 1).toString();
        const col = ((i % 9) + 1).toString();
        const med = currentCabinetSlots.find((c) => c.row === row && c.slot === col);
        return { row, col, med };
    });

    /** สร้างช่องที่ยังไม่มี */
    const createMissingSlots = async () => {
        const missingSlots = gridSlots.filter((slot) => !slot.med);
        if (missingSlots.length === 0) {
            console.log("ไม่มีช่องที่ขาดแล้ว");
            return;
        }

        setCreating(true);
        try {
            const res = await fetch(`${baseUrlAPI}/cabinets/create-missing`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cabinetName: selectedTab,
                    slots: missingSlots
                }),
            });

            if (res.ok) {
                console.log("สร้างช่องที่ขาดเรียบร้อย");
                fetchCabinets();
            } else {
                console.log("❌ สร้างช่องที่ขาดไม่สำเร็จ");
            }
        } catch (err) {
            console.error("สร้างช่องที่ขาดล้มเหลว:", err);
        } finally {
            setCreating(false);
        }
    };

    /** เปิด popup เพิ่มตู้ */
    const addNewCabinet = () => {
        setNewCabinetName("");
        setShowAddCabinetPopup(true);
    };

    /** กดปุ่มยืนยันเพิ่มตู้ */
    const confirmAddCabinet = () => {
        if (!newCabinetName.trim()) return;
        if (tabs.includes(newCabinetName)) {
            alert("มีชื่อตู้นี้แล้ว");
            return;
        }
        setTabs((prev) => [...prev, newCabinetName]);
        setSelectedTab(newCabinetName);
        setShowAddCabinetPopup(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center relative">
            <div className="w-full max-w-7xl relative">

                {/* Tabs */}
                <div className="flex justify-start gap-2 mb-4 flex-wrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            className={`px-4 py-2 rounded-md font-semibold ${selectedTab === tab
                                ? "bg-blue-600 text-white"
                                : "bg-gray-300 hover:bg-gray-400"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ปุ่มควบคุม */}
                <div className="relative flex items-center mb-3 px-4">
                    <div className="flex gap-3">
                        <button
                            onClick={addNewCabinet}
                            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                        >
                            เพิ่มตู้ใหม่
                        </button>

                        {selectedTab && (
                            <button
                                onClick={createMissingSlots}
                                disabled={creating}
                                className={`px-4 py-2 rounded-md font-semibold ${creating
                                    ? "bg-gray-400"
                                    : "bg-green-600 hover:bg-green-700"
                                    } text-white`}
                            >
                                {creating ? "กำลังสร้าง..." : "สร้างช่องที่ไม่มีข้อมูล"}
                            </button>
                        )}
                    </div>

                    <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-center">
                        {selectedTab ? `รายการยาในตู้: ${selectedTab}` : "ไม่พบตู้ใด ๆ"}
                    </h1>
                </div>

                {/* แสดงกริด */}
                {loading ? (
                    <div className="text-center text-gray-600">กำลังโหลดข้อมูล...</div>
                ) : selectedTab ? (
                    <div className="grid grid-cols-9 gap-1 p-2 bg-gray-200 rounded-lg">
                        {gridSlots.map((slot, index) => {
                            const quantity = slot.med?.quantity ?? 0;
                            const hasMed = Boolean(slot.med?.medName || slot.med?.medCode);

                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        if (!slot.med) {
                                            setSelectedSlot({
                                                row: slot.row,
                                                col: slot.col,
                                                medName: null,
                                                medCode: null,
                                                quantity: 0,
                                            });
                                            return;
                                        }
                                        setSelectedSlot({ ...slot.med, row: slot.row, col: slot.col });
                                    }}
                                    className={`relative w-[90px] h-[70px] rounded-md flex items-center justify-center text-xs font-semibold text-gray-700 cursor-pointer hover:scale-105 transition-transform
          ${!slot.med
                                            ? "bg-red-700 text-white"
                                            : hasMed && quantity > 0
                                                ? "bg-white shadow-[0_0_10px_rgba(0,255,0,0.6)]"
                                                : "bg-gray-300"
                                        }`}
                                >
                                    {/* ✅ จำนวนยา มุมขวาบน */}
                                    <span
                                        className={`absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-[12px] font-bold rounded-full
            ${quantity > 0
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-400 text-white"
                                            }`}
                                    >
                                        {quantity}
                                    </span>

                                    {/* ✅ รูปยาถ้ามี */}
                                    {slot.med?.image1 ? (
                                        <img
                                            src={slot.med.image1}
                                            alt={slot.med.medName || ""}
                                            className="w-[90px] h-[60px] object-contain rounded"
                                        />
                                    ) : null}

                                    {/* ✅ เลขช่องอยู่ด้านล่างกึ่งกลาง */}
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[13px] font-bold text-white bg-black bg-opacity-70 px-2 py-0.5 rounded">
                                        {slot.row}.{slot.col}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                ) : (
                    <div className="text-center text-gray-500 mt-5">ไม่มีข้อมูลตู้</div>
                )}
            </div>

            {/* Popup รายละเอียดช่องยา */}
            {selectedSlot && (
                <SlotInfoPopup
                    slot={selectedSlot}
                    onClose={() => setSelectedSlot(null)}
                />
            )}

            {/* Popup เพิ่มตู้ใหม่ */}
            {showAddCabinetPopup && (
                <AddCabinetPopup
                    newCabinetName={newCabinetName}
                    setNewCabinetName={setNewCabinetName}
                    onCancel={() => setShowAddCabinetPopup(false)}
                    onConfirm={confirmAddCabinet}
                />
            )}
        </div>
    );
}
