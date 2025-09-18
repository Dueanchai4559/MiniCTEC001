/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent } from "react";
import { Dialog } from "@headlessui/react";
import type { User, Role1 } from "./types";

type Props = {
    data: User;
    onClose: () => void;
    onSave: () => void;
    isCreating: boolean;
    allUsers: User[];
    setEditUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export default function EditUserModal({
    data,
    onClose,
    onSave,
    isCreating,
    allUsers,
    setEditUser,
}: Props) {
    const handleChange = (field: keyof User, value: any) => {
        setEditUser((prev) => ({ ...prev!, [field]: value }));
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditUser((prev) => ({ ...prev!, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={!!data} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-2 rounded w-[80vw] max-h-[90vh] shadow overflow-y-auto space-y-4 text-[14px]">
                <h3 className="text-2xl font-bold">
                    {isCreating ? "เพิ่มผู้ใช้งานใหม่" : "✏️ แก้ไขข้อมูลผู้ใช้"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="grid grid-cols-5 gap-4  ">
                        {/* รูปโปรไฟล์ - ชิดซ้าย กิน 2 แถว */}
                        <div className="row-span-3 flex flex-col items-center md:items-start">
                            <label htmlFor="image-upload" className="text-xl text-gray-500 mb-2 ml-4 font-medium cursor-pointer">
                                {data.image ? (
                                    <img
                                        src={data.image}
                                        alt="รูปโปรไฟล์"
                                        className="w-62 h-62 rounded-full object-cover border-2 border-gray-300 shadow"
                                    />
                                ) : (
                                    <div className="w-62 h-62 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border">
                                        ไม่มีรูป
                                    </div>
                                )}
                                <div className="mt-2 underline text-blue-600 text-sm">กดเพื่อเปลี่ยนรูป</div>
                            </label>
                            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </div>

                        {/* ชื่อ */}
                        <div className="flex flex-col">
                            <label className="text-gray-600 font-semibold mb-1">ชื่อ</label>
                            <input className="p-2 border rounded" value={data.name ?? ""} onChange={(e) => handleChange("name", e.target.value)} />
                        </div>

                        {/* Username */}
                        <div className="flex flex-col">
                            <label className="text-gray-600 font-semibold mb-1">Username</label>
                            <input className="p-2 border rounded" value={data.username ?? ""} onChange={(e) => handleChange("username", e.target.value)} />
                        </div>

                        {/* เพศ */}
                        <div className="flex flex-col">
                            <label className="text-gray-600 font-semibold mb-1">เพศ</label>
                            <select className="p-2 border rounded" value={data.gender ?? ""} onChange={(e) => handleChange("gender", e.target.value)}>
                                <option value="">-- กรุณาเลือก --</option>
                                <option value="male">ผู้ชาย</option>
                                <option value="female">ผู้หญิง</option>
                            </select>
                        </div>

                        {/* อีเมล */}
                        <div className="flex flex-col">
                            <label className="text-gray-600 font-semibold mb-1">อีเมล</label>
                            <input className="p-2 border rounded" value={data.email ?? ""} onChange={(e) => handleChange("email", e.target.value)} />
                        </div>

                        <div className="flex flex-col md:grid-cols-2">
                            <label className="text-gray-600 font-semibold mb-1">เบอร์โทร</label>
                            <input className="p-2 border rounded" value={data.phone ?? ""} onChange={(e) => handleChange("phone", e.target.value)} />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-600 font-semibold mb-1">ตำแหน่ง</label>
                            <select className="p-2 border rounded" value={data.role ?? ""} onChange={(e) => handleChange("role", e.target.value)}>
                                <option value="">-- เลือกตำแหน่ง --</option>
                                <option value="adminCT">adminCT</option>
                                <option value="admin">admin</option>
                                <option value="userMedicine">userMedicine</option>
                                <option value="waitting">waitting</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-600 font-semibold mb-1">สถานะการทำงาน</label>
                            <select className="p-2 border rounded" value={data.statusWork ?? ""} onChange={(e) => handleChange("statusWork", e.target.value)}>
                                <option value="">-- กรุณาเลือก --</option>
                                <option value="1">🟢 ออนไลน์</option>
                                <option value="2">⚪ ออฟไลน์</option>
                                <option value="3">⛔ บล็อค</option>
                                <option value="4">🗑️ ลบทิ้ง</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-600 font-semibold mb-1">ผู้อนุมัติ</label>
                            <select className="p-2 border rounded" value={data.userAcceptName ?? ""} onChange={(e) => handleChange("userAcceptName", e.target.value)}>
                                <option value="">-- กรุณาเลือกผู้อนุมัติ --</option>
                                {allUsers.map((u) => (
                                    <option key={u.id} value={u.username}>
                                        {u.name} ({u.username})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-600 font-semibold mb-1">RFID</label>
                            <input className="p-2 border rounded" value={data.rfid ?? ""} onChange={(e) => handleChange("rfid", e.target.value)} />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-600 font-semibold mb-1">Barcode</label>
                            <input className="p-2 border rounded" value={data.barcode ?? ""} onChange={(e) => handleChange("barcode", e.target.value)} />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-gray-600 font-semibold mb-1">QR Code</label>
                            <input className="p-2 border rounded" value={data.qrCode ?? ""} onChange={(e) => handleChange("qrCode", e.target.value)} />
                        </div>
                    </div>

                    <div className="flex flex-col md:col-span-1">
                        <label className="text-gray-600 font-semibold mb-1">หมายเหตุ</label>
                        <textarea className="p-2 border rounded w-full" value={data.note ?? ""} onChange={(e) => handleChange("note", e.target.value)} />
                    </div>
                </div>

                {/* การใช้สิทธิ */}
                <div className="space-y-6">
                    {/* กลุ่มทั้งหมด */}
                    {[
                        {
                            title: "📋 การใช้งานหน้าต่าง ๆ",
                            items: [
                                ["do1", "DashBoard"],
                                ["do2", "หน้าใบสั่งยาทั้งหมด"],
                                ["do3", "หน้าคัดแยกใบสั่งยา"],
                                ["do4", "หน้าการจัดยา"],
                                ["do5", "หน้าตรวจสอบยา"],
                                ["do6", "หน้าตรวจสอบสำเร็จ"],
                                ["do7", "หน้าพักตะกร้านอกตู้พัก"],
                                ["do8", "หน้าจ่ายยาสำเร็จ"],
                                ["do9", "หน้าใบสั่งยายกเลิก"],
                                ["do10", "หน้ารายการยาในระบบ"],
                                ["do11", "หน้ารายการตู้ยา"],
                                ["do12", "หน้าเบิกยาด่วน"],
                                ["do13", "หน้าการเเจ้งเตือน"],
                                ["do14", "หน้ายืนยันตัวตนผู้ใช้งานใหม่"],
                            ],
                        },
                        {
                            title: "🧪 การจัดการยา",
                            items: [
                                ["do15", "กลุ่มยา"],
                                ["do17_1", "การจัดยา"],
                                ["do17_2", "การเติมยา"],
                                ["do17_3", "การแก้ไขยา"],
                                ["do17_4", "การตั้งค่า"],
                                ["do17_5", "การเข้าถึงรายงาน"],
                            ],
                        },
                        {
                            title: "🛠️ เครื่องมือที่ใช้",
                            items: [
                                ["do16", "การใช้งานแท็บเล็ต"],
                                ["do17", "การใช้งานเครื่องตู้ยา"],
                                ["do18", "หน้า CTV"],
                            ],
                        },
                        {
                            title: "⚠️ อื่น ๆ",
                            items: [
                                ["do19", "การใช้ยาเสี่ยง"],
                                ["do20", "สิทธิ์พิเศษ 20"],
                            ],
                        },
                    ].map((group, index) => (
                        <div key={index} className="border border-gray-300 rounded-lg p-4 shadow-sm">
                            <h5 className="text-lg font-semibold mb-3">{group.title}</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {group.items.map(([key, label]) => (
                                    <label key={key} className="inline-flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5"
                                            checked={data.role1?.[key as keyof Role1] || false}
                                            onChange={(e) => {
                                                const updated = {
                                                    ...(data.role1 || {}),
                                                    [key]: e.target.checked,
                                                };
                                                handleChange("role1", updated);
                                            }}
                                        />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>


                <div className="flex justify-end gap-2 ">
                    <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>ยกเลิก</button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={onSave}>บันทึก</button>
                </div>
            </Dialog.Panel >
        </Dialog >
    );
}
