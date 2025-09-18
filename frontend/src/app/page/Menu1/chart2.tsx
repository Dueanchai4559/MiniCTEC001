/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { baseUrlAPI } from '@/app/ip';
import { useRouter } from 'next/navigation';

export default function StatusNowBarChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; image?: string } | null>(null);
  const [statusDataByDay, setStatusDataByDay] = useState<Record<string, Record<string, number>>>({});

  const statusMap = [
    { statusnow1: '1', label: 'กำลังคัดแยก', color: '#808080' },
    { statusnow1: '2', label: 'กำลังจัดยา', color: '#9C27B0' },
    { statusnow1: '3', label: 'รอตรวจสอบ', color: '#1890FF' },
    { statusnow1: '4', label: 'ตรวจสอบสำเร็จ', color: '#FF85C0' },
    { statusnow1: '5', label: 'จ่ายยาสำเร็จ', color: '#73D13D' },
    { statusnow1: '6', label: 'ยกเลิก', color: '#FFA940' },
    { statusnow1: '7', label: 'ลบทิ้ง', color: '#FF4D4F' },
    { statusnow1: '8', label: 'พักตะกร้า', color: '#FFD666' },
    { statusnow1: '9', label: 'จัดใหม่', color: '#40A9FF' },
    { statusnow1: '10', label: 'พักตะกร้าใน', color: '#40ffd9' },
  ];

  const daysOfWeek = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];

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
        .replace(/:/g, '')}_${user?.name || "ผู้ใช้งาน"}"ใบสั่งยาทั้งหมดรายสัปดาห์".png`;

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
    }
  };

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    chartInstance.current = myChart;

    async function fetchData() {
      try {
        const res = await fetch(`${baseUrlAPI}/prescriptions`);
        const data = await res.json();

        const grouped: Record<string, Record<string, number>> = {};
        for (const day of daysOfWeek) {
          grouped[day] = {};
        }

        const now = new Date();

        // ✅ หาวันเริ่มต้นสัปดาห์ (วันอาทิตย์)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // ✅ หาวันสิ้นสุดสัปดาห์ (วันเสาร์)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        data.forEach((item: any) => {
          const status = item.statusnow1;
          const createdAt = item.createdAt || item.created_at;
          if (!status || !createdAt) return;

          // ✅ ตรวจว่า status มีใน statusMap
          const validStatus = statusMap.find((s) => s.statusnow1 === status);
          if (!validStatus) return;

          // ✅ แปลงเวลาตาม TimeZone ไทย
          const localDate = new Date(
            new Date(createdAt).toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
          );

          // ✅ ข้ามข้อมูลที่ไม่อยู่ใน "สัปดาห์นี้"
          if (localDate < startOfWeek || localDate > endOfWeek) return;

          const dayIndex = localDate.getDay();
          const day = daysOfWeek[dayIndex];

          grouped[day][status] = (grouped[day][status] || 0) + 1;
        });

        setStatusDataByDay(grouped);
      } catch (err) {
        console.error(" ดึงข้อมูลล้มเหลว:", err);
      }
    }


    fetchData();

    const resize = () => myChart.resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      myChart.dispose();
    };
  }, []);
  // รวมยอดแต่ละสถานะทั้งหมด
  const statusTotals: { status: typeof statusMap[0]; total: number }[] = statusMap.map((status) => {
    const total = daysOfWeek.reduce((sum, day) => {
      return sum + (statusDataByDay[day]?.[status.statusnow1] || 0);
    }, 0);
    return { status, total };
  });

  // ✅ เรียงจากน้อย → มาก เพื่อวางจาก "ล่างสุด" → "บนสุด" ในแท่ง
  const sortedStatus = statusTotals
    .filter((s) => s.total > 0)
    .sort((a, b) => a.total - b.total)
    .map((s) => s.status);

  // เตรียม series และ legend ใหม่
  const seriesData: echarts.SeriesOption[] = [];
  const legendDataSorted: string[] = [];

  sortedStatus.forEach((status) => {
    const data = daysOfWeek.map((day) => statusDataByDay[day]?.[status.statusnow1] || 0);
    seriesData.push({
      name: status.label,
      type: 'bar',
      stack: 'total',
      label: { show: true },
      emphasis: { focus: 'series' },
      itemStyle: { color: status.color },
      data,
    });
    const total = data.reduce((sum, val) => sum + val, 0);
    legendDataSorted.push(`${status.label} (${total} รายการ)`);
  });

  useEffect(() => {
    if (!chartInstance.current) return;

    // รวมจำนวนทั้งหมดต่อวัน
    const totalPerDay = daysOfWeek.map((day) => {
      const statusCounts = statusDataByDay[day] || {};
      return Object.values(statusCounts).reduce((sum, val) => sum + val, 0);
    });

    const maxValue = Math.max(...totalPerDay);

    const detailedPerDay = daysOfWeek.map((day) => {
      const statusCounts = statusDataByDay[day] || {};
      const details: string[] = [];

      statusMap.forEach((status) => {
        const count = statusCounts[status.statusnow1] || 0;
        if (count > 0) {
          details.push(`${status.label}: ${count} รายการ`);
        }
      });

      return details.join('<br/>');
    });

    const barData = totalPerDay.map((value, index) => ({
      value,
      itemStyle: {
        color: value === maxValue ? '#FF4D4F' : '#1890FF',
      },
    }));

    const option: echarts.EChartsOption = {
      title: {
        text: 'ใบสั่งยาทั้งหมดรายสัปดาห์',
        left: 'center',
        textStyle: { fontSize: 20, fontWeight: 'bold' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (params: any) {
          const index = params[0].dataIndex;
          const total = params[0].value;
          const detail = detailedPerDay[index];
          return `<b>${params[0].axisValue}</b><br/>รวม: ${total} รายการ<br/><br/>${detail}`;
        },
      },
      grid: {
        top: 40,
        bottom: 40,
        left: '3%',
        right: '4%',
        containLabel: true,
      },

      xAxis: {
        type: 'category',
        data: daysOfWeek,
        axisLabel: { fontSize: 14 },
      },
      yAxis: {
        type: 'value',
        name: 'จำนวนใบสั่งยา',
      },
      series: [
        {
          name: 'รวมสถานะ',
          type: 'bar',
          data: barData,
          label: {
            show: true,
            position: 'top',
          },
        },
      ],
    };

    chartInstance.current.setOption(option);
  }, [statusDataByDay]);


  return (
    <div className="w-full">
      <div className="flex justify-end mb-2 pr-4">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          📥 ดาวน์โหลดกราฟ
        </button>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
}
