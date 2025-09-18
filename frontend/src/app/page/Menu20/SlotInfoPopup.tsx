/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { baseUrlAPI } from "@/app/ip";
import SlotEditForm from "./SlotEditForm";

interface SlotInfoPopupProps {
    slot: any;
    onClose: () => void;
}

export default function SlotInfoPopup({ slot, onClose }: SlotInfoPopupProps) {
    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        medCode: slot.medCode || "",
        medName: slot.medName || "",
        maxValue: slot.maxValue ?? null,
        minValue: slot.minValue ?? null,
        unit: slot.unit || "",
        images: [slot.image1, slot.image2, slot.image3].filter(Boolean), // preview
        imageFiles: [], // เก็บไฟล์จริงตอนแก้ไข
    });

    // รวมรูปเป็น array
    const images = [slot.image1, slot.image2, slot.image3].filter(Boolean);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // state สำหรับซูมรูป
    const [zoomImage, setZoomImage] = useState<string | null>(null);

    const handlePrev = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const handleSave = async () => {
        const form = new FormData();

        form.append("medName", formData.medName || "");
        form.append("medCode", formData.medCode || "");
        if (formData.maxValue !== null) form.append("maxValue", String(formData.maxValue));
        if (formData.minValue !== null) form.append("minValue", String(formData.minValue));
        form.append("unit", formData.unit || "");

        // อัปโหลดไฟล์จริง
        if (formData.imageFiles && formData.imageFiles.length > 0) {
            formData.imageFiles.forEach((file) => {
                form.append(`images`, file); // key เป็น "images"
            });
        }

        try {
            const res = await fetch(`${baseUrlAPI}/cabinets/${slot.id}`, {
                method: "PUT",
                body: form, // ไม่ต้อง set Content-Type
            });

            const responseText = await res.text();
            if (res.ok) {
                console.log("✅ [DEBUG] บันทึกสำเร็จ:", responseText);
                setEditing(false);
                onClose();
            } else {
                console.error("❌ [DEBUG] บันทึกไม่สำเร็จ:", res.status, responseText);
            }
        } catch (err) {
            console.error("❌ [DEBUG] เกิดข้อผิดพลาดเชื่อมต่อเซิร์ฟเวอร์:", err);
        }
    };

    return (
        <>
            {/* Popup หลัก */}
            <div
                className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl shadow-2xl p-6 w-[480px] relative animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ปุ่มปิด */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                    >
                        ✕
                    </button>

                    {/* หัวข้อ */}
                    <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                        ช่อง {slot.row}.{slot.col}{" "}
                        <span className="text-gray-500">({slot.boxcabinetName || "ไม่มีชื่อ"})</span>
                    </h2>

                    {/* ข้อมูลช่อง */}
                    <div className="mb-4 bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200">
                        <p><b>ตู้:</b> {slot.cabinetName}</p>
                        <p><b>ประเภทตู้:</b> {slot.typyCabinet || "-"}</p>
                        <p><b>ตำแหน่ง:</b> {slot.location || "-"}</p>
                        <p><b>ยาฉุกเฉิน:</b> {slot.emergency ? "✅" : "❌"}</p>
                    </div>

                    {/* แสดงข้อมูลยา */}
                    {!editing ? (
                        slot.medName ? (
                            <div className="border rounded-xl p-3 bg-white shadow-inner space-y-2 text-gray-700">
                                {images.length > 0 && (
                                    <div className="relative w-full flex items-center justify-center">
                                        <img
                                            src={images[currentImageIndex]}
                                            alt={slot.medName}
                                            onClick={() => setZoomImage(images[currentImageIndex])}
                                            className="w-40 h-40 object-contain mx-auto mb-3 rounded-lg border cursor-zoom-in"
                                        />
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={handlePrev}
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white rounded-l hover:bg-gray-700"
                                                >
                                                    ◀
                                                </button>
                                                <button
                                                    onClick={handleNext}
                                                    className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white rounded-r hover:bg-gray-700"
                                                >
                                                    ▶
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                                <p><b>ชื่อยา:</b> {slot.medName}</p>
                                <p><b>รหัส:</b> {slot.medCode || "-"}</p>
                                <p><b>หน่วย:</b> {slot.unit || "-"}</p>
                                <p><b>ค่าต่ำสุด (minValue):</b> {slot.minValue ?? "-"}</p>
                                <p><b>ค่าสูงสุด (maxValue):</b> {slot.maxValue ?? "-"}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4 italic">
                                ไม่มีข้อมูลยาสำหรับช่องนี้
                            </p>
                        )
                    ) : (
                        <SlotEditForm formData={formData} setFormData={setFormData} />
                    )}

                    {/* ปุ่ม */}
                    <div className="mt-6 flex justify-between">
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
                            >
                                แก้ไข
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                                >
                                    บันทึก
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Popup ซูมรูป */}
            {zoomImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setZoomImage(null)}
                >
                    <img
                        src={zoomImage}
                        alt="Zoomed"
                        className="max-w-[90%] max-h-[90%] object-contain rounded-xl shadow-2xl cursor-zoom-out"
                    />
                    <button
                        onClick={() => setZoomImage(null)}
                        className="absolute top-4 right-4 text-white text-3xl font-bold"
                    >
                        ✕
                    </button>
                </div>
            )}
        </>
    );
}
