import { ForwardedRef, forwardRef } from "react";
import type { EditableData } from "./prescriptionTypes";

interface InfoPopup3Props {
  className?: string;
  editableData: EditableData;
}

const InfoPopup3 = forwardRef(function InfoPopup3(
  { className }: InfoPopup3Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-2 w-[660px] p-4 rounded-lg shadow-lg bg-white border text-sm text-gray-700 ${className || ""}`}
    >
      <div className="text-sm text-gray-700 space-y-4 text-left">
        <div>
          <h2 className="text-blue-600 font-semibold text-base flex items-center gap-1">
            <span>ℹ️</span>
            <span>คำอธิบาย – รายละเอียดรายการยา</span>
          </h2>
          <p className="mt-1 text-gray-600">
            หน้านี้ใช้สำหรับแสดงรายการยาในใบสั่งยา พร้อมระบุจำนวนและตู้ที่เลือก
          </p>
        </div>

        <ul className="list-disc list-inside space-y-1 p-2">
          <li><strong>รูป:</strong> แสดงภาพตัวอย่างของยา (ถ้ามี)</li>
          <li><strong>รหัสยา / ชื่อยา:</strong> ใช้ระบุชนิดของยา</li>
          <li><strong>จำนวน:</strong> จำนวนที่ต้องจัดจ่าย</li>
          <li><strong>ตู้ยา:</strong> ตำแหน่งตู้ที่จัดเก็บยา (ต้องเลือกก่อนบันทึก หากมีมากกว่า 1 ตู้)</li>
          <li><strong>ตัวเลือก:</strong> ปุ่มสำหรับแจ้งปัญหา หรือดูปัญหาที่เคยแจ้ง</li>
        </ul>

        <div className="border-t pt-3">
          <h3 className="text-pink-600 font-semibold mb-2">📍 หมายเหตุเพิ่มเติม</h3>
          <ul className="list-disc list-inside space-y-1 p-2">
            <li>กด “เพิ่มยา” เพื่อเพิ่มรายการใหม่</li>
            <li>หากยังไม่เลือกตู้ยา จะไม่สามารถบันทึกได้</li>
            <li>สามารถกดปริ้นฉลาก / ใบสั่งยาได้หลังจากบันทึก</li>
            <li>ช่องค้นหาชื่อยาใช้สำหรับกรองรายการในตาราง</li>
            <li>สามารถเลือก “จัดแล้ว” ได้เฉพาะรายการที่สถานะเป็น <strong>ปกติ</strong> หรือ <strong>ยาไม่ถูกยกเลิก </strong></li>
            <li>รายการสถานะ <strong>ไม่จัดยา  </strong> จะถูกแสดงแยกด้วยสีแดง และ <strong>ไม่สามารถเลือก หยิบ ได้</strong></li>
            <li>การกดปุ่ม “จัดทั้งหมด” จะกระทำเฉพาะรายการที่สถานะเป็น ปกติ หรือ ยาไม่ถูกยกเลิก เท่านั้น</li>
            <li>ในแถบ “จัดแล้ว / ทั้งหมด” จะนับเฉพาะรายการสถานะ ปกติ และ ยาไม่ถูกยกเลิก</li>
            <li>ปุ่ม “แจ้งปัญหา” จะแสดงเฉพาะสถานะ ปกติ เท่านั้น ส่วนสถานะ ยาไม่ถูกยกเลิก และ ไม่จัดยา จะเป็นปุ่ม ดูปัญหา</li>
          </ul>
        </div>
      </div>
    </div>
  );
});

export default InfoPopup3;
