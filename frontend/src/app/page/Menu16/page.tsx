/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from "react";
import { Info } from "lucide-react";
import InfoPopup from "./InfoPopup";
import PrescriptionDetailPopup from "./list";
import AddPrePopup from "./addPre";
import { baseUrlAPI } from "@/app/ip";
import type { Prescription } from "./prescriptionTypes";

export default function Menu0Page() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [sortedBy, setSortedBy] = useState<keyof Prescription>('createdAt');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<{
    name?: string;
    profileImage?: string;
    image?: string;
  } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    if (raw) {
      const auth = JSON.parse(raw);
      const currentUser = auth?.user;
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    let buffer = "";
    let timeout: NodeJS.Timeout;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setSearchTerm(buffer);
        buffer = "";
        return;
      }
      if (e.key.length === 1) {
        buffer += e.key;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          buffer = "";
        }, 500);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);


  useEffect(() => {
    fetch(`${baseUrlAPI}/prescriptions`)
      .then((res) => res.json())
      .then((data) => setPrescriptions(data));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`${baseUrlAPI}/PrescriptionById/${selectedId}`)

      .then(res => res.json())
      .then(data => setSelectedData(data))
      .catch(() => setSelectedData(null));
  }, [selectedId]);

  useEffect(() => {
    const fetchData = () => {
      if (document.visibilityState === "visible") {
        fetch(`${baseUrlAPI}/prescriptions`)
          .then((res) => res.json())
          .then((data) => setPrescriptions(data));
      }
    };
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClear = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (document.visibilityState === "visible") {
        try {
          const res = await fetch(`${baseUrlAPI}/prescriptions`);
          const newData = await res.json();
          const oldDataString = JSON.stringify(prescriptions);
          const newDataString = JSON.stringify(newData);
          if (oldDataString !== newDataString) {
            setPrescriptions(newData);
          }
        } catch (err) {
          console.error("Fetch failed", err);
        }
      }
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [prescriptions]);

  const filteredData = Array.isArray(prescriptions)
    ? prescriptions.filter((item) => {
      const term = searchTerm.toLowerCase();
      const isToday = (() => {
        if (!item.createdAt) return false;
        const createdDate = new Date(item.createdAt);
        const now = new Date();
        return (
          createdDate.getDate() === now.getDate() &&
          createdDate.getMonth() === now.getMonth() &&
          createdDate.getFullYear() === now.getFullYear()
        );
      })();
      return (
        isToday &&
        item.statusnow1 === "2" &&
        (
          item.number?.toLowerCase().includes(term) ||
          item.queNum?.toLowerCase().includes(term) ||
          item.hnCode?.toLowerCase().includes(term) ||
          item.anCode?.toLowerCase().includes(term) ||
          item.name?.toLowerCase().includes(term)
        )
      );
    })
    : [];

  const sortedData = [...filteredData]
    .sort((a, b) => {
      // 1. เรียงตามเวลา (createdAt) ก่อน
      const timeA = new Date(a.createdAt ?? "").getTime();
      const timeB = new Date(b.createdAt ?? "").getTime();
      return sortAsc ? timeA - timeB : timeB - timeA;
    })
    .sort((a, b) => {
      // 2. ดึง 'ด่วน' ขึ้นบนสุด
      const urgentA = a.Urgent?.toLowerCase().trim() === "yes";
      const urgentB = b.Urgent?.toLowerCase().trim() === "yes";
      if (urgentA && !urgentB) return -1;
      if (!urgentA && urgentB) return 1;
      return 0;
    });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const getStatusText = (status?: string) => {
    switch (status) {
      case "1": return "กำลังคัดแยก";
      case "2": return "กำลังจัดยา";
      case "3": return "รอตรวจสอบ";
      case "4": return "ตรวจสอบสำเร็จ";
      case "5": return "จ่ายยาสำเร็จ";
      case "6": return "ยกเลิก";
      case "7": return "ลบทิ้ง";
      case "8": return "พักยานอกตู้";
      case "9": return "จัดใหม่";
      case "10": return "พักยาในตู้";
      default: return "-";
    }
  };

  const headers: {
    key: keyof Prescription | "index" | "Urgent" | "label" | "print" | "print2";
    label: string;
    width?: string;
  }[] = [
      { key: "index", label: "ลำดับ", width: "w-16" },
      { key: "number", label: "เลขใบสั่งยา", width: "w-28" },
      { key: "queNum", label: "Queue", width: "w-20" },
      { key: "hnCode", label: "HN", width: "w-24" },
      { key: "anCode", label: "AN", width: "w-24" },
      { key: "name", label: "ชื่อผู้ป่วย", width: "w-60" },
      // { key: "statusnow1", label: "สถานะ", width: "w-24" },
      { key: "Urgent", label: "ด่วน", width: "w-16" },
      { key: "createdAt", label: "วันที่", width: "w-36" },
      { key: "print2", label: "ฉลากยา", width: "w-28" },
      { key: "print", label: "ใบสั่งยา", width: "w-28" },
    ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="relative flex items-center gap-2  ">
        <h1 className="text-2xl font-bold p-4">รายการจัดยา</h1>
        <button
          ref={buttonRef}
          onClick={() => setShowPopup(!showPopup)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Info size={20} />
        </button>
        {showPopup && (
          <InfoPopup ref={popupRef} className="top-full left-0" />
        )}
      </div>
      {/* ปุ่มและช่องค้นหา */}
      <div className="flex justify-between items-center px-2 py-2 bg-white rounded-t-md shadow-sm">
        <div className="flex justify-between items-center gap-2 px-2 py-2 bg-white rounded-t-md shadow-sm">
          <input
            ref={inputRef}
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-80 focus:outline-none focus:ring-0 caret-transparent"
          />
          <button
            onClick={handleClear}
            className="px-3 py-1.5 text-sm rounded bg-gray-400 text-white hover:bg-gray-500"
          >
            ล้าง
          </button>
        </div>
        {/*
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddPopup(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            เพิ่มใบสั่งยา
          </button>
        </div> */}
      </div>

      {showAddPopup && (
        <div className="absolute inset-0 z-50 flex justify-center items-start pt-24   bg-opacity-30">
          {/* คลิกด้านหลังไม่ได้ */}
          <div
            className="absolute inset-0"
            onClick={(e) => e.stopPropagation()}
          />
          <AddPrePopup onClose={() => setShowAddPopup(false)} />
        </div>
      )}
      <div className={`${pageSize > 10 ? "max-h-[600px] overflow-y-auto" : ""}`}>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-center text-sm">
              {headers.map((col) => (
                <th
                  key={col.key}
                  className={`border border-gray-300 p-2 cursor-pointer hover:bg-gray-200 ${col.width}`}
                  onClick={() => {
                    if (["index", "Urgent", "print2", "print"].includes(col.key as string)) return;
                    setSortedBy(col.key as keyof Prescription);
                    setSortAsc(sortedBy === col.key ? !sortAsc : true);
                  }}
                >
                  {col.label}
                  {sortedBy === col.key ? (sortAsc ? " ▲" : " ▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={item.id}
                className={`text-center text-sm cursor-pointer hover:bg-blue-50 ${item.Urgent?.toString().trim().toLowerCase() === "yes" ? "bg-red-100  font-semibold" : ""
                  }`}
                onClick={() => {
                  setSelectedId(item.id);
                  fetch(`${baseUrlAPI}/PrescriptionById/${item.id}`)
                    .then(res => res.json())
                    .then(data => setSelectedData(data));
                }}
              >
                {headers.map((col) => {
                  const key = col.key;
                  if (key === "index") {
                    return <td key={key} className="border p-2">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                  }
                  if (key === "Urgent") {
                    return (
                      <td key={key} className="border p-2 text-center">
                        {item.Urgent?.toString().trim().toLowerCase() === "yes" ? "🚨" : ""}
                      </td>
                    );
                  }
                  if (key === "print2") {
                    return (
                      <td key={key} className="border p-2">
                        <button
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = `/Menu0/print2?id=${item.id}&userName=${encodeURIComponent(user?.name || 'ไม่ทราบชื่อ')}`;
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';
                            iframe.src = url;
                            document.body.appendChild(iframe);
                            setTimeout(() => document.body.removeChild(iframe), 15000);
                          }}
                        >
                          ฉลากยา
                        </button>
                      </td>
                    );
                  }

                  if (key === "print") {
                    return (
                      <td key={key} className="border p-2">
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = `/Menu0/print?id=${item.id}&userName=${encodeURIComponent(user?.name || 'ไม่ทราบชื่อ')}`;
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';
                            iframe.src = url;
                            document.body.appendChild(iframe);
                            setTimeout(() => document.body.removeChild(iframe), 15000);
                          }}
                        >
                          ใบสั่งยา
                        </button>
                      </td>
                    );
                  }

                  if (key === "statusnow1") {
                    return (
                      <td key={key} className="border p-2">
                        {getStatusText(item.statusnow1)}
                      </td>
                    );
                  }

                  if (key === "createdAt") {
                    return (
                      <td key={key} className="border p-2">
                        {new Date(item.createdAt).toLocaleString("th-TH", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    );
                  }

                  return (
                    <td key={key} className="border p-2 whitespace-nowrap text-left">
                      {item[key as keyof Prescription]?.toString() ?? "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
            {[...Array(pageSize - paginatedData.length)].map((_, i) => (
              <tr key={`empty-${i}`} className="h-10">
                {headers.map((col) => (
                  <td key={col.key} className="border p-2">&nbsp;</td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <button
          className="px-3 py-1 border rounded"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          ก่อนหน้า
        </button>
        <span>
          หน้า {currentPage} / {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          ถัดไป
        </button>
        <div className="mt-4 flex items-center space-x-2">
          <label>แสดง:</label>
          {[10, 20, 30, 50, 100].map((size) => (
            <button
              key={size}
              className={`px-3 py-1 border rounded ${pageSize === size ? "bg-blue-500 text-white" : "bg-white"}`}
              onClick={() => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      {selectedId && selectedData && (
        <PrescriptionDetailPopup
          id={selectedId}
          data={selectedData}
          onClose={() => {
            setSelectedId(null);
            setSelectedData(null);
          }}
        />
      )}

    </div>
  );
}
