import { Dialog } from "@headlessui/react";
import type { User } from "./types";

type Props = {
    user: User;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function ConfirmDeleteModal({ user, onCancel, onConfirm }: Props) {
    return (
        <Dialog open={!!user} onClose={onCancel} className="fixed inset-0 z-50 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded max-w-2xl w-full shadow space-y-4 overflow-y-auto max-h-[90vh]">
                <h3 className="text-lg font-bold text-red-600">⚠️ ยืนยันการลบผู้ใช้</h3>
                <p className="text-sm">คุณต้องการลบผู้ใช้งานนี้จริงหรือไม่?</p>
                <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>ชื่อ:</strong> {user.name}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>อีเมล:</strong> {user.email}</p>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={onCancel}>ยกเลิก</button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={onConfirm}>ลบข้อมูล</button>
                </div>
            </Dialog.Panel>
        </Dialog>
    );
}
