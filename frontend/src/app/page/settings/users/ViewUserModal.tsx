/* eslint-disable @next/next/no-img-element */
import { Dialog, DialogPanel } from "@headlessui/react";
import type { User } from "./types";

export default function ViewUserModal({
    data,
    onClose,
    onEdit,
}: {
    data: User;
    onClose: () => void;
    onEdit: () => void;
}) {

    return (
        <Dialog
            open={!!data}
            onClose={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center"
        >
            <DialogPanel className="bg-white p-6 rounded w-[95vw] h-[95vh] max-w-screen-2xl shadow overflow-y-auto text-[16px]">
                <h3 className="text-xl font-bold text-gray-800 mb-4">👤 ข้อมูลผู้ใช้งาน</h3>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* ฝั่งซ้าย: ข้อมูลผู้ใช้งาน */}
                    <div className="w-full md:w-1/2">
                        <div className="grid grid-cols-3 gap-x-8 gap-y-5 text-sm items-start">
                            {/* รูปโปรไฟล์ */}
                            <div className="row-span-2 flex flex-col items-center justify-center">
                                <label className="text-xl block text-gray-500 mb-2 font-medium">รูปโปรไฟล์</label>
                                {data.image ? (
                                    <img
                                        src={data.image}
                                        alt="รูปโปรไฟล์"
                                        className="w-32 h-32 rounded-full object-cover border shadow"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border">
                                        ไม่มีรูป
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-500 mb-1 font-medium">ชื่อ</label>
                                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">
                                    {data.name || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1 font-medium">Username</label>
                                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">
                                    {data.username || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1 font-medium">เพศ</label>
                                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">
                                    {data.gender || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1 font-medium">อีเมล</label>
                                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">
                                    {data.email || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1 font-medium">เบอร์โทร</label>
                                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">
                                    {data.phone || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1 font-medium">ตำแหน่ง</label>
                                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">
                                    {data.role || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1 font-medium">สถานะการทำงาน</label>
                                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50 flex items-center gap-2">
                                    {data.statusWork === "1" && <><span className="text-green-500">🟢</span> ออนไลน์</>}
                                    {data.statusWork === "2" && <><span className="text-gray-400">⚪</span> ออฟไลน์</>}
                                    {data.statusWork === "3" && <><span className="text-yellow-500">⛔</span> บล็อค</>}
                                    {data.statusWork === "4" && <><span className="text-red-500">🗑️</span> ลบทิ้ง</>}
                                    {!["1", "2", "3", "4"].includes(data.statusWork ?? "") && <span>-</span>}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1 font-medium">RFID</label>
                                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">
                                    {data.rfid || "-"}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1 font-medium">Barcode</label>
                                {data.barcode ? (
                                    <img
                                        src={`https://barcode.tec-it.com/barcode.ashx?data=${data.barcode}&code=Code128&dpi=96`}
                                        alt="Barcode"
                                        className="border rounded p-1 bg-white max-w-full"
                                    />
                                ) : (
                                    <p className="text-gray-400 border border-gray-200 rounded px-3 py-2 bg-gray-50">-</p>
                                )}
                            </div>
                            <div className="row-span-2 flex flex-col items-center justify-center">
                                <label className="block text-gray-500 mb-1 font-medium">QR Code</label>
                                {data.qrCode ? (
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${data.qrCode}`}
                                        alt="QR Code"
                                        className="w-24 h-24 border rounded"
                                    />
                                ) : (
                                    <div className="w-24 h-24 border rounded flex items-center justify-center text-gray-400">ไม่มี</div>
                                )}
                            </div>
                            <div className="col-span-3">
                                <label className="block text-gray-500 mb-1 font-medium">หมายเหตุ</label>
                                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">
                                    {data.note || "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ฝั่งขวา: สิทธิ์การใช้งาน */}
                    {data.role1 && (
                        <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l pt-4 md:pl-6">
                            <h4 className="text-lg font-bold text-gray-700 mb-2">สิทธิ์การใช้งาน (Role)</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {Object.entries({
                                    do1: "หน้า Dashboard",
                                    do2: "หน้าใบสั่งยาทั้งหมด",
                                    do3: "หน้าคัดแยกใบสั่งยา",
                                    do4: "หน้าการจัดยา",
                                    do5: "หน้าตรวจสอบยา",
                                    do6: "หน้าตรวจสอบสำเร็จ",
                                    do7: "หน้าพักตะกร้านอกตู้พัก",
                                    do8: "หน้าจ่ายยาสำเร็จ",
                                    do9: "หน้าใบสั่งยายกเลิก",
                                    do10: "หน้ารายการยาในระบบ",
                                    do11: "หน้ารายการตู้ยา",
                                    do12: "หน้าเบิกยาด่วน",
                                    do13: "หน้าการเเจ้งเตือน",
                                    do14: "หน้ายืนยันตัวตนผู้ใช้งานใหม่",
                                    do15: "กลุ่มยา",
                                    do16: "การใช้งานแท็บเล็ต",
                                    do17: "การใช้งานเครื่องตู้ยา",
                                    do17_1: "การจัดยา",
                                    do17_2: "การเติมยา",
                                    do17_3: "การแก้ไขยา",
                                    do17_4: "การตั้งค่า",
                                    do17_5: "การเข้าถึงรายงาน",
                                    do18: "หน้า CTV",
                                    do19: "การใช้ยาเสี่ยง",
                                    do20: "สิทธิ์อื่น ๆ",
                                }).map(([key, label]) => (
                                    <label
                                        key={key}
                                        className={`flex items-center gap-2 border rounded px-3 py-2 text-sm
            ${data.role1?.[key as keyof typeof data.role1]
                                                ? "bg-red-50 border-red-400 text-red-700"
                                                : "bg-gray-100 border-gray-300 text-gray-400"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.role1?.[key as keyof typeof data.role1] === true}
                                            disabled
                                            className="form-checkbox h-4 w-4 text-red-600 cursor-not-allowed"
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* ปุ่มปิด/แก้ไข */}
                <div className="flex justify-end gap-2 mt-6">
                    <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
                        ปิด
                    </button>
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={onEdit}>
                        แก้ไข
                    </button>
                </div>
            </DialogPanel>
        </Dialog>
    );
}
