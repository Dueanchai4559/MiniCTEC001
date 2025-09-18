/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { baseUrlAPI } from "@/app/ip";

interface AddMedicinePopupProps {
    onClose: () => void;
    onAdded: () => void;
}

export default function AddMedicinePopup({ onClose, onAdded }: AddMedicinePopupProps) {
    const [medCode, setMedCode] = useState("");
    const [medName, setMedName] = useState("");
    const [medNameTH, setMedNameTH] = useState("");
    const [medNameEN, setMedNameEN] = useState("");
    const [packageType, setPackageType] = useState("");
    const [typemedi, setTypemedi] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [loading, setLoading] = useState(false);

    /** รับไฟล์ */
    const handleFiles = (files: FileList) => {
        const fileArray = Array.from(files).filter((file) => file.type.startsWith("image/"));
        setImages((prev) => [...prev, ...fileArray].slice(0, 3)); // จำกัดสูงสุด 3 รูป
    };

    /** Drag & Drop */
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    /** ลบรูป */
    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    /** ส่งข้อมูลไป backend */
    const handleSubmit = async () => {
        if (!medCode.trim() || !medNameTH.trim()) {
            console.log("⚠️ [ตรวจสอบข้อมูล] กรุณากรอกรหัสยาและชื่อภาษาไทยก่อนบันทึก");
            return;
        }

        console.log("📝 [เริ่มบันทึกยาใหม่] medCode:", medCode, "ชื่อยา (TH):", medNameTH);

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("medCode", medCode);
            formData.append("medName", medName);
            formData.append("medNameTH", medNameTH);
            formData.append("medNameEN", medNameEN);
            formData.append("package", packageType);
            formData.append("typemedi", typemedi);

            // ✅ ส่งไฟล์เป็น image1,image2,image3 ให้ตรงกับ backend
            images.forEach((file, idx) => {
                console.log(`📷 [แนบรูป] image${idx + 1}:`, file.name);
                formData.append(`image${idx + 1}`, file);
            });

            console.log("📤 [ส่งข้อมูลไป API] ->", `${baseUrlAPI}/medicine`);

            const res = await fetch(`${baseUrlAPI}/medicine`, {
                method: "POST",
                body: formData,
            });

            console.log("⏳ [รอผลลัพธ์จาก API] สถานะ:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("✅ [สำเร็จ] เพิ่มยาสำเร็จ:", data);
                onAdded();
                onClose();
            } else {
                const errorText = await res.text();
                console.error("❌ [ล้มเหลว] เพิ่มยาไม่สำเร็จ:", errorText);
            }
        } catch (err) {
            console.error("💥 [ข้อผิดพลาด] เพิ่มยาล้มเหลว:", err);
        } finally {
            console.log("🔚 [จบการทำงาน handleSubmit]");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0   bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[500px] p-6 relative">
                <h2 className="text-2xl font-bold text-center mb-4">➕ เพิ่มยาใหม่</h2>

                {/* ฟอร์มข้อมูลยา */}
                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">รหัสยา (medCode)</label>
                    <input type="text" className="w-full p-2 border rounded" value={medCode} onChange={(e) => setMedCode(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">ชื่อยา (ในระบบ)</label>
                    <input type="text" className="w-full p-2 border rounded" value={medName} onChange={(e) => setMedName(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">ชื่อยา (TH)</label>
                        <input type="text" className="w-full p-2 border rounded" value={medNameTH} onChange={(e) => setMedNameTH(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">ชื่อยา (EN)</label>
                        <input type="text" className="w-full p-2 border rounded" value={medNameEN} onChange={(e) => setMedNameEN(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">รูปแบบบรรจุภัณฑ์</label>
                        <input type="text" className="w-full p-2 border rounded" value={packageType} onChange={(e) => setPackageType(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">ประเภทยา</label>
                        <input type="text" className="w-full p-2 border rounded" value={typemedi} onChange={(e) => setTypemedi(e.target.value)} />
                    </div>
                </div>

                {/* อัปโหลดรูปแบบ Drag & Drop */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">รูปภาพ (สูงสุด 3 รูป)</label>

                    <div
                        className={`w-full min-h-[120px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer transition
              ${dragOver ? "border-blue-400 bg-blue-50" : "border-blue-300 bg-blue-50"}`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("fileInput")?.click()}
                    >
                        {images.length === 0 ? (
                            <div className="text-center text-gray-500">
                                <p>ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือก</p>
                                <p className="text-xs mt-1">รองรับไฟล์รูปภาพ สูงสุด 3 รูป</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap justify-center gap-3">
                                {images.map((file, idx) => (
                                    <div key={idx} className="relative w-24 h-24">
                                        <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-full h-full object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(idx);
                                            }}
                                            className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 py-0.5 rounded-bl"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => e.target.files && handleFiles(e.target.files)}
                        />
                    </div>
                </div>

                {/* ปุ่ม */}
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500" disabled={loading}>
                        ปิด
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                        disabled={loading}
                    >
                        {loading ? "กำลังบันทึก..." : "บันทึก"}
                    </button>
                </div>
            </div>
        </div>
    );
}
