'use client';

import { useEffect, useState } from 'react';
import { Slot, Shelf } from './types';
import { baseUrlAPI } from '@/app/ip';

export default function MedicineCabinetEditor() {
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const location = "อาคารทหารไทย"; // หรือดึงจาก input ก็ได้

    useEffect(() => {
        const saved = localStorage.getItem('medicine_cabinet');
        if (saved) setShelves(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('medicine_cabinet', JSON.stringify(shelves));
    }, [shelves]);

    const addShelf = () => {
        const newShelf: Shelf = { id: Date.now(), slots: [] };
        setShelves([...shelves, newShelf]);
    };

    const removeShelf = (shelfId: number) => {
        setShelves(shelves.filter((shelf) => shelf.id !== shelfId));
    };

    const addSlotToShelf = async (shelfId: number) => {
        const updatedShelves = shelves.map((shelf) => {
            if (shelf.id === shelfId) {
                const nextSlotNumber = shelf.slots.length + 1;
                const row = shelves.findIndex(s => s.id === shelfId) + 1;
                const slot = nextSlotNumber;

                const newSlot: Slot = {
                    id: Date.now(),
                    width: 60,
                    height: 80,
                    label: `ช่อง ${slot}`,
                    isCabinetOpen: false,
                    isLightOn: false,
                    isOnline: false
                };

                // 🛠️ เรียก API ไปบันทึกตู้ยา
                const payload = {
                    boxcabinetName: `${row}.${slot}`,
                    row: row.toString(),
                    slot: slot.toString(),
                    location: location,
                };

                fetch(`${baseUrlAPI}/api/cabinets`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
                    .then(res => res.json())
                    .then(() => console.log("✅ บันทึกช่องใหม่สำเร็จ"))
                    .catch(err => console.error("❌ บันทึกช่องล้มเหลว:", err));

                return { ...shelf, slots: [...shelf.slots, newSlot] };
            }
            return shelf;
        });

        setShelves(updatedShelves);
    };

    const removeSlotFromShelf = (shelfId: number, slotId: number) => {
        const updatedShelves = shelves.map((shelf) => {
            if (shelf.id === shelfId) {
                const filteredSlots = shelf.slots.filter((slot) => slot.id !== slotId);
                const relabeledSlots = filteredSlots.map((slot, index) => ({
                    ...slot,
                    label: `ช่อง ${index + 1}`,
                }));
                return { ...shelf, slots: relabeledSlots };
            }
            return shelf;
        });
        setShelves(updatedShelves);
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-3xl">
            <h1 className="text-2xl font-bold">✏️ ตู้ยา (โหมดแก้ไข)</h1>
            {shelves.map((shelf) => (
                <div key={shelf.id} className="flex flex-col gap-2 bg-white p-2 rounded shadow">
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => addSlotToShelf(shelf.id)}
                            className="bg-green-500 text-white px-2 py-1 text-sm rounded hover:bg-green-600"
                        >
                            + ช่อง
                        </button>
                        <button
                            onClick={() => removeShelf(shelf.id)}
                            className="text-sm text-red-500 hover:underline"
                        >
                            ลบชั้นนี้
                        </button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto items-center">
                        {shelf.slots.map((slot) => (
                            <div
                                key={slot.id}
                                className="border border-gray-400 bg-blue-50 flex flex-col items-center justify-center text-xs text-center"
                                style={{ width: `${slot.width}px`, height: `${slot.height}px` }}
                            >
                                <span>{slot.label}</span>
                                <button
                                    onClick={() => removeSlotFromShelf(shelf.id, slot.id)}
                                    className="text-red-500 text-[10px] underline"
                                >
                                    ลบ
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <button
                onClick={addShelf}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                + เพิ่มชั้น
            </button>
        </div>
    );
}
