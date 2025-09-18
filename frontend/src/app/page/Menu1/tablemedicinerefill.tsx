/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { baseUrlAPI } from '@/app/ip';
import { useRouter } from "next/navigation";

export default function MedicineCabinetTable() {
  const [data, setData] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    try {
      if (raw) {
        const auth = JSON.parse(raw);
        const currentUser = auth?.user;
        setUser(currentUser);
      }
    } catch {
      localStorage.removeItem("authUser");
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrlAPI}/cabinet`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("ไม่สามารถโหลดข้อมูลยา:", err);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.statusCabi === "active" &&
      (
        item.medName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.barCode1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.barCode2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.medCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unit?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // เพิ่มฟังก์ชันจัดเรียงแบบผสม: จำนวน + วันหมดอายุ
  function getMinExpiryDays(item: any): number {
    const today = new Date();
    const getDays = (dateStr: string) =>
      dateStr ? Math.ceil((new Date(dateStr).getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)) : Infinity;
    return Math.min(getDays(item.expMed1), getDays(item.expMed2));
  }

  const sortedData = [...filteredData].sort((a, b) => {
    const scoreA = getUrgencyScore(a);
    const scoreB = getUrgencyScore(b);

    if (scoreA !== scoreB) return scoreA - scoreB;

    // ถ้าเร่งด่วนเท่ากัน → เรียงต่อจากจำนวน และวันหมดอายุ
    const qtyA = a.quantity ?? Infinity;
    const qtyB = b.quantity ?? Infinity;
    if (qtyA !== qtyB) return qtyA - qtyB;

    const expA = getMinExpiryDays(a);
    const expB = getMinExpiryDays(b);
    return expA - expB;
  });

  const handleDownload = () => {
    const now = new Date();
    const fileName = `${now.toISOString().slice(0, 10).replace(/-/g, '')}_${now
      .toTimeString()
      .slice(0, 5)
      .replace(/:/g, '')}_${user?.name || "ผู้ใช้งาน"}_รายการข้อมูลยาในตู้.csv`;

    const headers = [
      "ลำดับ", "รหัสยา", "ชื่อยา", "จำนวน",
      "ล็อต1", "วันหมดอายุ1", "ล็อต2", "วันหมดอายุ2",
      "บาร์โค้ด1", "บาร์โค้ด2", "ค่าสูงสุด", "ค่าต่ำสุด"
    ];

    const rows = filteredData
      .sort((a, b) => getMinExpiryDays(a) - getMinExpiryDays(b))
      .map((item, index) => [
        index + 1,
        item.medCode || "-",
        item.medName || "-",
        item.quantity ?? "-",
        item.lotNum1 || "-",
        item.expMed1 || "-",
        item.lotNum2 || "-",
        item.expMed2 || "-",
        item.barCode1 || "-",
        item.barCode2 || "-",
        item.maxValue ?? "-",
        item.minValue ?? "-",
      ]);


    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((e) => e.map((v) => `"${v}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function formatExpiryDate(dateStr?: string) {
    if (!dateStr) return "-";
    const today = new Date();
    const expDate = new Date(dateStr);
    const diffTime = expDate.getTime() - today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const day = String(expDate.getDate()).padStart(2, "0");
    const month = String(expDate.getMonth() + 1).padStart(2, "0");
    const year = expDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    let label = "";
    if (diffDays === 0) label = "(วันนี้)";
    else if (diffDays === 1) label = "(พรุ่งนี้)";
    else if (diffDays === -1) label = "(เมื่อวาน)";
    else if (diffDays > 1) label = `(อีก ${diffDays} วัน)`;
    else label = `(${Math.abs(diffDays)} วัน)`;

    let colorClass = "";
    if (diffDays < 0) {
      colorClass = "text-red-600 font-semibold";
    } else if (diffDays === 0) {
      colorClass = "text-red-700 font-bold";
    } else if (diffDays <= 7) {
      colorClass = "text-orange-500 font-semibold";
    }

    return (
      <div className={colorClass}>
        {formattedDate}
        <br />
        {label}
      </div>
    );
  }

  function getUrgencyScore(item: any): number {
    const today = new Date();
    const getDays = (dateStr: string) =>
      dateStr ? Math.ceil((new Date(dateStr).getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)) : Infinity;
    const minExpiry = Math.min(getDays(item.expMed1), getDays(item.expMed2));

    const qty = item.quantity ?? Infinity;
    const min = item.minValue ?? 0;

    if (qty === 0) return 0; // หมด
    if (qty < min) return 1; // ใกล้หมด
    if (minExpiry < 0) return 2; // หมดอายุแล้ว
    if (minExpiry <= 7) return 3; // ใกล้หมดอายุใน 7 วัน
    return 4; // ปกติ
  }

  return (
    <div className="relative overflow-auto">
      {/* แสดงรูปขยาย (คงที่บนขวาของหน้าจอเสมอ) */}
      {previewImage && (
        <div
          className="fixed top-4 right-4 bg-white p-2 rounded shadow-lg border z-50"
          style={{ width: '270px', height: '270px' }} // คงที่แน่นอน
        >
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span role="img" aria-label="icon">🗃️</span>
        รายการข้อมูลยาในตู้
        <span className="text-base font-normal text-gray-600 ml-2">
          ({sortedData.length} รายการ)
        </span>
      </h2>

      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="🔍 ค้นหาชื่อยา"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md w-full max-w-sm"
        />
        <button
          onClick={() => setSearchTerm("")}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md"
        >
          ล้าง
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          📥 ดาวน์โหลด
        </button>

      </div>

      <div className="rounded-xl border border-gray-300 overflow-hidden shadow-lg bg-white">
        <div className="max-h-[420px] overflow-y-auto">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-50 sticky top-0 z-10 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-2 border">รหัสยา</th>
                <th className="px-4 py-2 border">รูป</th>
                <th className="px-4 py-2 border">ชื่อยา</th>
                <th className="px-4 py-2 border">จำนวน</th>
                <th className="px-4 py-2 border">หมดอายุ1</th>
                <th className="px-4 py-2 border">หมดอายุ2</th>
                <th className="px-4 py-2 border">กลุ่มตู้ยา</th>
                <th className="px-4 py-2 border">ช่องยา</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={14} className="text-center px-4 py-6 text-gray-500">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-colors duration-100">
                    <td className="px-4 py-2 border">{item.medCode || "-"}</td>
                    <td
                      className="px-4 py-2 border"
                      onMouseEnter={() => setPreviewImage(item.image1 ?? null)}
                      onMouseLeave={() => setPreviewImage(null)}
                    >
                      {item.image1 ? (
                        <img
                          src={item.image1}
                          alt="รูปยา"
                          className="w-10 h-10 object-contain rounded hover:scale-110 transition"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2 border">{item.medName || "-"}</td>
                    <td
                      className={`text-center border ${item.quantity === 0
                        ? "text-red-600 font-semibold"
                        : item.minValue != null && item.quantity < item.minValue
                          ? "text-orange-500 font-semibold"
                          : ""
                        }`}
                    >
                      {item.quantity ?? "-"}
                    </td>
                    <td className="px-4 py-2 border">{formatExpiryDate(item.expMed1)}</td>
                    <td className="px-4 py-2 border">{formatExpiryDate(item.expMed2)}</td>
                    <td className="px-4 py-2 border">{item.cabinetName || "-"}</td>
                    <td className="px-4 py-2 border">{item.boxcabinetName || "-"}</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
