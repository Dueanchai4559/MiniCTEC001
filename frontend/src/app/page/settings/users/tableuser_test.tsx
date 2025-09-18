/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { baseUrlAPI } from "@/app/ip";

type User = {
  id?: number;
  name?: string;
  username?: string;
  statusWork?: string;
  email?: string;
  phone?: string;
  image?: string;
  note?: string;
  role?: string;
  gender?: string;
  ipUser?: string;
  userAcceptName?: string;
  ipAccept?: string;
  rfid?: string;
  barcode?: string;
  qrCode?: string;
  updatedAt?: string;
  createdAt?: string;
};
export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const res = await fetch(`${baseUrlAPI}users`);
      const data = await res.json();
      setAllUsers(data);
    };
    fetchAllUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${baseUrlAPI}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(" โหลดข้อมูลล้มเหลว:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editUser?.barcode && !editUser.qrCode?.includes(editUser.barcode)) {
      setEditUser((prev) => ({
        ...prev!,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${prev?.barcode}`,
      }));
    }
  }, [editUser?.barcode]);


  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!confirmDeleteUser?.id) return;
    await fetch(`${baseUrlAPI}/users/${confirmDeleteUser.id}`, {
      method: "DELETE",
    });
    setConfirmDeleteUser(null);
    fetchUsers();
  };

  const handleSave = async () => {
    if (!editUser) return;
    const method = isCreating ? "POST" : "PUT";
    const url = isCreating
      ? `${baseUrlAPI}users`
      : `${baseUrlAPI}/users/${editUser.id}`;
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser),
      });
      setEditUser(null);
      setIsCreating(false);
      fetchUsers();
    } catch (err) {
      console.error(" บันทึกไม่สำเร็จ:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">👥 รายชื่อผู้ใช้งาน</h2>
      </div>
      {loading ? (
        <p className="text-gray-500">⏳ กำลังโหลดข้อมูล...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-200 rounded-md shadow">
            <thead className="bg-gray-50 text-gray-700">
              <tr className="divide-x divide-gray-200">
                <th className="px-4 py-2 font-medium">ชื่อ</th>
                <th className="px-4 py-2 font-medium">Username</th>
                <th className="px-4 py-2 font-medium">อีเมล</th>
                <th className="px-4 py-2 font-medium">เบอร์โทร</th>
                <th className="px-4 py-2 font-medium">ตำแหน่ง</th>
                <th className="px-4 py-2 font-medium">สถานะการทำงาน</th>
                <th className="px-4 py-2 font-medium">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 divide-x divide-gray-100">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.username}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.phone}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    {u.statusWork === "1" && (
                      <>
                        <span className="text-green-500">🟢</span>
                        <span>ออนไลน์</span>
                      </>
                    )}
                    {u.statusWork === "2" && (
                      <>
                        <span className="text-gray-400">⚪</span>
                        <span>ออฟไลน์</span>
                      </>
                    )}
                    {u.statusWork === "3" && (
                      <>
                        <span className="text-yellow-500">⛔</span>
                        <span>บล็อค</span>
                      </>
                    )}
                    {u.statusWork === "4" && (
                      <>
                        <span className="text-red-500">🗑️</span>
                        <span>ลบทิ้ง</span>
                      </>
                    )}
                    {!["1", "2", "3", "4"].includes(u.statusWork ?? "") && (
                      <span>-</span>
                    )}
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex gap-2 text-gray-600">
                      <button onClick={() => setViewUser(u)} title="ดู">
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditUser(u);
                          setIsCreating(false);
                        }}
                        title="แก้ไข"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteUser(u)}
                        title="ลบ"
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* 👁️ View Modal */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[90vw] max-h-[95vh] shadow overflow-y-auto space-y-4 text-[16px]">
            <h3 className="text-xl font-bold text-gray-800 mb-4">👤 ข้อมูลผู้ใช้งาน</h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-5 text-sm items-start">
              {/* รูปโปรไฟล์ (2 แถว) */}
              <div className="row-span-2 flex flex-col items-center justify-center">
                <label className="text-xl block text-gray-500 mb-2 font-medium">รูปโปรไฟล์</label>
                {viewUser.image ? (
                  <img
                    src={viewUser.image}
                    alt="รูปโปรไฟล์"
                    className="w-32 h-32 rounded-full object-cover border shadow"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border">
                    ไม่มีรูป
                  </div>
                )}
              </div>

              {/* แถว 1 */}
              <div>
                <label className="block text-gray-500 mb-1 font-medium">ชื่อ</label>
                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">{viewUser.name || "-"}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1 font-medium">Username</label>
                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">{viewUser.username || "-"}</p>
              </div>

              {/* แถว 2 */}
              <div>
                <label className="block text-gray-500 mb-1 font-medium">เพศ</label>
                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">{viewUser.gender || "-"}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1 font-medium">อีเมล</label>
                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">{viewUser.email || "-"}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1 font-medium">เบอร์โทร</label>
                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">{viewUser.phone || "-"}</p>
              </div>

              {/* แถว 3 */}
              <div>
                <label className="block text-gray-500 mb-1 font-medium">ตำแหน่ง</label>
                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">{viewUser.role || "-"}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1 font-medium">สถานะการทำงาน</label>
                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50 flex items-center gap-2">
                  {viewUser.statusWork === "1" && (
                    <>
                      <span className="text-green-500">🟢</span>
                      <span>ออนไลน์</span>
                    </>
                  )}
                  {viewUser.statusWork === "2" && (
                    <>
                      <span className="text-gray-400">⚪</span>
                      <span>ออฟไลน์</span>
                    </>
                  )}
                  {viewUser.statusWork === "3" && (
                    <>
                      <span className="text-yellow-500">⛔</span>
                      <span>บล็อค</span>
                    </>
                  )}
                  {viewUser.statusWork === "4" && (
                    <>
                      <span className="text-red-500">🗑️</span>
                      <span>ลบทิ้ง</span>
                    </>
                  )}
                  {!["1", "2", "3", "4"].includes(viewUser.statusWork ?? "") && (
                    <span>-</span>
                  )}
                </p>
              </div>


              {/* แถว 4 */}
              <div>
                <label className="block text-gray-500 mb-1 font-medium">RFID</label>
                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">{viewUser.rfid || "-"}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1 font-medium">Barcode</label>
                {viewUser.barcode ? (
                  <img
                    src={`https://barcode.tec-it.com/barcode.ashx?data=${viewUser.barcode}&code=Code128&dpi=96`}
                    alt="Barcode"
                    className="border rounded p-1 bg-white max-w-full"
                  />
                ) : (
                  <p className="text-gray-400 border border-gray-200 rounded px-3 py-2 bg-gray-50">-</p>
                )}
              </div>
              <div className="row-span-2 flex flex-col items-center justify-center">
                <label className="block text-gray-500 mb-1 font-medium">QR Code</label>
                {viewUser.qrCode ? (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${viewUser.qrCode}`}
                    alt="QR Code"
                    className="w-24 h-24 border rounded"
                  />
                ) : (
                  <div className="w-24 h-24 border rounded flex items-center justify-center text-gray-400">ไม่มี</div>
                )}
              </div>

              {/* แถว 5 */}
              <div className="flex flex-col col-span-2">
                <label className="text-gray-600 font-semibold mb-1">ผู้อนุมัติ</label>
                <select
                  className="p-2 border rounded"
                  value={editUser?.userAcceptName ?? ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser!, userAcceptName: e.target.value }) // ใช้ `!` ยืนยันว่ามีค่า
                  }
                >
                  <option value="">-- กรุณาเลือกผู้อนุมัติ --</option>
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.username})
                    </option>
                  ))}
                </select>
              </div>


              {/* หมายเหตุ */}
              <div className="col-span-3">
                <label className="block text-gray-500 mb-1 font-medium">หมายเหตุ</label>
                <p className="text-gray-800 border border-gray-200 rounded px-3 py-2 bg-gray-50">{viewUser.note || "-"}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setViewUser(null)}
              >
                ปิด
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setEditUser(viewUser);
                  setViewUser(null);
                }}
              >
                แก้ไข
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ✏️ Edit/Add Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[90vw] max-h-[95vh] shadow overflow-y-auto space-y-4 text-[16px]">
            <h3 className="text-2xl font-bold">
              {isCreating ? " เพิ่มผู้ใช้งานใหม่" : "✏️ แก้ไขข้อมูลผู้ใช้"}
            </h3>
            <div className="grid grid-cols-3 gap-4 p-2">
              {/* รูปภาพ */}
              <div className="row-span-2 flex flex-col items-center justify-center">
                <label className="text-xl  block text-gray-500 mb-2 font-medium">รูปโปรไฟล์</label>

                <label htmlFor="image-upload" className="cursor-pointer group flex flex-col items-center">
                  {editUser?.image ? (
                    <img
                      src={editUser.image}
                      alt="รูปโปรไฟล์"
                      className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow transition group-hover:ring-2 group-hover:ring-blue-400"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 shadow">
                      ไม่มีรูป
                    </div>
                  )}

                  <span className="text-xl text-blue-600 mt-2 underline group-hover:text-blue-800 transition">
                    กดเพื่อเปลี่ยนรูป
                  </span>
                </label>

                {/* Hidden file input */}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditUser({ ...editUser!, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>


              {/* บรรทัด 1 */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1">ชื่อ</label>
                <input className="p-2 border rounded" value={editUser.name ?? ""} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1">Username</label>
                <input className="p-2 border rounded" value={editUser.username ?? ""} onChange={(e) => setEditUser({ ...editUser, username: e.target.value })} />
              </div>

              {/* บรรทัด 2 */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1">เพศ</label>
                <select
                  className="p-2 border rounded"
                  value={editUser.gender ?? ""}
                  onChange={(e) => setEditUser({ ...editUser, gender: e.target.value })}
                >
                  <option value="">-- กรุณาเลือก --</option>
                  <option value="male">ผู้ชาย</option>
                  <option value="female">ผู้หญิง</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1">อีเมล</label>
                <input className="p-2 border rounded" value={editUser.email ?? ""} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1">เบอร์โทร</label>
                <input className="p-2 border rounded" value={editUser.phone ?? ""} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} />
              </div>

              {/* บรรทัด 3 */}
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1">ตำแหน่ง</label>
                <input className="p-2 border rounded" value={editUser.role ?? ""} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-semibold mb-1">สถานะการทำงาน</label>
                <select
                  className="p-2 border rounded"
                  value={editUser.statusWork ?? ""}
                  onChange={(e) => setEditUser({ ...editUser, statusWork: e.target.value })}
                >
                  <option value="">-- กรุณาเลือก --</option>
                  <option value="ออนไลน์">🟢 ออนไลน์</option>
                  <option value="ออฟไลน์">⚪ ออฟไลน์</option>
                  <option value="บล็อค">⛔ บล็อค</option>
                  <option value="ลบทิ้ง">🗑️ ลบทิ้ง</option>
                </select>
              </div>



              {/* บรรทัด 4 */}
              <div className="flex gap-4">
                <div className="col-span-2 flex flex-col">
                  <label className="text-gray-600 font-semibold mb-1">ผู้อนุมัติ</label>
                  <select
                    className="p-2 border rounded"
                    value={editUser.userAcceptName ?? ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, userAcceptName: e.target.value })
                    }
                  >
                    <option value="">-- กรุณาเลือกผู้อนุมัติ --</option>
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} ({u.username})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-gray-600 font-semibold mb-1">RFID</label>
                  <input
                    className="p-2 border rounded"
                    value={editUser?.rfid ?? ""}
                    onChange={(e) => setEditUser({ ...editUser!, rfid: e.target.value })}
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-gray-600 font-semibold mb-1">QRCODE</label>
                  <input
                    className="p-2 border rounded"
                    value={editUser?.qrCode ?? ""}
                    onChange={(e) => setEditUser({ ...editUser!, qrCode: e.target.value })}
                  />
                </div>
                <div className="flex flex-col w-1/2">
                  <label className="text-gray-600 font-semibold mb-1">Barcode</label>
                  <input
                    className="p-2 border rounded"
                    value={editUser?.barcode ?? ""}
                    onChange={(e) => setEditUser({ ...editUser!, barcode: e.target.value })}
                  />
                </div>
              </div>

              {/* QR/Barcode ฝั่งขวาตลอดแนว */}
              <div className="row-span-3 col-start-3 row-start-4 row-end-7 flex flex-col justify-center items-center">
                <label className="text-gray-600 font-semibold mb-2">QR Code / Barcode</label>
                <div className="flex flex-col items-center gap-4">
                  {editUser.barcode ? (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${editUser.barcode}`}
                      alt="QR Code"
                      className="w-[200px] h-[200px] border rounded"
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] border rounded flex items-center justify-center text-gray-400">ไม่มี</div>
                  )}
                  {editUser.barcode ? (
                    <img
                      src={`https://barcode.tec-it.com/barcode.ashx?data=${editUser.barcode}&code=Code128&dpi=96`}
                      alt="Barcode"
                      className="w-[300px] h-[80px] bg-white p-1 border rounded"
                    />
                  ) : (
                    <div className="w-[250px] h-[60px] border rounded flex items-center justify-center text-gray-400">
                      ไม่มี
                    </div>
                  )}
                </div>
              </div>

              {/* บรรทัด 5 */}


              {/* หมายเหตุ */}
              <div className="col-span-2 flex flex-col">
                <label className="text-gray-600 font-semibold mb-1">หมายเหตุ</label>
                <textarea className="p-2 border rounded" value={editUser.note ?? ""} onChange={(e) => setEditUser({ ...editUser, note: e.target.value })} />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 flex-wrap gap-2">
              {/* ปุ่มดาวน์โหลด QR และ Barcode */}
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${editUser?.barcode ?? ""}`;
                    link.download = "qrcode.png";
                    link.click();
                  }}
                >
                  โหลด QR Code
                </button>
                <button
                  className="bg-blue-500  text-white px-4 py-2 rounded"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = `https://barcode.tec-it.com/barcode.ashx?data=${editUser?.barcode ?? ""}&code=Code128&dpi=96`;
                    link.download = "barcode.png";
                    link.click();
                  }}
                >
                  โหลด Barcode
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setEditUser(null);
                    setIsCreating(false);
                    setViewUser(null);
                  }}
                >
                  ปิด
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  บันทึก
                </button>
              </div>


            </div>

          </div>
        </div>
      )}
      {/*  ลบผู้ใช้ (Custom Confirm Popup) */}
      {confirmDeleteUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-2xl w-full shadow space-y-4 overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold text-red-600 flex items-center gap-1">
              <span></span> ยืนยันการลบ
            </h3>
            <p className="text-sm">ต้องการลบบัญชีผู้ใช้งานนี้ใช่หรือไม่?</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>ชื่อ:</strong> {confirmDeleteUser.name}</p>
              <p><strong>Username:</strong> {confirmDeleteUser.username}</p>
              <p><strong>อีเมล:</strong> {confirmDeleteUser.email}</p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                onClick={() => setConfirmDeleteUser(null)}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 shadow-md min-w-[100px]"
                onClick={handleDelete}
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
