/* eslint-disable @next/next/no-img-element */
import React from "react";

export interface Medicine {
    id: number;
    name: string;
    code?: string;
    type?: string;
    quantity?: number;
    unit?: string;
    image1?: string;
    image2?: string;
    image3?: string;
}

interface Props {
    medicine: Medicine | null;
    onClose: () => void;
}

export default function MedicineDetailPopup({ medicine, onClose }: Props) {
    if (!medicine) return null;

    const images = [medicine.image1, medicine.image2, medicine.image3].filter(Boolean);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-[fadeIn_0.2s_ease]">
                {/* ปุ่มปิด */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ✕
                </button>

                {/* รูปภาพ */}
                <div className="flex justify-center mb-5">
                    {images.length > 0 ? (
                        <div className="flex gap-2 overflow-x-auto max-w-full">
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img!}
                                    alt={`${medicine.name}-${idx}`}
                                    className="h-40 w-40 object-contain rounded border shadow-sm hover:scale-105 transition-transform"
                                />
                            ))}
                        </div>
                    ) : (
                        <span className="text-gray-400 text-sm">ไม่มีรูป</span>
                    )}
                </div>

                {/* รายละเอียด */}
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                    {medicine.name}
                </h2>
                <p className="text-gray-600 text-center mb-4">
                    {medicine.type || "ไม่ระบุประเภท"}
                </p>

                <div className="space-y-2 text-gray-700 text-sm">
                    <p>
                        <strong>รหัสยา:</strong> {medicine.code || "-"}
                    </p>
                    <p>
                        <strong>จำนวนคงเหลือ:</strong> {medicine.quantity ?? 0}{" "}
                        {medicine.unit || ""}
                    </p>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600 hover:shadow-lg transition"
                    >
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
}
