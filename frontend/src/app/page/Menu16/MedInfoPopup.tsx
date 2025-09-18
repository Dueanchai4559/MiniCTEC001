/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from "@headlessui/react";
import { X, Printer } from "lucide-react";

interface MedInfoPopupProps {
  open: boolean;
  onClose: () => void;
  med: any;
  userName?: string; // เพิ่มเผื่อส่งชื่อคนพิมพ์
}

export default function MedInfoPopup({ open, onClose, med, userName }: MedInfoPopupProps) {

  if (!med) return null;

  const shouldShowStatusDetail = med.status === "2" || med.status === "3";

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
      <Dialog.Panel className="bg-white p-6 rounded-2xl shadow-xl max-w-7xl w-full space-y-6 relative">

        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
            💊 ข้อมูลยาโรงพยาบาล
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-lg text-gray-800">

          <Section title="📦 ข้อมูลทั่วไป">
            <Item label="รหัสยา" value={med.medCode} />
            <Item label="ชื่อยา" value={med.medName} />
            <Item label="บรรจุภัณฑ์" value={med.package} />
            <Item label="ปริมาณใช้" value={med.dosage} />
            <Item label="จำนวนในคลัง" value={med.medStorage} />
            <Item label="วันหมดอายุ" value={med.medEXP} />
            <Item label="ราคา/หน่วย" value={med.price} />
          </Section>

          <Section title="🗂 ตำแหน่งจัดเก็บ">
            <Item label="ตู้ยา" value={`${med.cabinetName || "-"} / ${med.boxcabinetName || "-"}`} />
            <Item label="แถว / ช่อง" value={`${med.row || "-"} / ${med.slot || "-"}`} />
          </Section>

          <Section title="🟢 การหยิบยา">
            <Item label="สถานะ" value={med.isPicked ? "หยิบแล้ว" : "ยังไม่หยิบ"} />
            {med.isPicked && (
              <>
                <Item label="ผู้หยิบ" value={med.pickedBy} />
                <Item
                  label="เวลา"
                  value={med.pickedAt ? new Date(med.pickedAt).toLocaleString("th-TH") : "-"}
                />
              </>
            )}
          </Section>


          <Section title="📝 คำเตือน / คำแนะนำ">
            <Item label="คำเตือน" value={med.warning} />
            <Item label="คำแนะนำ" value={med.advice} />
          </Section>

          <Section title="💊 วิธีใช้">
            <Item label="ภาษาไทย" value={med.usageTH} />
            <Item label="ภาษาอังกฤษ" value={med.usageEN} />
            <Item label="ช่วงเวลา (TH)" value={`${med.time1TH || "-"}, ${med.time2TH || "-"}, ${med.time3TH || "-"}`} />
            <Item label="ช่วงเวลา (EN)" value={`${med.time1EN || "-"}, ${med.time2EN || "-"}, ${med.time3EN || "-"}`} />
          </Section>

          {shouldShowStatusDetail && (
            <Section title="❗ สถานะยา">
              <Item label="สถานะ" value={med.status === "2" ? "จัดยาผิด" : med.status === "3" ? "ยกเลิก" : med.status} />
              <Item label="รายละเอียด" value={med.textstatus} />
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <button
            onClick={() => {
              //console("med.id", med.id);
              //console("userName", userName);
              if (!med.id || !userName) return;
              const urlLabel = `/Menu0/print2?id=${med.id}&userName=${encodeURIComponent(userName)}`;
              const iframe = document.createElement("iframe");
              iframe.style.display = "none";
              iframe.src = urlLabel;
              document.body.appendChild(iframe);
              setTimeout(() => document.body.removeChild(iframe), 15000);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Printer size={18} />
            พิมพ์ฉลากยา
          </button>


          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            ปิด
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-2">
      <h3 className="text-base font-semibold text-blue-700 border-l-4 border-blue-500 pl-2">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  return (
    <p className="text-base flex gap-2">
      <span className="font-medium text-gray-600 w-[120px] shrink-0">{label}:</span>
      <span className="text-gray-900">{value || "-"}</span>
    </p>
  );
}
