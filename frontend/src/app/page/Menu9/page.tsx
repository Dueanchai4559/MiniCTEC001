/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { baseUrlAPI } from "@/app/ip";
import MedicineDetailPopup, { Medicine } from "./MedicineDetailPopup";
import AddMedicinePopup from "./AddMedicinePopup"; // ✅ เพิ่มป๊อปอัพเพิ่มยาใหม่

export default function Menu9Page() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [showAddPopup, setShowAddPopup] = useState(false); // ✅ state เปิดป๊อปอัพเพิ่มยา

    const fetchMedicines = async () => {
        try {
            const res = await fetch(`${baseUrlAPI}/medicine`);
            const data = await res.json();
            setMedicines(data);
        } catch (error) {
            console.error("โหลดข้อมูลยาไม่สำเร็จ:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    return (
        <main className="w-screen h-screen bg-white flex flex-col p-6 overflow-hidden">
            {/* ส่วนหัวข้อ + ปุ่มเพิ่มยา */}
            <div className="flex items-center justify-center mb-6 relative">
                <h1 className="text-4xl font-bold text-blue-800 text-center">
                    📦 รายการยา
                </h1>

                {/* ปุ่มเพิ่มยาใหม่ */}
                <div className="absolute right-10">
                    <button
                        onClick={() => setShowAddPopup(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow"
                    >
                        เพิ่มยาใหม่
                    </button>
                </div>
            </div>

            {/* โหลดข้อมูลหรือแสดงรายการ */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center text-gray-600 text-xl">
                    กำลังโหลดข้อมูล...
                </div>
            ) : medicines.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-600 text-xl">
                    ไม่มีข้อมูลยา
                </div>
            ) : (
                <div className="flex-1 overflow-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {medicines.map((med) => (
                            <div
                                key={med.id}
                                className="border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
                            >
                                {/* รูปยา */}
                                <div className="relative w-full h-32 flex justify-center items-center">
                                    {med.image1 ? (
                                        <img
                                            src={med.image1}
                                            alt={med.name}
                                            className="max-h-32 object-contain"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm">ไม่มีรูป</span>
                                    )}
                                    <span className="absolute top-1 right-1 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                                        {med.quantity ?? 0} {med.unit || ""}
                                    </span>
                                </div>

                                {/* ข้อมูลยา */}
                                <div className="mt-2 flex-1">
                                    <h2 className="font-bold text-gray-800 text-lg truncate">
                                        {med.name}
                                    </h2>
                                    <p className="text-sm text-gray-600 truncate">
                                        {med.type || "-"}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        รหัส: {med.code || "-"}
                                    </p>
                                </div>

                                {/* ปุ่มดูรายละเอียด */}
                                <button
                                    onClick={() => setSelectedMedicine(med)}
                                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 text-sm rounded"
                                >
                                    ดูรายละเอียด
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Popup รายละเอียดยา */}
            {selectedMedicine && (
                <MedicineDetailPopup
                    medicine={selectedMedicine}
                    onClose={() => setSelectedMedicine(null)}
                />
            )}

            {/* Popup เพิ่มยาใหม่ */}
            {showAddPopup && (
                <AddMedicinePopup
                    onClose={() => setShowAddPopup(false)}
                    onAdded={fetchMedicines}
                />
            )}
        </main>
    );
}
