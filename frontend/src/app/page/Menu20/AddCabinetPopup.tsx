/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

interface AddCabinetPopupProps {
    newCabinetName: string;
    setNewCabinetName: (name: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function AddCabinetPopup({
    newCabinetName,
    setNewCabinetName,
    onCancel,
    onConfirm,
}: AddCabinetPopupProps) {
    return (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[300px] flex flex-col gap-3">
                <h2 className="text-xl font-bold text-center mb-2">เพิ่มตู้ใหม่</h2>

                <input
                    type="text"
                    placeholder="กรอกชื่อตู้ใหม่"
                    value={newCabinetName}
                    onChange={(e) => setNewCabinetName(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-between gap-2 mt-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                        ยืนยัน
                    </button>
                </div>
            </div>
        </div>
    );
}
