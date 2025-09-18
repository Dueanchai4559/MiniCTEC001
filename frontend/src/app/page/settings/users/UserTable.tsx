/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { baseUrlAPI } from "@/app/ip";

import type { User } from "./types";
import ViewUserModal from "./ViewUserModal";
import EditUserModal from "./EditUserModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import UnitModal from "./UnitModal";
import { useRouter } from "next/navigation";

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewUser, setViewUser] = useState<User | null>(null);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [confirmDeleteUser, setConfirmDeleteUser] = useState<User | null>(null);
    const [user, setUser] = useState<any>(null);
    const [showUnitModal, setShowUnitModal] = useState(false);

    const router = useRouter();


    useEffect(() => {
        const raw = localStorage.getItem("authUser");
        if (!raw) {
            router.push("/");
            return;
        }
        try {
            const auth = JSON.parse(raw);
            setUser(auth?.user);
        } catch (e) {
            console.error("ไม่สามารถอ่านข้อมูล authUser:", e);
            router.push("/");
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchAllUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${baseUrlAPI}/users`);
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("โหลด users ล้มเหลว:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const res = await fetch(`${baseUrlAPI}/users`);
            const data = await res.json();
            setAllUsers(data);
        } catch (err) {
            console.error("โหลด allUsers ล้มเหลว:", err);
        }
    };

    const handleSave = async () => {
        if (!editUser) return;
        const method = isCreating ? "POST" : "PUT";
        const url = isCreating
            ? `${baseUrlAPI}/users`
            : `${baseUrlAPI}/users/${editUser.id}`;

        const userId = user?.id;
        if (!userId) {
            alert("ไม่พบ user กรุณา login ใหม่อีกครั้ง");
            return;
        }

        const oldUser = users.find((u) => u.id === editUser.id) ?? {};
        const oldRole = oldUser?.role1 || {};
        const newRole = editUser?.role1 || {};

        if (!editUser.username || !editUser.email) {
            alert("กรุณากรอก Username และ Email ให้ครบ");
            return;
        }

        try {
            await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId,
                },
                body: JSON.stringify({
                    ...editUser,
                    oldData: { ...oldUser, role1: oldRole },
                    role1: newRole,
                }),
            });
            setEditUser(null);
            setIsCreating(false);
            fetchUsers();
        } catch (err) {
            console.error("❌ บันทึกไม่สำเร็จ:", err);
        }
    };

    const handleDelete = async () => {
        if (!confirmDeleteUser?.id) return;
        try {
            await fetch(`${baseUrlAPI}/users/${confirmDeleteUser.id}`, {
                method: "DELETE",
            });
            setConfirmDeleteUser(null);
            fetchUsers();
        } catch (err) {
            console.error("ลบไม่สำเร็จ:", err);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4 relative">
                <h2 className="text-xl font-bold">👥 รายชื่อผู้ใช้งาน</h2>
                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded absolute right-2"
                    onClick={() => setShowUnitModal(true)}
                >
                    🏢 หน่วยงานการทำงาน
                </button>
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
                                    <td className="px-4 py-2">
                                        {u.statusWork === "1" ? (
                                            <span className="text-green-500">🟢 ออนไลน์</span>
                                        ) : u.statusWork === "2" ? (
                                            <span className="text-gray-400">⚪ ออฟไลน์</span>
                                        ) : u.statusWork === "3" ? (
                                            <span className="text-yellow-500">⛔ บล็อค</span>
                                        ) : u.statusWork === "4" ? (
                                            <span className="text-red-500">🗑️ ลบทิ้ง</span>
                                        ) : (
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

            {/* Modal */}
            {viewUser && (
                <ViewUserModal
                    data={viewUser}
                    onClose={() => setViewUser(null)}
                    onEdit={() => {
                        setEditUser(viewUser);
                        setViewUser(null);
                    }}
                />
            )}
            {editUser && (
                <EditUserModal
                    data={editUser}
                    onClose={() => {
                        setEditUser(null);
                        setIsCreating(false);
                    }}
                    onSave={handleSave}
                    isCreating={isCreating}
                    allUsers={allUsers}
                    setEditUser={setEditUser}
                />
            )}
            {confirmDeleteUser && (
                <ConfirmDeleteModal
                    user={confirmDeleteUser}
                    onCancel={() => setConfirmDeleteUser(null)}
                    onConfirm={handleDelete}
                />
            )}
            {showUnitModal && (
                <UnitModal
                    onClose={() => setShowUnitModal(false)}
                    currentUser={user}
                />
            )}
        </div>
    );
}
