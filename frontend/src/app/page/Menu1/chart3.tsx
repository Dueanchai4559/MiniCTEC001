/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { baseUrlAPI } from '@/app/ip';
import { useRouter } from 'next/navigation';

export default function StatusNowLineChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; image?: string } | null>(null);

  // เตรียม labels ครบ 24 ชั่วโมง
  const hourLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  // แยกข้อมูลช่วงเช้า/บ่าย
  const [chartDataSplit, setChartDataSplit] = useState<{
    morning: Record<string, number>;
    evening: Record<string, number>;
  }>({ morning: {}, evening: {} });

  // โหลด user
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

  // ดาวน์โหลดเป็นภาพ
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
        .replace(/:/g, '')}_${user?.name || "ผู้ใช้งาน"}_ใบสั่งยารายชั่วโมง.png`;

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
    }
  };

  // โหลดข้อมูลใบสั่งยาและจัดกลุ่ม
  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    chartInstance.current = myChart;

    async function fetchData() {
      try {
        const res = await fetch(`${baseUrlAPI}/prescriptions`);
        const data = await res.json();

        const now = new Date();
        now.setHours(now.getHours() + 7); // ปรับเป็นเวลาไทย
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        const morning: Record<string, number> = {};
        const evening: Record<string, number> = {};

        hourLabels.forEach((h, i) => {
          if (i < 12) {
            morning[h] = 0;
          } else {
            evening[h] = 0;
          }
        });

        data.forEach((item: any) => {
          const createdAt = new Date(item.createdAt || item.created_at);
          //  createdAt.setHours(createdAt.getHours() + 7); // ปรับเป็นเวลาไทย

          if (createdAt >= startOfDay && createdAt <= endOfDay) {
            const hour = createdAt.getHours();
            const slot = `${hour.toString().padStart(2, '0')}:00`;
            if (hour < 12) {
              morning[slot] = (morning[slot] || 0) + 1;
            } else {
              evening[slot] = (evening[slot] || 0) + 1;
            }
          }
        });

        setChartDataSplit({ morning, evening });
      } catch (err) {
        console.error("ดึงข้อมูลล้มเหลว:", err);
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

  // ตั้งค่า chart
  useEffect(() => {
    if (!chartInstance.current) return;

    const morningData = hourLabels.map((h, i) => (i < 12 ? chartDataSplit.morning[h] || 0 : null));
    const eveningData = hourLabels.map((h, i) => (i >= 12 ? chartDataSplit.evening[h] || 0 : null));

    const option: echarts.EChartsOption = {
      title: {
        text: "ใบสั่งยารายชั่วโมง (แบ่งเช้า/บ่าย)",
        left: "center",
        textStyle: { fontSize: 16, fontWeight: "bold" },
      },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: hourLabels,
        axisLabel: { fontSize: 10 },
      },
      yAxis: {
        type: "value",
        name: "จำนวนใบสั่งยา",
      },
      series: [
        {
          name: "ช่วงเช้า (00:00 - 11:00)",
          type: "line",
          data: morningData,
          smooth: true,
          label: { show: true },
          itemStyle: { color: "#2ecc71" },
        },
        {
          name: "ช่วงบ่าย (12:00 - 23:00)",
          type: "line",
          data: eveningData,
          smooth: true,
          label: { show: true },
          itemStyle: { color: "#e74c3c" },
        },
      ],
    };

    chartInstance.current.setOption(option);
  }, [chartDataSplit]);

  return (
    <div className="w-full">
      <div className="flex justify-end ">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          📥 ดาวน์โหลดกราฟ
        </button>
      </div>
      <div ref={chartRef} style={{ width: '100%', height: '460px' }} />
    </div>
  );
}
