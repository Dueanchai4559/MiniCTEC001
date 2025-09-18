/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { baseUrlAPI } from "@/app/ip";
import type { Unit } from "./types";

export default function UnitModal({
    onClose,
    currentUser,
}: {
    onClose: () => void;
    currentUser: any;
}) {
    const [units, setUnits] = useState<Unit[]>([]);
    const [showAddUnit, setShowAddUnit] = useState(false);
    const [newUnitName, setNewUnitName] = useState("");
    const [newUnitServerUrl, setNewUnitServerUrl] = useState("");
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null); // ✅ เพิ่ม
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [deleteErrorModal, setDeleteErrorModal] = useState<string | null>(null);

    const fetchUnits = async () => {
        try {
            const res = await fetch(`${baseUrlAPI}/units`);
            const data = await res.json();
            setUnits(data);
        } catch (err) {
            console.error("โหลดหน่วยงานล้มเหลว", err);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded w-[90vw] max-h-[95vh] overflow-y-auto shadow space-y-4 text-[16px]">
                <h3 className="text-xl font-bold mb-2">📋 หน่วยงานการทำงาน</h3>

                {/* ตารางข้อมูล */}
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full text-sm text-left border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">ชื่อกลุ่มหน่วยตรวจ</th>
                                <th className="p-2 border">IP</th>
                                <th className="p-2 border">ผู้ใช้งาน</th>
                                <th className="p-2 border">ผู้เพิ่ม</th>

                            </tr>
                        </thead>
                        <tbody>
                            {units.map((unit) => (
                                <tr
                                    key={unit.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedUnit(unit)} // ✅ เพิ่ม
                                >
                                    <td className="p-2 border">{unit.name}</td>
                                    <td className="p-2 border">{unit.serverUrl || "-"}</td>
                                    <td className="p-2 border">{unit.users?.length || 0}</td>
                                    <td className="p-2 border">{unit.createdBy?.name || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center pt-4">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        ปิดหน้าต่าง
                    </button>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() => setShowAddUnit(true)}
                    >
                        เพิ่มหน่วยตรวจ
                    </button>
                </div>

                {/* Add Unit Modal */}
                {showAddUnit && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow w-[90vw] max-w-md space-y-4">
                            <h2 className="text-xl font-bold mb-4">➕ เพิ่มหน่วยตรวจใหม่</h2>
                            <div>
                                <input
                                    type="text"
                                    placeholder="ชื่อหน่วย"
                                    className="border p-2 rounded w-full"
                                    value={newUnitName}
                                    onChange={(e) => setNewUnitName(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Server URL"
                                    className="border p-2 rounded w-full"
                                    value={newUnitServerUrl}
                                    onChange={(e) => setNewUnitServerUrl(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between pt-4">
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                    onClick={() => setShowAddUnit(false)}
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                    onClick={async () => {
                                        if (!newUnitName.trim()) {
                                            alert("กรุณากรอกชื่อหน่วย");
                                            return;
                                        }
                                        await fetch(`${baseUrlAPI}/units`, {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                                "x-user-id": currentUser?.id,
                                            },
                                            body: JSON.stringify({
                                                name: newUnitName,
                                                serverUrl: newUnitServerUrl || null,
                                            }),
                                        });
                                        setShowAddUnit(false);
                                        fetchUnits();
                                    }}
                                >
                                    บันทึก
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal ดูรายละเอียด */}
                {selectedUnit && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow w-[95vw] max-w-4xl space-y-4">
                            <h2 className="text-xl font-bold">🔎 รายละเอียดหน่วย</h2>

                            <div className="flex flex-col md:flex-row gap-6">
                                {/* ฝั่งซ้าย */}
                                <div className="flex-1 space-y-2 border rounded p-4 bg-gray-50 shadow-inner">
                                    <h3 className="text-lg font-semibold mb-2">📄 ข้อมูลหน่วย</h3>
                                    <p><strong>ชื่อหน่วย:</strong> {selectedUnit.name}</p>
                                    <p><strong>Server URL:</strong> {selectedUnit.serverUrl || "-"}</p>
                                    <p>
                                        <strong>ผู้เพิ่ม:</strong>{" "}
                                        {selectedUnit.createdBy
                                            ? `${selectedUnit.createdBy.name || "-"} (${selectedUnit.createdBy.email || "-"})`
                                            : "-"}
                                    </p>
                                    <p>
                                        <strong>วันที่สร้าง:</strong>{" "}
                                        {selectedUnit.createdAt
                                            ? new Date(selectedUnit.createdAt).toLocaleString("th-TH", {
                                                dateStyle: "full",
                                                timeStyle: "short",
                                            })
                                            : "-"}
                                    </p>

                                </div>

                                {/* ฝั่งขวา */}
                                <div className="flex-1 border rounded p-4 bg-gray-50 shadow-inner">
                                    <h3 className="text-lg font-semibold mb-2">👥 รายชื่อผู้ใช้งาน</h3>
                                    {selectedUnit.users && selectedUnit.users.length > 0 ? (
                                        <ul className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                            {selectedUnit.users.map((u) => (
                                                <li key={u.id} className="border-b pb-2 mb-2">
                                                    <p><strong>👤 {u.name || "-"}</strong></p>
                                                    <p className="text-sm text-gray-600">📧 {u.email || "-"}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>ไม่มีผู้ใช้งาน</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col pt-4 space-y-2">
                                <div className="flex justify-end gap-2">
                                    <button
                                        className={
                                            selectedUnit.users && selectedUnit.users.length > 0
                                                ? "bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                                                : "bg-red-600 text-white px-4 py-2 rounded"
                                        }
                                        onClick={() => {
                                            if (selectedUnit.users && selectedUnit.users.length > 0) {
                                                setDeleteErrorModal("ไม่สามารถลบหน่วยที่มีผู้ใช้งานอยู่ได้");
                                                return;
                                            }
                                            setConfirmDeleteModal(true);
                                        }}
                                    >
                                        ลบหน่วยนี้
                                    </button>
                                    <button
                                        className="bg-gray-600 text-white px-4 py-2 rounded"
                                        onClick={() => setSelectedUnit(null)}
                                    >
                                        ปิด
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 text-right">
                                    * ถ้ามีผู้ใช้งานอยู่จะไม่สามารถลบหน่วยนี้ได้
                                </p>
                            </div>
                            {confirmDeleteModal && (
                                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                                    <div className="bg-white p-4 rounded shadow space-y-4 w-full max-w-md">
                                        <h2 className="text-lg font-bold text-red-600">ยืนยันการลบ</h2>
                                        <p>
                                            ต้องการลบหน่วย <strong>{selectedUnit.name}</strong> ใช่หรือไม่?
                                        </p>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button
                                                className="bg-gray-400 text-white px-4 py-2 rounded"
                                                onClick={() => setConfirmDeleteModal(false)}
                                            >
                                                ยกเลิก
                                            </button>
                                            <button
                                                className="bg-red-600 text-white px-4 py-2 rounded"
                                                onClick={async () => {
                                                    try {
                                                        await fetch(`${baseUrlAPI}/units/${selectedUnit.id}`, {
                                                            method: "DELETE",
                                                        });
                                                        setConfirmDeleteModal(false);
                                                        setSelectedUnit(null);
                                                        fetchUnits();
                                                    } catch (err) {
                                                        console.error("ลบไม่สำเร็จ", err);
                                                        setDeleteErrorModal("เกิดข้อผิดพลาดในการลบหน่วย กรุณาลองใหม่");
                                                        setConfirmDeleteModal(false);
                                                    }
                                                }}
                                            >
                                                ลบเลย
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {deleteErrorModal && (
                                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                                    <div className="bg-white p-4 rounded shadow space-y-4 w-full max-w-md">
                                        <h2 className="text-lg font-bold text-red-600">ไม่สามารถลบได้</h2>
                                        <p>{deleteErrorModal}</p>
                                        <div className="flex justify-end pt-2">
                                            <button
                                                className="bg-gray-600 text-white px-4 py-2 rounded"
                                                onClick={() => setDeleteErrorModal(null)}
                                            >
                                                ปิด
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}
