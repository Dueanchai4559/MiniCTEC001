// components/Cabinet/InfoPopup.tsx
import { ForwardedRef, forwardRef } from "react";

interface InfoPopupProps {
  className?: string;
}

const InfoPopup = forwardRef(function InfoPopup(
  { className }: InfoPopupProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-2 w-[340px] p-4 rounded-lg shadow-lg bg-white border text-sm text-gray-700 ${className || ""}`}
    >
      <h2 className="font-bold text-lg mb-2 text-gray-900">📄 รายการคัดแยกใบสั่งยา</h2>
      <p className="mb-3 text-gray-700 leading-relaxed">
        ข้อมูลใบสั่งยาที่แสดงในหน้านี้ เป็นรายการที่อยู่ในสถานะ <strong>“กำลังคัดแยก”</strong> 
        และจำกัดเฉพาะใบสั่งยาที่ดำเนินการใน<strong>วันนี้เท่านั้น</strong>
      </p>

      <div className="mt-4">
        <h3 className="font-semibold text-gray-900 mb-2">🛠️ คำอธิบายปุ่ม:</h3>
        <ul className="list-disc ml-5 space-y-1 text-gray-800">
          <li>
            <strong> เพิ่มใบสั่งยา:</strong> สำหรับผู้ใช้งานสร้างใบสั่งยาใหม่ด้วยตนเอง
          </li>
          <li>
            <strong>สร้างใบสั่งยาทดสอบระบบ:</strong> ใช้สร้างใบสั่งยาเพื่อทดสอบระบบ เช่น ตรวจสอบการทำงานของปุ่ม, สถานะ, หรือขั้นตอนในระบบ
          </li>
        </ul>
      </div>
    </div>
  );
});

export default InfoPopup;
