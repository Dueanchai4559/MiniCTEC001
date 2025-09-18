/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DeleteMedDialog.tsx
"use client";
import { Dialog } from "@headlessui/react";
import React from "react";

type DeleteMedDialogProps = {
    open: boolean;
    onClose: () => void;
    deleteTarget: {
        index: number;
        id: number;
        reasons: string[];
        note: string;
        med?: any;
        readonly?: boolean;
    } | null;
    setDeleteTarget: React.Dispatch<React.SetStateAction<any>>;
    isConfirmDisabled: boolean;
    handleDeleteMed: (
        index: number,
        id: number,
        textstatus?: string,
        status?: "2" | "3"
    ) => void;
};



export default function DeleteMedDialog({
    open,
    onClose,
    deleteTarget,
    setDeleteTarget,
    isConfirmDisabled,
    handleDeleteMed,
}: DeleteMedDialogProps) {
    const isReadOnly = deleteTarget?.readonly;

    if (!deleteTarget) return null;

    function formatThaiDateTime(isoDate: string): string {
        const date = new Date(isoDate);
        const formatter = new Intl.DateTimeFormat("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Bangkok",
        });
        return formatter.format(date).replace(" น.", "") + " น.";
    }


    return (
        <Dialog open={open} onClose={onClose} className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-[1550px] shadow-lg p-4 grid grid-cols-12 gap-6 items-stretch">
                {/* ฝั่งซ้าย: ข้อมูลยา */}
                <div className="col-span-4 border rounded-md bg-gray-50 p-4 space-y-4 text-sm">
                    <div className="flex justify-center">
                        <img
                            src={deleteTarget?.med?.image1 || "/no-image.png"}
                            alt="รูปยา"
                            className="w-40 h-40 object-contain border rounded-md"
                        />
                    </div>
                    <div className="bg-white p-4 border rounded-md shadow-sm">
                        <div className="border rounded-md bg-white p-4 shadow-sm">
                            <h3 className="font-semibold text-gray-700 mb-2">ข้อมูลยา</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <p><strong>รหัสยา:</strong> {deleteTarget?.med?.medCode || "-"}</p>
                                <p><strong>ชื่อยา:</strong> {deleteTarget?.med?.medName || "-"}</p>
                                <p><strong>จำนวน:</strong> {deleteTarget?.med?.amoung || "-"}</p>
                            </div>
                        </div>

                        {/* ตำแหน่งจัดเก็บ */}
                        <div className="border rounded-md bg-white p-4 shadow-sm mt-4">
                            <h3 className="font-semibold text-gray-700 mb-2">ตำแหน่งจัดเก็บ</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <p><strong>ตู้ยา:</strong> {deleteTarget?.med?.cabinetName || "-"}</p>
                                <p><strong>ช่องยา:</strong> {deleteTarget?.med?.boxcabinetName || "-"}</p>
                                <p><strong>แถว / ช่อง:</strong> {deleteTarget?.med?.row || "-"} / {deleteTarget?.med?.slot || "-"}</p>
                            </div>
                        </div>

                        {/* สถานะการหยิบยา */}
                        <div className="border rounded-md bg-white p-4 shadow-sm mt-4">
                            <h3 className="font-semibold text-gray-700 mb-2">สถานะการหยิบยา</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <p><strong>หยิบยา:</strong> {deleteTarget?.med?.isPicked ? "ใช่" : "ไม่"}</p>
                                <p><strong>ผู้ที่หยิบ:</strong> {deleteTarget?.med?.pickedBy || "-"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 "></div>
                            <p>
                                <strong>เวลาหยิบ:</strong>{" "}
                                {deleteTarget?.med?.pickedAt
                                    ? formatThaiDateTime(deleteTarget.med.pickedAt)
                                    : "-"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ฝั่งขวา: รายละเอียดเหตุผล */}
                <div className="col-span-8 space-y-4">
                    <Dialog.Title className="text-xl font-semibold text-red-600">
                        ยืนยันการแจ้งปัญหายา
                    </Dialog.Title>
                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-800 pr-2">
                        {[
                            {
                                title: "ปัญหาการจัดยา",
                                reasons: [
                                    "จัดยาผิด", "ยาไม่ตรง", "ข้อมูลซ้ำ", "ใช้รหัสยาผิด",
                                    "ไม่มีชื่อยานี้ในระบบ", "ข้อมูลยาไม่ตรงกับฉลาก",
                                    "ใช้ชื่อยาเฉพาะทางผิด", "จัดยายาไม่ครบ", "จัดยาเกิน",
                                    "ปริมาณเกินความเป็นไปได้",
                                ],
                            },
                            {
                                title: "ปัญหาการปริ้น",
                                reasons: [
                                    "ฉลากยาไม่ตรงกับข้อมูลจริง", "พิมพ์ชื่อยาผิด   สะกดผิด",
                                    "ขนาดความแรงในฉลากผิด", "ปริมาณยาบนฉลากไม่ตรง",
                                    "รูปแบบยาในฉลากไม่ถูกต้อง", "วันหมดอายุในฉลากไม่ตรง",
                                    "ฉลากขาด ซีด  อ่านไม่ได้", "พิมพ์ฉลากซ้ำหลายชุด",
                                    "บาร์โค้ดในฉลากไม่สามารถสแกนได้",
                                ],
                            },
                            {
                                title: "ปัญหาการจ่ายยา",
                                reasons: [
                                    "จ่ายยาผิดชนิด", "จ่ายยาผิดขนาดความแรง", "จ่ายยาผิดรูปแบบ",
                                    "จ่ายยาผิดจำนวน", "จ่ายยาหมดอายุ เสื่อมคุณภาพ",
                                    "จ่ายยาซ้ำ", "จ่ายยาที่ผู้ป่วยแพ้",
                                ],
                            },
                            {
                                title: "ปัญหาตัวยา",
                                reasons: [
                                    "การปนเปื้อนระหว่างยา", "ภาชนะบรรจุไม่เหมาะสม", "ยาหมดอายุ",
                                    "ยาเสื่อมคุณภาพ", "ยาหก หล่น เสียระหว่างจัด",
                                ],
                            },
                        ].map(({ title, reasons }) => (
                            <div key={title} className="space-y-2">
                                <p className="font-bold text-black">{title}:</p>
                                {reasons.map((reason) => {
                                    const isChecked = deleteTarget?.reasons?.includes(reason) || false;
                                    return (
                                        <label
                                            key={reason}
                                            className={`
              flex items-center gap-2 rounded px-2 py-1
            ${isReadOnly ? "pointer-events-none cursor-not-allowed" : ""}
            `}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    const newReasons = new Set(deleteTarget?.reasons || []);
                                                    if (e.target.checked) {
                                                        newReasons.add(reason);
                                                    } else {
                                                        newReasons.delete(reason);
                                                    }
                                                    setDeleteTarget((prev: typeof deleteTarget) =>
                                                        prev ? { ...prev, reasons: Array.from(newReasons) } : null
                                                    );
                                                }}
                                                className={`accent-red-600 ${isReadOnly ? "pointer-events-none" : ""}`}
                                            />
                                            {reason}
                                        </label>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* สถานะการจัดยา */}
                    <div className="bg-red-50 border border-red-300 rounded-md p-4">
                        <label className="flex items-center gap-2 text-red-700 font-semibold text-base">
                            <input
                                type="checkbox"
                                className="accent-red-600 w-5 h-5"
                                checked={deleteTarget.reasons.includes("ไม่จัดยานี้")}
                                onChange={(e) => {
                                    const newReasons = new Set(deleteTarget.reasons);
                                    if (e.target.checked) {
                                        newReasons.add("ไม่จัดยานี้");
                                    } else {
                                        newReasons.delete("ไม่จัดยานี้");
                                    }
                                    setDeleteTarget((prev: typeof deleteTarget) =>
                                        prev ? { ...prev, reasons: Array.from(newReasons) } : null
                                    );

                                }}
                                disabled={isReadOnly}
                            />
                            ไม่จัดยานี้
                        </label>
                    </div>

                    <textarea
                        className={`w-full p-2 border rounded
  ${isReadOnly ? "bg-red-50 text-red-600 border-red-300 font-semibold" : ""}
`}

                        placeholder="หมายเหตุเพิ่มเติม (ห้ามใส่ / )"
                        rows={3}
                        value={deleteTarget.note}
                        readOnly={isReadOnly}
                        onChange={(e) => {
                            if (!isReadOnly && !e.target.value.includes("/")) {
                                setDeleteTarget((prev: typeof deleteTarget) => ({ ...prev!, note: e.target.value }));
                            }
                        }}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            ปิด
                        </button>
                        {!isReadOnly && (
                            <button
                                disabled={isConfirmDisabled}
                                className={`px-4 py-2 rounded text-white shadow ${isConfirmDisabled ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
                                onClick={() => {
                                    const isCancel = deleteTarget.reasons.includes("ไม่จัดยานี้");
                                    const textstatus = [...deleteTarget.reasons, deleteTarget.note.trim()]
                                        .filter(Boolean)
                                        .join(" / ");
                                    const status = isCancel ? "3" : "2";

                                    // ส่งค่าพร้อมสถานะไปยัง handleDeleteMed
                                    handleDeleteMed(deleteTarget.index, deleteTarget.id, textstatus, status);
                                }}
                            >
                                ยืนยันแจ้งปัญหา
                            </button>

                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
