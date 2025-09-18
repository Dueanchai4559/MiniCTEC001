/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { baseUrlAPI } from "@/app/ip";
import Select from "react-select";
interface EditMedPopupProps {
  onClose: () => void;
  onSave: (newMed: any) => void;
  prescriptionId: number;
}

interface MedItem {
  medCode: string;
  medName: string;
  [key: string]: any;
}

export default function EditMedPopup({ onClose, onSave, prescriptionId }: EditMedPopupProps) {
  const [form, setForm] = useState({
    medCode: "",
    amount: 0,
  });

  const [medOptions, setMedOptions] = useState<MedItem[]>([]);

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const res = await fetch(`${baseUrlAPI}/medicine`);
        const meds = await res.json();
        setMedOptions(meds);
      } catch (error) {
        console.error(" โหลดรายการยาไม่สำเร็จ", error);
      }
    };
    fetchMeds();
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    // console.log("📋 ยาที่เลือก:", form);

    if (form.amount <= 0) {
      console.warn(" จำนวนที่กรอกไม่ถูกต้อง:", form.amount);
      return;
    }

    const selected = medOptions.find((m) => m.medCode === form.medCode);
    if (!selected) {
      console.warn(" ไม่พบรายการยา:", form.medCode);
      return;
    }

    if (!prescriptionId) {
      console.warn(" ไม่พบ prescriptionId สำหรับลิ้งข้อมูล");
      return;
    }

    const newMedData = {
      medCode: selected.medCode,
      medName: selected.medName,
      amoung: form.amount.toString(),
      prescriptionId,
    };

    // console.log(" กำลังส่งข้อมูลยาใหม่:", newMedData);

    try {
      const res = await fetch(`${baseUrlAPI}/medicineHos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMedData),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const result = await res.json();
      // console.log(" บันทึกข้อมูลยาเรียบร้อย:", result);
      const medication = medOptions.find((m) => m.medCode === result.medCode);

      const resultWithMedication = {
        ...result,
        medication,
      };

      onSave(resultWithMedication);
    } catch (err) {
      console.error(" บันทึกไม่สำเร็จ:", err);
    }
  };


  return (
    <div className="p-8 w-[700px] mx-auto bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">💊 เลือกและเพิ่มข้อมูลยา</h1>

      <div className="space-y-6">
        <div className="flex gap-2 items-center">
          <div className="w-full">
            <label className="block mb-1">ชื่อยา</label>
            <Select
              options={medOptions.map((option) => ({
                value: option.medCode,
                label: `${option.medCode} - ${option.medName}`,
              }))}
              value={medOptions.find((m) => m.medCode === form.medCode)
                ? { value: form.medCode, label: `${form.medCode} - ${medOptions.find((m) => m.medCode === form.medCode)?.medName}` }
                : null}
              onChange={(selected) => handleChange("medCode", selected?.value || "")}
              classNamePrefix="select"
              placeholder="พิมพ์ค้นหายา หรือเลือกจากรายการ"
              isClearable={false}
              noOptionsMessage={() => "ไม่พบรายการยา"}
            />
          </div>

          <button
            type="button"
            onClick={() => handleChange("medCode", "")}
            className="h-[42px] px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 mt-7"
            title="ล้างข้อมูล"
          >

          </button>
        </div>

        {/* แสดงรูปภาพของยา */}
        {form.medCode && (
          <div className="mt-2">
            {(() => {
              const selectedMed = medOptions.find((m) => m.medCode === form.medCode);
              if (selectedMed?.image1) {
                return (
                  <img
                    src={selectedMed.image1}
                    alt="รูปยา"
                    className="w-24 h-24 object-contain rounded border mt-2"
                  />
                );
              } else {
                return <div className="text-sm text-gray-500 mt-2">ไม่มีรูปภาพของยา</div>;
              }
            })()}
          </div>
        )}

        <div>
          <label className="block mb-1">จำนวน</label>
          <div className="flex gap-2 items-center">
            <button
              type="button"
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-lg"
              onClick={() => handleChange("amount", Math.max(0, Number(form.amount || 0) - 1))}
            >
              -
            </button>
            <input
              type="text"
              className="w-full border p-2 rounded text-center"
              value={form.amount}
              onChange={(e) => {
                let value = e.target.value.replace(/^0+(?!$)/, "");
                value = value.replace(/\D/g, "");
                handleChange("amount", value === "" ? "" : Number(value));
              }}
              inputMode="numeric"
              pattern="\d*"
            />
            <button
              type="button"
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-lg"
              onClick={() => handleChange("amount", Number(form.amount || 0) + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleSave}
          >
            บันทึก
          </button>
          <button
            className="px-6 py-3 bg-gray-300 text-black rounded hover:bg-gray-400"
            onClick={onClose}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );

}
