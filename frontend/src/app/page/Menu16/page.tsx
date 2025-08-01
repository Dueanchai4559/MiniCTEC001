"use client";
import useSessionHeartbeat from "@/app/hooks/useSessionHeartbeat";
import React from "react";

export default function Menu18Page() {
  useSessionHeartbeat();
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 max-w-xl text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">🎉 สวัสดีครับ ม่อน!</h1>
        <p className="text-gray-700 text-lg">
          ยินดีต้อนรับสู่หน้าเมนู 18<br />
          ขอให้วันนี้เป็นวันที่เจ๋งสุด ๆ ไปเลยนะครับ 🚀
        </p>
      </div>
    </main>
  );
}
