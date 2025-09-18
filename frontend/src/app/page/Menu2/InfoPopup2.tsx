/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForwardedRef, forwardRef } from "react";

interface InfoPopup2Props {
  className?: string;
  editableData: any;
}

const InfoPopup2 = forwardRef(function InfoPopup2(
  { className }: InfoPopup2Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-2 w-[680px] p-5 rounded-lg shadow-xl bg-white border text-sm text-gray-700 ${className || ""}`}
    >
      <div className="text-left space-y-6">
        {/* Section 1 */}
        <div>
          <h2 className="text-blue-600 font-semibold text-base flex items-center gap-2">
            <span>ℹ️</span>
            <span>คำอธิบาย – รายละเอียดใบสั่งยา</span>
          </h2>
          <p className="text-gray-600 mt-1 leading-relaxed">
            ใช้สำหรับแสดงและแก้ไขข้อมูลใบสั่งยาของผู้ป่วย โดยแบ่งออกเป็น 3 แท็บหลัก ๆ
          </p>
        </div>

        {/* Tab 1 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800  ">1. รายละเอียดคนไข้</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>วันเดือนปีเกิด / อายุ / น้ำหนัก / ส่วนสูง / เพศ</strong></li>
            <li><strong>BPM / สถานะหัวใจ:</strong> อัตราการเต้นหัวใจพร้อมผลประเมินว่าปกติหรือผิดปกติ</li>
            <li><strong>BMI / สถานะ:</strong> ดัชนีมวลกาย พร้อมคำจำกัดความ เช่น ผอม / อ้วน</li>
            <li><strong>หมายเลขบัตรประชาชน / หน่วยตรวจ / สถานที่ / เตียง / ชั้น</strong></li>
            <li><strong>ประเภทผู้ป่วย:</strong> เช่น OPD / IPD / ER</li>
            <li><strong>สิทธิการรักษา / ประเภทสิทธิ:</strong> เช่น UC, SSO, CSMBS</li>
            <li><strong>แพทย์ผู้สั่งยา / ผู้ตรวจสอบใบยา</strong></li>
            <li><strong>การวินิจฉัย / โรคประจำตัว / ประวัติแพ้ยา</strong></li>
          </ul>
        </div>

        {/* Tab 2 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 ">2. สถานะ</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>วันที่สร้าง:</strong> แสดงวันที่ใบสั่งยาถูกบันทึกเข้าระบบ</li>
            <li><strong>สถานะใบสั่งยา:</strong> ขั้นตอนล่าสุด เช่น พักตะกร้านอกตู้ / พักตะกร้าในตู้</li>
            <li><strong>ชื่อผู้พักตะกร้า / เวลาเริ่มพัก / เวลาที่พักมาแล้ว</strong></li>
            <li><strong>หากสถานะเป็น "ลบทิ้ง" หรือ "ยกเลิก":</strong> ต้องระบุเหตุผลกำกับ</li>
            <li><strong>สถานะตู้ยา:</strong> หากไม่มีการจัดจะแสดงว่า “ไม่มีการจัดตู้ยา”</li>
            <li className="text-pink-600">* ต้องแก้ไขการจัดตู้ยาผ่านหน้าจัดยาเท่านั้น</li>
          </ul>
        </div>

        {/* Tab 3 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 ">3. รายละเอียดข้อมูลใบสั่งยา</h3>
          <p className="text-gray-600 mb-2">ข้อมูลนี้ไม่สามารถแก้ไขได้ มีไว้เพื่อบันทึกการดำเนินการย้อนหลัง</p>
          <div className="overflow-x-auto">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>ผู้คัดแยก:</strong> แสดงชื่อผู้ใช้งาน และเวลาที่คัดแยก</li>
              <li><strong>ผู้จัดยา:</strong> ชื่อผู้จัด และเวลาที่จัดยา</li>
              <li><strong>ผู้ตรวจสอบ:</strong> ผู้ที่ตรวจสอบความถูกต้อง</li>
              <li><strong>ผู้จ่ายยา:</strong> แสดงว่าใครเป็นผู้จ่ายยา</li>
              <li><strong>ผู้ยกเลิก / ลบทิ้ง:</strong> กรณียกเลิกใบสั่งยาหรือถูกลบ</li>
              <li><strong>ผู้พักตะกร้า:</strong> ใครพักตะกร้าไว้ พร้อมเวลาที่พัก</li>
              <li><strong>ผู้สั่งจัดยาใหม่:</strong> กรณีต้องจัดยาซ้ำใหม่อีกครั้ง</li>
            </ul>    </div>
          <p className="text-xs mt-1 text-gray-500">* ถ้ามีรายการมากสามารถเลื่อนซ้ายขวาเพื่อดูข้อมูลเพิ่มเติม</p>
        </div>
      </div>
    </div>
  );
});

export default InfoPopup2;
