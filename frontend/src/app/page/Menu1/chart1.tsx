/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { baseUrlAPI } from '@/app/ip';
import { useRouter } from "next/navigation";

export default function StatusNowPieChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; image?: string } | null>(
    null
  );
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [visibleStatus, setVisibleStatus] = useState<string[]>([]); // <-- สำหรับ toggle
  const statusMap = [
    { statusnow1: '1', label: 'กำลังคัดแยก', color: '#17a2b8' },     // ฟ้าเทอร์ควอยซ์
    { statusnow1: '2', label: 'กำลังจัดยา', color: '#673ab7' },      // ม่วงเข้ม
    { statusnow1: '3', label: 'รอตรวจสอบ', color: '#007bff' },      // ฟ้าน้ำเงิน
    { statusnow1: '4', label: 'ตรวจสอบสำเร็จ', color: '#e83e8c' },  // ชมพูสด
    { statusnow1: '5', label: 'จ่ายยาสำเร็จ', color: '#28a745' },    // เขียว
    { statusnow1: '6', label: 'ยกเลิก', color: '#fd7e14' },          // ส้ม
    { statusnow1: '7', label: 'ลบทิ้ง', color: '#dc3545' },          // แดง
    { statusnow1: '8', label: 'พักตะกร้านอก', color: '#ffc107' },   // เหลืองเข้ม
    { statusnow1: '9', label: 'จัดใหม่', color: '#20c997' },         // เขียวมิ้นท์
    { statusnow1: '10', label: 'พักตะกร้าใน', color: '#6610f2' }    // ม่วงสด
  ];

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

  const handleDownload = () => {
    if (chartInstance.current) {
      const url = chartInstance.current.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff',
      });

      const now = new Date();
      const fileName = `${now.toISOString().slice(0, 10).replace(/-/g, '')}_${now
        .toTimeString()
        .slice(0, 5)
        .replace(/:/g, '')}_${user?.name || "ผู้ใช้งาน"}"สถานะของใบสั่งยา".png`;

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
    }
  };

  const toggleStatus = (statusId: string) => {
    setVisibleStatus((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    chartInstance.current = myChart;

    async function fetchAndRender() {
      try {
        const res = await fetch(`${baseUrlAPI}/prescriptions`);
        const data = await res.json();

        // สร้างช่วงเวลาเริ่ม-สิ้นสุดของ "วันนี้" ตามเวลาไทย
        // สร้างช่วงเวลา 24 ชั่วโมงย้อนหลัง
        const now = new Date();
        now.setHours(now.getHours() + 7); // timezone ไทย

        const endTime = new Date(now);
        const startTime = new Date(now);
        startTime.setHours(startTime.getHours() - 24);

        const statusCountMap: Record<string, number> = {};

        data.forEach((item: any) => {
          const createdAt = item.createdAt ? new Date(item.createdAt) : null;
          if (createdAt) {
            createdAt.setHours(createdAt.getHours() + 7); // timezone ไทย
            if (createdAt >= startTime && createdAt <= endTime) {
              const status = item.statusnow1;
              if (status) {
                statusCountMap[status] = (statusCountMap[status] || 0) + 1;
              }
            }
          }
        });
        setStatusCounts(statusCountMap);
        setVisibleStatus(statusMap.map((s) => s.statusnow1));
      } catch (error) {
        console.error('ดึงข้อมูลล้มเหลว:', error);
      }
    }


    fetchAndRender();

    const resize = () => myChart.resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      myChart.dispose();
    };
  }, []);
  useEffect(() => {
    if (!chartInstance.current) return;

    const preparedData = statusMap
      .filter((s) => visibleStatus.includes(s.statusnow1))
      .map((s) => ({
        name: s.label,
        value: statusCounts[s.statusnow1] || 0,
        itemStyle: { color: s.color }
      }));

    const option: echarts.EChartsOption = {
      title: {
        text: 'สถานะของใบสั่งยา',
        left: 'center',
        textStyle: {
          fontSize: 24,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} รายการ ({d}%)',
        textStyle: {
          fontSize: 14
        }
      },
      legend: { show: false },
      series: [
        {
          name: 'สถานะ',
          type: 'pie',
          radius: ['10%', '50%'],
          center: ['50%', '50%'],
          data: preparedData,
          label: {
            formatter: '{b}\n{c} รายการ ({d}%)',
            fontSize: 12,
            fontWeight: 'bold'
          },
          labelLine: {
            length: 10,
            length2: 10
          },
          emphasis: {
            scale: true,
            scaleSize: 12,
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              borderWidth: 2,
              borderColor: '#fff'
            }
          }
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [visibleStatus, statusCounts]);

  return (
    <div className="flex w-full h-[500px]">
      {/* ซ้าย: รายการ + ปุ่ม */}
      <div className="w-1/2 flex flex-col justify-between p-4">
        <div className="space-y-2 text-left text-lg text-gray-700">
          <div className="pt-4">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              📥 ดาวน์โหลดกราฟ
            </button>
          </div>
        </div>

        {statusMap.map((s) => {
          const count = statusCounts[s.statusnow1] || 0;
          const isVisible = visibleStatus.includes(s.statusnow1);
          return (
            <div
              key={s.statusnow1}
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => toggleStatus(s.statusnow1)}
            >
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{
                  backgroundColor: isVisible ? s.color : '#ccc',
                  opacity: isVisible ? 1 : 0.4
                }}
              />
              <span className={isVisible ? '' : 'line-through text-gray-400'}>
                {s.label} ({count} รายการ)
              </span>
            </div>
          );
        })}
        <div className="font-bold text-xl">
          รวมทั้งหมด: {Object.values(statusCounts).reduce((sum, val) => sum + val, 0)} รายการ
        </div>
      </div>


      {/* ขวา: กราฟ */}
      <div className="w-1/2 flex items-center justify-center">
        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
