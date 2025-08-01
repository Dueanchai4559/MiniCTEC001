'use client';

import { useEffect, useState } from 'react';
import MedicineCabinetView from './MedicineCabinetView';
import MedicineCabinetEditor from './MedicineCabinetEditor';
import { baseUrlAPI } from '@/app/ip'; // << ใช้อันนี้

interface Slot {
    id: number;
    width: number;
    height: number;
    label: string;
}

interface Shelf {
    id: number;
    slots: Slot[];
}

export default function CabinetPage() {
    const [editMode, setEditMode] = useState(false);
    const [shelves, setShelves] = useState<Shelf[]>([]);

    useEffect(() => {
        const fetchShelves = async () => {
            try {
                const res = await fetch(`${baseUrlAPI}/cabinets`);
                const data = await res.json();
                setShelves(data);
            } catch (error) {
                console.error('❌ โหลดข้อมูลตู้ยาไม่สำเร็จ:', error);
            }
        };

        fetchShelves();
    }, []);

    return (
        <div className="p-4">
            <button
                onClick={() => setEditMode(!editMode)}
                className="mb-4 bg-yellow-500 text-white px-4 py-1 rounded"
            >
                {editMode ? '🔒 โหมดแสดงผล' : '✏️ โหมดแก้ไข'}
            </button>

            {editMode ? (
                <MedicineCabinetEditor />
            ) : (
                <MedicineCabinetView shelves={shelves} />
            )}
        </div>
    );
}
