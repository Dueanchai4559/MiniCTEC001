/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import { baseUrlAPI } from '@/app/ip';

type User = {
  id: number;
  name: string;
  role: string;
  team: string;
  statusWork: "0" | "1" | "2" | "3" | "4";
  statusTime?: string;
  email: string;
  image?: string;
};

const statusMap: Record<string, { icon: string; label: string; color: string }> = {
  "0": { icon: "-", label: "-", color: "" },
  "1": { icon: "🟢", label: "ออนไลน์", color: "bg-green-100 text-green-800" },
  "2": { icon: "🔴", label: "ออฟไลน์", color: "bg-gray-200 text-gray-600" },
  "3": { icon: "🚫", label: "บล็อค", color: "bg-yellow-100 text-yellow-800" },
  "4": { icon: "🗑️", label: "ลบทิ้ง", color: "bg-red-100 text-red-800" },
};

const columns: ColumnDef<User>[] = [
  {
    id: "image",
    header: "",
    size: 250,
    cell: ({ row }: { row: Row<User> }) => (
      <div className="w-8 h-8 rounded-full overflow-hidden border">
        {row.original.image ? (
          <img src={row.original.image} alt="profile" className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            ?
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 250,
    cell: ({ row }: { row: Row<User> }) => (
      <div className="min-w-[100px]">
        {row.original.name ? (
          <>
            <p className="font-semibold">{row.original.name}</p>
            <p className="text-sm text-gray-500">{row.original.email}</p>
          </>
        ) : (
          <p className="text-gray-400 italic">-</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role / Team",
    size: 200,
    cell: ({ row }: { row: Row<User> }) => (
      <div className="text-sm">
        {row.original.role || "-"}
        <br />
        <span className="text-gray-500">{row.original.team || "-"}</span>
      </div>
    ),
  },
  {
    accessorKey: "statusWork",
    header: "สถานะ",
    size: 120,
    cell: ({ row }: { row: Row<User> }) => {
      const statusWork = statusMap[row.original.statusWork];
      return statusWork ? (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${statusWork.color}`}
        >
          <span>{statusWork.icon}</span> {statusWork.label}
        </span>
      ) : (
        <span className="text-gray-500 text-xs">-</span>
      );
    },
  },
  {
    accessorKey: "statusTime",
    header: "เวลาใช้งาน",
    size: 150,
    cell: ({ row }: { row: Row<User> }) => (
      <span className="text-sm text-gray-600">
        {row.original.statusTime
          ? formatTimeAgoTH(row.original.statusTime)
          : "-"}
      </span>
    ),
  },
];

function formatTimeAgoTH(isoTime: string): string {
  const now = new Date();
  const then = new Date(isoTime);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  const units: { unit: Intl.RelativeTimeFormatUnit, seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  const rtf = new Intl.RelativeTimeFormat("th", { numeric: "auto" });

  for (const { unit, seconds } of units) {
    const delta = Math.floor(diffInSeconds / seconds);
    if (delta >= 1) {
      return rtf.format(-delta, unit);
    }
  }
  return "ไม่กี่วินาทีที่แล้ว";
}

export default function UserTable() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseUrlAPI}/users`);
        const users: User[] = await response.json();

        // เตรียมหน้าปัจจุบัน 7 แถว)
        const firstPage = users.slice(0, 7);

        // ถ้าน้อยกว่า7 เติม row ว่าง
        if (firstPage.length < 7) {
          const missing = 7 - firstPage.length;
          for (let i = 0; i < missing; i++) {
            firstPage.push({
              id: -i - 1,
              name: "",
              role: "",
              team: "",
              statusWork: "0",
              email: "",
              image: undefined,
            });
          }
        }
        setData(firstPage);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const table = useReactTable<User>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        รายชื่อผู้ใช้งานทั้งหมด
      </h2>
      {loading ? (
        <div className="text-center text-gray-500 py-10">
          ⏳ กำลังโหลดข้อมูลผู้ใช้งาน...
        </div>
      ) : (
        <>
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200 shadow-sm rounded-md overflow-hidden">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-r border-gray-200"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              หน้าที่ {table.getState().pagination.pageIndex + 1} จาก {table.getPageCount()}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                ◀️ ก่อนหน้า
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                ถัดไป ▶️
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
