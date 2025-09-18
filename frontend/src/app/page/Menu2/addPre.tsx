/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { baseUrlAPI, baseUrlAPI2 } from "@/app/ip";
export default function AddPrePopup({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    number: "",
    queNum: "",
    hnCode: "",
    anCode: "",
    name: "",
    gender: "",
    dob: "",
    age: "",
    cid: "",
    heartRate: "",
    weight: "",
    height: "",
    bmi: "",
    allprescrip: "",
    diagnosis: "",
    chronicDisease: "",
    drugAllergy: "",
    rightType: "",
    patientType: "",
    doctor: "",
    department: "",
    checkedBy: "",
    statusnow1: "",
    userstatus1: "",
  });

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    const auth = JSON.parse(raw || "null");
    setUser(auth?.user ?? null);
  }, []);

  useEffect(() => {
    const weight = parseFloat(form.weight);
    const heightCM = parseFloat(form.height);
    if (weight > 0 && heightCM > 0) {
      const heightM = heightCM / 100;
      const bmi = weight / (heightM * heightM);
      setForm((f) => ({ ...f, bmi: bmi.toFixed(2) }));
    } else {
      setForm((f) => ({ ...f, bmi: "" }));
    }
  }, [form.weight, form.height]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("ไม่มีข้อมูลผู้ใช้งาน กรุณาเข้าสู่ระบบใหม่ ");
      return;
    }

    try {
      const res = await fetch(`${baseUrlAPI2}/prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: form.age ? parseInt(form.age) : null,
          heartRate: form.heartRate ? parseInt(form.heartRate) : null,
          weight: form.weight ? parseFloat(form.weight) : null,
          height: form.height ? parseFloat(form.height) : null,
          bmi: form.bmi ? parseFloat(form.bmi) : null,
          statusnow1: "1",
          userstatus1: user.id,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        const prescriptionId = result?.id;

        await fetch(`${baseUrlAPI}/logs30`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            action: "C",
            status: "success",
            reason: `${prescriptionId} สำเร็จ `,
            sessionId: localStorage.getItem("sessionId") || null,
            prescriptionId: prescriptionId,
          }),
        });

        onClose();
      } else {
        const prescriptionId = result?.id;
        await fetch(`${baseUrlAPI}/logs30`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            action: "C",
            status: "failed",
            reason: result?.message || "สร้างใบสั่งยาไม่สำเร็จ",
            sessionId: localStorage.getItem("sessionId") || null,
          }),
        });

        console.error("สร้างใบสั่งยาไม่สำเร็จ:", result);
      }
    } catch (err: any) {
      console.error("เกิดข้อผิดพลาดขณะสร้างใบสั่งยา:", err);

      await fetch(`${baseUrlAPI}/logs30`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          action: "C",
          status: "failed",
          reason: err.message || "เกิดข้อผิดพลาดที่ไม่คาดคิด",
          sessionId: localStorage.getItem("sessionId") || null,
        }),
      });
    }
  };

  const inputClass = "border border-gray-400 rounded-md px-4 py-3 w-full text-lg";

  function calculateAge(dob: string): string {
    if (!dob) return "0 ปี 0 เดือน 0 วัน";

    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // ถ้าวันติดลบ ให้ยืมเดือน
    if (days < 0) {
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }

    // ถ้าเดือนติดลบ ให้ยืมปี
    if (months < 0) {
      months += 12;
      years--;
    }

    return `${years} ปี ${months} เดือน ${days} วัน`;
  }


  return (
    <div
      className="relative bg-white rounded-lg shadow-xl border border-gray-300 p-4 w-[95vw] max-w-[1000px] max-h-[60vh] overflow-y-auto z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        แบบฟอร์มกรอกข้อมูลผู้ป่วย
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* หมวด: ข้อมูลทั่วไป */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">🧾 ข้อมูลทั่วไป</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-base font-medium mb-1 block">เลขที่ใบสั่งยา</label>
              <input name="number" value={form.number} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">หมายเลขคิว</label>
              <input name="queNum" value={form.queNum} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">HN</label>
              <input name="hnCode" value={form.hnCode} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">AN</label>
              <input name="anCode" value={form.anCode} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">ชื่อผู้ป่วย</label>
              <input name="name" value={form.name} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">เพศ</label>
              <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                <option value="">เลือกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">อายุ (ปี)</label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                max={120}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-base font-medium mb-1 block">เลขบัตรประชาชน</label>
              <input name="cid" value={form.cid} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* หมวด: ข้อมูลร่างกาย */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">💓 ข้อมูลร่างกาย</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-base font-medium mb-1 block">วันเดือนปีเกิด</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={(e) => {
                  const dob = e.target.value;
                  const age = calculateAge(dob);
                  setForm((prev) => ({ ...prev, dob, age: age.toString() }));
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">อายุ (ปี)</label>
              <input
                name="age"
                value={form.age}
                disabled
                className={inputClass + " bg-gray-100"}
              />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">อัตราการเต้นหัวใจ (bpm)</label>
              <input name="heartRate" value={form.heartRate} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">น้ำหนัก (กก.)</label>
              <input name="weight" value={form.weight} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">ส่วนสูง (ซม.)</label>
              <input name="height" value={form.height} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">BMI</label>
              <input name="bmi" value={form.bmi} disabled className={inputClass + " bg-gray-100"} />
            </div>
          </div>

        </div>

        {/* หมวด: ข้อมูลทางการแพทย์ */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">🧬 ข้อมูลทางการแพทย์</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-base font-medium mb-1 block">รวมทั้งหมด</label>
              <input name="allprescrip" value={form.allprescrip} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">การวินิจฉัย</label>
              <input name="diagnosis" value={form.diagnosis} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">โรคประจำตัว</label>
              <input name="chronicDisease" value={form.chronicDisease} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">แพ้ยา</label>
              <input name="drugAllergy" value={form.drugAllergy} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* หมวด: สิทธิการรักษาและบุคลากร */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">👨‍⚕️ สิทธิการรักษา & บุคลากร</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <label className="text-base font-medium mb-1 block">สิทธิการรักษา</label>
              <input name="rightType" value={form.rightType} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">ประเภทผู้ป่วย</label>
              <input name="patientType" value={form.patientType} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">แพทย์ผู้สั่งยา</label>
              <input name="doctor" value={form.doctor} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">หน่วยตรวจ</label>
              <input name="department" value={form.department} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-base font-medium mb-1 block">ผู้ตรวจสอบ</label>
              <input name="checkedBy" value={form.checkedBy} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        {/* ปุ่ม */}
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="px-5 py-3 bg-gray-300 text-lg rounded hover:bg-gray-400">
            ยกเลิก
          </button>
          <button type="submit" className="px-5 py-3 bg-blue-600 text-white text-lg rounded hover:bg-blue-700">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
