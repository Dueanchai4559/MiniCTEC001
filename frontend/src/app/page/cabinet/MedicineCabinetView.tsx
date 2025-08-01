/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Shelf, Slot } from './types'; // ต้องมี interface เดียวกับ editor
import { baseUrlAPI } from '@/app/ip';

export default function MedicineCabinetView() {
    const [shelves, setShelves] = useState<Shelf[]>([]);

    useEffect(() => {
        const fetchShelves = async () => {
            try {
                const res = await fetch(`${baseUrlAPI}/cabinets`);
                const data: any[] = await res.json();
                console.log("📦 โหลดข้อมูล cabinets จาก backend:", data.length);

                const transformed: Shelf[] = data.map((shelf: any) => {
                    const slots: Slot[] = shelf.slots.map((slot: any) => ({
                        id: slot.id,
                        label: slot.label,
                        width: slot.width || 60,
                        height: slot.height || 80,
                        medName: slot.medName || null,
                        quantity: slot.quantity ?? null,
                        isCabinetOpen: slot.isCabinetOpen,
                        isLightOn: slot.isLightOn,
                        isOnline: slot.isOnline,
                        typyCabinet: slot.typyCabinet || '-',
                    }));

                    return {
                        id: shelf.id,
                        slots,
                    };
                });

                setShelves(transformed);
                console.log("✅ แปลงข้อมูลสำเร็จ:", transformed.length, "ชั้น");

            } catch (err) {
                console.error("❌ โหลดข้อมูลตู้ยาไม่สำเร็จ:", err);
            }
        };

        fetchShelves();
    }, []);

    const statusColor = (slot: Slot) => {
        if (!slot.isOnline) return 'bg-gray-300';
        if (slot.isCabinetOpen) return 'bg-red-200';
        if (slot.isLightOn) return 'bg-yellow-200';
        return 'bg-green-100';
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">📦 แสดงตู้ยา (โหมดแสดงผล)</h1>

            {shelves.map((shelf) => (
                <div key={shelf.id} className="mb-6 bg-white rounded shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold text-blue-800">🧱 ชั้นที่ {shelf.id}</h2>
                        <span className="text-sm text-gray-600">{shelf.slots.length} ช่อง</span>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {shelf.slots.map((slot) => (
                            <div
                                key={slot.id}
                                className={`border rounded flex flex-col items-center justify-center text-center px-2 py-1 ${statusColor(slot)}`}
                                style={{ width: `${slot.width}px`, height: `${slot.height}px` }}
                            >
                                <span className="font-semibold text-xs">{slot.label}</span>
                                <span className="text-[10px] truncate">{slot.medName || 'ไม่มีชื่อยา'}</span>
                                <span className="text-[10px]">
                                    {slot.quantity != null ? `คงเหลือ ${slot.quantity}` : '-'}
                                </span>
                                <span className="text-[10px] text-gray-500">{slot.typyCabinet}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
