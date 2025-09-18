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
        const res = await fetch(`${baseUrlAPI}/prescriptions`);
        const data = await res.json();

        const usedPrescriptions = data.filter((item: any) => item.statusnow1 === "5");

        const usedMeds = usedPrescriptions.flatMap((p: any) =>
          p.medicationHospitals
            .filter((mh: any) => mh.medication)
            .map((mh: any) => ({
              medCode: mh.medication.medCode,
              medNameTH: mh.medication.medNameTH,
              medNameEN: mh.medication.medNameEN,
              package: mh.medication.package,
              image1: mh.medication.image1,
              patientName: p.name,
              hnCode: p.hnCode,
              usedDate: p.status4Time || p.updatedAt,
            }))
        );

        setData(usedMeds);
      } catch (err) {
        console.error(" โหลดข้อมูลใบสั่งยาผิดพลาด:", err);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.medNameTH?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.medNameEN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.medCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.package?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    const now = new Date();
    const fileName = `${now.toISOString().slice(0, 10).replace(/-/g, '')}_${now
      .toTimeString()
      .slice(0, 5)
      .replace(/:/g, '')}_${user?.name || "ผู้ใช้งาน"}_รายการข้อมูลที่ใช้.csv`;

    const headers = ["ลำดับ", "รหัสยา", "ชื่อยา (TH)", "ชื่อยา (EN)", "package", "ชื่อผู้ป่วย", "วันที่จ่ายยา"];
    const rows = filteredData.map((item, index) => [
      index + 1,
      item.medCode,
      item.medNameTH,
      item.medNameEN,
      item.package,
      item.patientName,
      item.usedDate ? new Date(item.usedDate).toLocaleString("th-TH") : "-",
    ]);

    const csvContent =
      "\uFEFF" +
      [headers, ...rows]
        .map((e) => e.map((v) => `"${v || "-"}` + `"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <span role="img" aria-label="icon">📦</span>
        รายการข้อมูลยาที่ใช้
        <span className="text-sm font-medium text-gray-600 ml-2">
          ({filteredData.length} รายการ)
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
                <th className="px-4 py-2 border">ชื่อยา (TH)</th>
                <th className="px-4 py-2 border">ชื่อยา (EN)</th>
                <th className="px-4 py-2 border">package</th>
                <th className="px-4 py-2 border">ชื่อผู้ป่วย</th>
                <th className="px-4 py-2 border">วันที่จ่ายยา</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center px-4 py-6 text-gray-500">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50 transition-colors duration-100">
                    <td className="px-4 py-2 border">{item.medCode || "-"}</td>
                    <td
                      className="px-4 py-2 border"
                      onMouseEnter={() => setPreviewImage(item.image1)}
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
                    <td className="px-4 py-2 border">{item.medNameTH || "-"}</td>
                    <td className="px-4 py-2 border">{item.medNameEN || "-"}</td>
                    <td className="px-4 py-2 border">{item.package || "-"}</td>
                    <td className="px-4 py-2 border">{item.patientName || "-"}</td>
                    <td className="px-4 py-2 border">
                      {item.usedDate ? new Date(item.usedDate).toLocaleString("th-TH") : "-"}
                    </td>

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
