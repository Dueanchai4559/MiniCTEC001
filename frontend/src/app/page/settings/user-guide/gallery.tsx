"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const mockUser = {
    name: "แซลม่อน",
    rank: "adminCT",
};

type AlbumItem = {
    id: number;
    image: string;
    caption: string;
};

export default function GalleryPage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const router = useRouter();
    const [album, setAlbum] = useState<AlbumItem[]>([
        { id: 1, image: "/img1.jpg", caption: "ภาพเปิดตัวโปรเจกต์" },
        { id: 2, image: "/img2.jpg", caption: "วันทดสอบระบบ" },
    ]);
    const [newCaption, setNewCaption] = useState("");

    const handleUpdateCaption = (id: number) => {
        if (newCaption.trim() === "") return;
        setAlbum((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, caption: newCaption } : item
            )
        );
        setNewCaption("");
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🖼️ อัลบั้มภาพกิจกรรม</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {album.map((item) => (
                    <div key={item.id} className="border rounded-lg shadow p-4 bg-white">
                        <img src={item.image} alt="album" className="w-full h-48 object-cover rounded mb-2" />
                        <p className="text-gray-700 mb-2">{item.caption}</p>

                        {mockUser.rank === "adminCT" && (
                            <div className="space-y-2">
                                <input
                                    className="border rounded w-full px-3 py-1 text-sm"
                                    placeholder="แก้ไขคำอธิบาย"
                                    value={newCaption}
                                    onChange={(e) => setNewCaption(e.target.value)}
                                />
                                <button
                                    onClick={() => handleUpdateCaption(item.id)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                >
                                    บันทึกคำอธิบาย
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {mockUser.rank !== "adminCT" && (
                <div className="mt-6 text-red-500 font-semibold text-center">
                    🔒 คุณไม่มีสิทธิ์แก้ไขอัลบั้มนี้
                </div>
            )}
        </div>
    );
}
