/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from "react";

interface SlotEditFormProps {
    formData: {
        medCode: string;
        medName: string;
        maxValue: number | null;
        minValue: number | null;
        unit: string;
        images: string[]; // สำหรับ preview
        imageFiles: File[]; // สำหรับไฟล์จริง
    };
    setFormData: (data: any) => void;
}

export default function SlotEditForm({ formData, setFormData }: SlotEditFormProps) {
    const inputClass =
        "w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-gray-700";
    const labelClass = "text-sm font-medium text-gray-600 mb-1 block";

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const selectedFiles = Array.from(files).slice(0, 3); // จำกัด 3 รูป
            const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));

            setFormData({
                ...formData,
                images: previewUrls,       // สำหรับ preview
                imageFiles: selectedFiles, // สำหรับ upload จริง
            });
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* ข้อมูลยา */}
            <div>
                <label className={labelClass}>รหัสยา</label>
                <input
                    type="text"
                    placeholder="กรอกรหัสยา"
                    value={formData.medCode}
                    onChange={(e) => setFormData({ ...formData, medCode: e.target.value })}
                    className={inputClass}
                />
            </div>

            <div>
                <label className={labelClass}>ชื่อยา</label>
                <input
                    type="text"
                    placeholder="กรอกชื่อยา"
                    value={formData.medName}
                    onChange={(e) => setFormData({ ...formData, medName: e.target.value })}
                    className={inputClass}
                />
            </div>

            <div>
                <label className={labelClass}>ค่าสูงสุดที่ควรมี</label>
                <input
                    type="number"
                    placeholder="0"
                    value={formData.maxValue ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, maxValue: e.target.value ? Number(e.target.value) : null })
                    }
                    className={inputClass}
                />
            </div>

            <div>
                <label className={labelClass}>ค่าต่ำสุดที่ควรมี</label>
                <input
                    type="number"
                    placeholder="0"
                    value={formData.minValue ?? ""}
                    onChange={(e) =>
                        setFormData({ ...formData, minValue: e.target.value ? Number(e.target.value) : null })
                    }
                    className={inputClass}
                />
            </div>

            <div>
                <label className={labelClass}>หน่วย</label>
                <input
                    type="text"
                    placeholder="เช่น เม็ด / ขวด"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className={inputClass}
                />
            </div>

            {/* อัปโหลดภาพช่องเดียว */}
            <div className="col-span-2">
                <label className={labelClass}>เลือกรูปภาพ (ได้สูงสุด 3 รูป)</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className={inputClass}
                />
            </div>

            {/* พรีวิวรูปภาพ */}
            {formData.images?.length > 0 && (
                <div className="col-span-2 flex justify-center gap-4 mt-2">
                    {formData.images.map((imgUrl, index) => (
                        <img
                            key={index}
                            src={imgUrl}
                            alt={`Preview${index + 1}`}
                            className="w-20 h-20 object-contain border rounded-lg"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
