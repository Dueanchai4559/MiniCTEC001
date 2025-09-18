/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from "@headlessui/react";
import { useState, useEffect, useRef } from "react";
import { baseUrlAPI } from "@/app/ip";
import { Info } from "lucide-react";
import InfoPopup2 from "./InfoPopup2";
import InfoPopup3 from "./InfoPopup3";
import type { Props, EditableData, CabinetMed, medicationHospitals } from "./prescriptionTypes";
import MedInfoPopup from "./MedInfoPopup";
import { useRouter } from "next/navigation";
export default function PrescriptionDetailPopup({ data, onClose }: Props) {
  const [editableData, setEditableData] = useState<EditableData>(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [originalStatus, setOriginalStatus] = useState<string | null>(null);
  const [scannedUser, setScannedUser] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonRef1 = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const popupRef1 = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const [selectedMed, setSelectedMed] = useState<any>(null);
  const [selectAllPicked, setSelectAllPicked] = useState(false);
  const [isMedTableOpen, setIsMedTableOpen] = useState(false);
  const medTableRef = useRef<HTMLDivElement>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    index: number;
    id: number;
    reasons: string[];
    note: string;
    med?: any;
    readonly?: boolean;
  } | null>(null);

  const filteredMeds: medicationHospitals[] = editableData.medicationHospitals.filter((med) =>
    med.medName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [ipAddress, setIpAddress] = useState<string>("");
  const isConfirmDisabled =
    (!deleteTarget?.reasons || deleteTarget.reasons.length === 0) &&
    (!deleteTarget?.note || deleteTarget.note.trim() === "");
  const [showMedPopup, setShowMedPopup] = useState(false);
  const [duration7, setDuration7] = useState("");
  const [duration7_1, setDuration7_1] = useState("");
  const [printLabel, setPrintLabel] = useState(false);
  const [printPrescription, setPrintPrescription] = useState(false);
  const router = useRouter();
  const [displayMeds, setDisplayMeds] = useState<MedType[]>([]);
  type MedType = any;

  const [user, setUser] = useState<{ name?: string; image?: string } | null>(
    null
  );

  const thaiKeyToEnglish: Record<string, string> = {
    "ๅ": "1",
    "/": "2",
    "-": "3",
    "ภ": "4",
    "ถ": "5",
    "ุ": "6",
    "ึ": "7",
    "ค": "8",
    "ต": "9",
    "จ": "0",
  };

  const convertThaiKeysToEnglish = (input: string): string => {
    return input
      .split("")
      .map((char) => thaiKeyToEnglish[char] ?? char)
      .join("");
  };

  // ตัวอย่างใช้ใน onChange ของ input

  const handleScannedUserChange = (value: string) => {
    const converted = convertThaiKeysToEnglish(value);
    setScannedUser(converted);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const checkHeartRateStatus = (heartRate: number, age: number): { label: string; color: string } => {
    let label = "ไม่สามารถระบุได้";
    let color = "gray";
    if (age >= 1 && age <= 10) {
      label = heartRate >= 70 && heartRate <= 120 ? "ปกติ" : "ผิดปกติ";
    } else if (age >= 11 && age <= 17) {
      label = heartRate >= 60 && heartRate <= 100 ? "ปกติ" : "ผิดปกติ";
    } else if (age >= 18 && age <= 64) {
      label = heartRate >= 60 && heartRate <= 100 ? "ปกติ" : "ผิดปกติ";
    } else if (age >= 65) {
      label = heartRate >= 60 && heartRate <= 100 ? "ปกติ" : "ผิดปกติ";
    }
    if (label === "ปกติ") {
      color = "green";
    } else if (label === "ผิดปกติ") {
      color = "red";
    }
    return { label, color };
  };

  const handleSaveAndPrint = () => {
    handleSave();
    const id = editableData?.id;
    const userName = encodeURIComponent(user?.name || "ไม่ทราบชื่อ");
    if (printLabel) {
      const urlLabel = `/Menu0/print2?id=${id}&userName=${userName}`;
      const iframeLabel = document.createElement("iframe");
      iframeLabel.style.display = "none";
      iframeLabel.src = urlLabel;
      document.body.appendChild(iframeLabel);
      setTimeout(() => document.body.removeChild(iframeLabel), 15000);
    }
    if (printPrescription) {
      const urlRx = `/Menu0/print?id=${id}&userName=${userName}`;
      const iframeRx = document.createElement("iframe");
      iframeRx.style.display = "none";
      iframeRx.src = urlRx;
      document.body.appendChild(iframeRx);
      setTimeout(() => document.body.removeChild(iframeRx), 15000);
    }
  };

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

  useEffect(() => {
    const allPicked = displayMeds.length > 0 && displayMeds.every((med) => med.isPicked);
    setSelectAllPicked(allPicked);
  }, [displayMeds]);

  useEffect(() => {
    if (editableData && editableData.medicationHospitals) {
      setDisplayMeds(editableData.medicationHospitals);
    }
  }, [editableData]);

  useEffect(() => {
    const medsToCount = displayMeds.filter((m) => m.status === "1" || m.status === "2");
    const allPicked = medsToCount.length > 0 && medsToCount.every((m) => m.isPicked);
    setSelectAllPicked(allPicked);
  }, [displayMeds]);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIpAddress(data.ip))
      .catch((err) => console.error(" ดึง IP ไม่สำเร็จ:", err));
  }, []);

  const meds = editableData.medicationHospitals || [];
  const hasUnassigned = meds.some((med) => {
    const cabinetOptions = med.medication?.CabinetMed || [];
    const hasCabinetOptions = cabinetOptions.length > 0;
    const isUnassigned =
      !med.boxcabinetName || !med.cabinetName || !med.row || !med.slot;
    return hasCabinetOptions && isUnassigned;
  });

  useEffect(() => {
    if (data) {
      // ถ้า data.statusnow1 ไม่มีค่า ให้ตั้งเป็น "2"
      const status = data.statusnow1 || "2";
      setEditableData({
        ...data,
        statusnow1: status,
      });
      setOriginalStatus(status);
    }
  }, [data]);


  useEffect(() => {
    if (!editableData) return;
    const updated = { ...editableData };
    if (editableData.dob) {
      updated.age = formatAge(editableData.dob);
    }
    const weight = parseFloat(editableData.weight || "0");
    const height = parseFloat(editableData.height || "0") / 100;
    if (weight > 0 && height > 0) {
      const bmi = weight / (height * height);
      updated.bmi = bmi.toFixed(2);
    }
    const ageText = updated.age?.split(" ")[0] || "";
    const age = parseInt(ageText);
    const heartRate = parseInt(editableData.heartRate || "");
    if (!isNaN(age) && !isNaN(heartRate)) {
      const { label, color } = checkHeartRateStatus(heartRate, age);
      updated.heartRateStatus = label;
      updated.heartRateColor = color;
    }
    setEditableData(updated);
  }, [editableData.weight, editableData.height, editableData.dob, editableData.heartRate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (editableData?.status7Time) {
        setDuration7(formatDuration(editableData.status7Time));
      }
      if (editableData?.status7_1Time) {
        setDuration7_1(formatDuration(editableData.status7_1Time));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [editableData?.status7Time, editableData?.status7_1Time]);

  function formatDuration(startTime: string | Date): string {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const diff = Math.max(0, now - start);
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / 1000 / 60) % 60;
    const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);
    return `${days} วัน ${hours} ชม. ${minutes} นาที ${seconds} วินาที`;
  }

  const handleChange = (key: string, value: any) => {
    const isUserNameObject = key.startsWith("userstatus") && typeof value === "object";
    if (!isUserNameObject && key === "heartRate" && typeof value === "string") {
      value = value.replace(/^0+(?!$)/, "");
      const hr = parseInt(value);
      if (!isNaN(hr)) {
        if (hr > 300) {
          value = "300";
        } else {
          value = hr.toString();
        }
      } else {
        value = "";
      }
    }
    if (key === "height" || key === "weight") {
      value = value.replace(/^0+(?!$)/, "");
    }
    const updatedData = {
      ...editableData,
      [key]: value,
    };
    if (key === "dob") {
      updatedData.age = formatAge(value);
    }
    const ageText = updatedData.age?.split(" ")[0] || "";
    const age = parseInt(ageText);
    const heartRate = parseInt(updatedData.heartRate || "");
    if (!isNaN(heartRate) && !isNaN(age)) {
      const { label, color } = checkHeartRateStatus(heartRate, age);
      updatedData.heartRateStatus = label;
      updatedData.heartRateColor = color;
    }
    setEditableData(updatedData);
  };

  const calculateBMI = () => {
    const weight = parseFloat(editableData.weight || "0");
    const height = parseFloat(editableData.height || "0") / 100;
    if (weight && height) {
      const bmi = weight / (height * height);
      setEditableData((prevData) => ({
        ...prevData,
        bmi: bmi.toFixed(2),
      }));
    } else {
      setEditableData((prevData) => ({
        ...prevData,
        bmi: "",
      }));
    }
  };

  const handleDeleteMed = async (
    index: number,
    id: number,
    textstatus?: string,
    status: "2" | "3" = "2"
  ) => {
    try {
      const isCancel = textstatus?.includes("ไม่จัดยานี้");
      const status = isCancel ? "3" : "2";
      const res = await fetch(`${baseUrlAPI}/medicineHos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          textstatus,
        }),
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถอัปเดตสถานะยาได้");
      }
      setEditableData((prev) => {
        const updatedList = [...(prev?.medicationHospitals || [])];
        if (updatedList[index]) {
          updatedList[index] = {
            ...updatedList[index],
            status,
            textstatus,
          };
        }
        return { ...prev, medicationHospitals: updatedList };
      });
    } catch (err) {
      console.error("ลบยาไม่สำเร็จ:", err);
      alert("เกิดข้อผิดพลาดในการลบยา");
    } finally {
      setDeleteTarget(null);
    }
  };

  const getBMIStyle = (bmi: string) => {
    const bmiValue = parseFloat(bmi || "0");
    if (bmiValue < 18.5) {
      return { color: "blue", fontWeight: "bold", label: "ผอม" };
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      return { color: "green", fontWeight: "bold", label: "น้ำหนักปกติ" };
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      return { color: "orange", fontWeight: "bold", label: "น้ำหนักเกิน" };
    } else if (bmiValue >= 30 && bmiValue <= 34.9) {
      return { color: "red", fontWeight: "bold", label: "อ้วน" };
    } else if (bmiValue >= 35) {
      return { color: "darkred", fontWeight: "bold", label: "อ้วนมาก" };
    }
    return { color: "black", fontWeight: "normal", label: "" };
  };

  useEffect(() => {
    calculateBMI();
  }, [editableData.weight, editableData.height]);
  const { color, fontWeight, label } = getBMIStyle(editableData.bmi || "");

  const handleDateChange = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    let ageDays = today.getDate() - birthDate.getDate();
    if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0)) {
      ageYears--;
      ageMonths = ageMonths + 12;
    }
    if (ageDays < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      ageDays = lastMonth.getDate() - birthDate.getDate() + today.getDate();
      ageMonths--;
    }
    const ageString = `${ageYears} ปี ${ageMonths} เดือน ${ageDays} วัน`;
    setEditableData((prevData) => ({
      ...prevData,
      dob: dob,
      age: ageString,
    }));
  };

  const handleSave = async () => {
    try {
      const medsLinked = await enrichMedicationLinks(editableData.medicationHospitals || []);
      const updatedData = {
        ...editableData,
        medicationHospitals: medsLinked,
      };
      const raw = localStorage.getItem("authUser");
      const auth = raw ? JSON.parse(raw) : null;
      const userRfid = auth?.user?.rfid || scannedUser || "";


      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      const ip = ipData.ip;
      const now = new Date().toISOString();
      const statusOrder = [
        { value: "1", userField: "userstatus1Name", timeField: "status1Time", ipField: "status1IP" },
        { value: "2", userField: "userstatus21Name", timeField: "status21Time", ipField: "status21IP" },
        { value: "3", userField: "userstatus3Name", timeField: "status3Time", ipField: "status3IP" },
      ];
      const previousStatus = originalStatus || "";
      const newStatus = updatedData.statusnow1 || "";
      const newIndex = statusOrder.findIndex((s) => s.value === newStatus);
      if (newStatus === "9") {
        for (const step of statusOrder) {
          if (step.value !== "9") {
            delete (updatedData as any)[step.userField];
            delete (updatedData as any)[step.timeField];
            delete (updatedData as any)[step.ipField];
          }
        }
        //  updatedData.userstatus8Name = userName;
        // updatedData.status8Time = now;
        // updatedData.status8IP = ip;
        // updatedData.statusnow2 = previousStatus;

      } else if (newStatus === "8") {
        //  updatedData.userstatus8Name = userName;
        // updatedData.status8Time = now;
        // updatedData.status8IP = ip;
        // updatedData.statusnow2 = previousStatus;
        (updatedData as any).statustimenow2_1 = now;
      } else if (newIndex >= 0) {
        const step = statusOrder[newIndex];
        if (step) {

          (updatedData as any)[step.timeField] = now;
          (updatedData as any)[step.ipField] = ip;
        }
        delete updatedData.statusnow2;
      } else {
        console.warn(" newStatus ไม่มีใน statusOrder");
      }
      const excludeKeys = [
        "medications", "userstatus1", "userstatus21", "userstatus3",
        "userstatus4", "userstatus5", "userstatus6", "userstatus7", "userstatus8", "userstatus9"
      ];
      const cleanedData = Object.fromEntries(
        Object.entries(updatedData)
          .filter(([key, value]) =>
            !excludeKeys.includes(key) &&
            value !== undefined &&
            value !== null &&
            value !== ""
          )
          .map(([key, value]) =>
            key === "bmi" ? [key, parseFloat(value as string)] : [key, value]
          )
      );
      const jsonData = JSON.stringify(cleanedData);
      const sizeInKB = (jsonData.length / 1024).toFixed(2);
      //  console.log(` ขนาดข้อมูลที่ส่ง: ${sizeInKB} KB`);
      if (parseFloat(sizeInKB) > 500) {
        console.warn(" ข้อมูลใหญ่เกิน 500KB อาจทำให้ PUT ไม่สำเร็จ");
      }
      const res = await fetch(`${baseUrlAPI}/prescriptions/${editableData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: jsonData,
      });
      const result = await res.json();
      //  console.log(" บันทึกแล้ว:", result);
      onClose();
    } catch (err) {
      console.error(" บันทึกล้มเหลว:", err);
    }
  };

  const formatAge = (dob: string): string => {
    const today = new Date();
    const birthDate = new Date(dob);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    if (days < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days = lastMonth.getDate() - birthDate.getDate() + today.getDate();
      months--;
    }
    return `${years} ปี ${months} เดือน ${days} วัน`;
  };

  function formatThaiDateTime(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const parts = new Intl.DateTimeFormat("th-TH", options).formatToParts(date);
    const day = parts.find(p => p.type === "day")?.value;
    const month = parts.find(p => p.type === "month")?.value;
    const year = parts.find(p => p.type === "year")?.value;
    const hour = parts.find(p => p.type === "hour")?.value;
    const minute = parts.find(p => p.type === "minute")?.value;
    return `${day}/${month}/${year} เวลา ${hour}.${minute} น.`;
  }

  const enrichMedicationLinks = async (meds: any[]) => {
    return await Promise.all(
      meds.map(async (med) => {
        if (med.medCode && !med.medicationId) {
          const res = await fetch(`${baseUrlAPI}/medicine/byCode/${encodeURIComponent(med.medCode)}`);
          const data = await res.json();
          if (data?.id) {
            await fetch(`${baseUrlAPI}/medicine/link-hospital/${med.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ medicationId: data.id }),
            });
            return {
              ...med,
              medicationId: data.id,
              medication: data,
            };
          }
        } else if (med.medicationId && !med.medication) {
          const res = await fetch(`${baseUrlAPI}/medicine/${med.medicationId}`);
          const data = await res.json();
          return {
            ...med,
            medication: data,
          };
        }
        return med;
      })
    );
  };

  const handleSelectCabinet = async (medId: number, cabinet: CabinetMed) => {
    //  console.log(` เลือกตู้ยา ${cabinet.cabinetName} ของยา id: ${medId}`);
    setEditableData((prevData) => {
      const updatedMeds = prevData.medicationHospitals.map((med) => {
        if (med.id === medId) {
          return {
            ...med,
            boxcabinetName: cabinet.boxcabinetName,
            cabinetName: cabinet.cabinetName,
            row: cabinet.row,
            slot: cabinet.slot,
            typyCabinet: cabinet.typyCabinet,
            location: cabinet.location,
            cabinetMedId: cabinet.id,
          };
        }
        return med;
      });
      return {
        ...prevData,
        medicationHospitals: updatedMeds,
      };
    });

    try {
      const payload = {
        boxcabinetName: cabinet.boxcabinetName,
        cabinetName: cabinet.cabinetName,
        row: cabinet.row,
        slot: cabinet.slot,
        typyCabinet: cabinet.typyCabinet,
        location: cabinet.location,
        cabinetMedId: cabinet.id,
      };
      const response = await fetch(`${baseUrlAPI}/medicineHos/${medId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`ไม่สามารถอัปเดตยา ID: ${medId}`);
      }
      const result = await response.json();
      //  console.log(" อัปเดตตู้ยาเรียบร้อย:", result);
    } catch (error) {
      console.error(" เกิดข้อผิดพลาดในการอัปเดตตู้ยา:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูลตู้ยา");
    }
  };

  const steps = [
    { label: "กำลังคัดแยก", statusValue: "1", user: editableData.userstatus1Name, time: editableData.status1Time },
    { label: "กำลังจัดยา", statusValue: "2", user: editableData.userstatus21Name, time: editableData.status21Time },
    { label: "จัดยาเสร็จ", statusValue: "3", user: editableData.userstatus3Name, time: editableData.status3Time },
  ];

  const allReasonsSet = new Set(
    [
      "จัดยาผิด", "ยาไม่ตรง", "ข้อมูลซ้ำ", "ใช้รหัสยาผิด",
      "ไม่มีชื่อยานี้ในระบบ", "ข้อมูลยาไม่ตรงกับฉลาก",
      "ใช้ชื่อยาเฉพาะทางผิด", "จัดยายาไม่ครบ", "จัดยาเกิน",
      "ปริมาณเกินความเป็นไปได้",
      "ฉลากยาไม่ตรงกับข้อมูลจริง", "พิมพ์ชื่อยาผิด สะกดผิด",
      "ขนาดความแรงในฉลากผิด", "ปริมาณยาบนฉลากไม่ตรง",
      "รูปแบบยาในฉลากไม่ถูกต้อง", "วันหมดอายุในฉลากไม่ตรง",
      "ฉลากขาด   ซีด   อ่านไม่ได้", "พิมพ์ฉลากซ้ำหลายชุด",
      "บาร์โค้ดในฉลากไม่สามารถสแกนได้",
      "จ่ายยาผิดชนิด", "จ่ายยาผิดขนาดความแรง", "จ่ายยาผิดรูปแบบ",
      "จ่ายยาผิดจำนวน", "จ่ายยาหมดอายุ เสื่อมคุณภาพ",
      "จ่ายยาซ้ำ", "จ่ายยาที่ผู้ป่วยแพ้",
      "การปนเปื้อนระหว่างยา", "ภาชนะบรรจุไม่เหมาะสม", "ยาหมดอายุ",
      "ยาเสื่อมคุณภาพ", "ยาหก หล่น เสียระหว่างจัด",
    ]
  );

  function parseTextStatus(textstatus: string | undefined): { reasons: string[]; note: string } {
    if (!textstatus) return { reasons: [], note: "" };
    const parts = textstatus.split(" / ").map((s) => s.trim());
    const reasons: string[] = [];
    const noteParts: string[] = [];

    for (const part of parts) {
      if (allReasonsSet.has(part)) {
        reasons.push(part);
      } else {
        noteParts.push(part);
      }
    }
    return {
      reasons,
      note: noteParts.join(" / "),
    };
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
      if (
        popupRef1.current &&
        !popupRef1.current.contains(event.target as Node) &&
        !buttonRef1.current?.contains(event.target as Node)
      ) {
        setShowPopup1(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveAndPrintCustom = async (
    data: EditableData,
    printOptions?: { printLabel?: boolean; printPrescription?: boolean },
    originalStatus: string = "",
    onClose?: () => void // รับ onClose เป็น optional parameter
  ) => {
    try {
      console.log("▶ เริ่มฟังก์ชันบันทึกข้อมูลใบสั่งยา");
      const medsLinked = await enrichMedicationLinks(data.medicationHospitals || []);
      console.log("✔ enrich ยาเรียบร้อย");

      const updatedData = { ...data, medicationHospitals: medsLinked };

      const raw = localStorage.getItem("authUser");
      const auth = raw ? JSON.parse(raw) : null;
      const userRfid = auth?.user?.rfid || scannedUser || "";


      console.log("⏳ กำลังดึง IP เครื่อง...");
      const ipRes = await fetch("https://api.ipify.org?format=json");
      if (!ipRes.ok) {
        console.warn("⚠️ ดึง IP ไม่สำเร็จ, status:", ipRes.status);
      }
      const ipData = await ipRes.json();
      const ip = ipData.ip || "0.0.0.0";
      console.log("✔ ได้ IP เครื่อง:", ip);

      const now = new Date().toISOString();

      const statusOrder = [
        { value: "1", userField: "userstatus1Name", timeField: "status1Time", ipField: "status1IP" },
        { value: "2", userField: "userstatus21Name", timeField: "status21Time", ipField: "status21IP" },
        { value: "3", userField: "userstatus3Name", timeField: "status3Time", ipField: "status3IP" },
      ];

      console.log("🕒 เวลาปัจจุบัน:", now);
      console.log("📋 สถานะเดิม:", originalStatus, "สถานะใหม่:", updatedData.statusnow1);

      const previousStatus = originalStatus || "";
      const newStatus = updatedData.statusnow1 || "";
      const newIndex = statusOrder.findIndex((s) => s.value === newStatus);

      if (newStatus === "9") {
        console.log("⚙️ กำลังตั้งสถานะเป็น 9 (จัดใหม่)");
        for (const step of statusOrder) {
          if (step.value !== "9") {
            delete (updatedData as any)[step.userField];
            delete (updatedData as any)[step.timeField];
            delete (updatedData as any)[step.ipField];
          }
        }
        //  updatedData.userstatus8Name = userName;
        updatedData.status8Time = now;
        updatedData.status8IP = ip;
        updatedData.statusnow2 = previousStatus;
      } else if (newStatus === "8") {
        console.log("⚙️ กำลังตั้งสถานะเป็น 8 (พักยาในตู้)");
        //  updatedData.userstatus8Name = userName;
        updatedData.status8Time = now;
        updatedData.status8IP = ip;
        updatedData.statusnow2 = previousStatus;
        (updatedData as any).statustimenow2_1 = now;
      } else if (newIndex >= 0) {
        console.log(`⚙️ กำลังตั้งสถานะเป็น ${newStatus} ตามลำดับ`);
        const step = statusOrder[newIndex];
        if (step) {

          (updatedData as any)[step.timeField] = now;
          (updatedData as any)[step.ipField] = ip;
        }
        delete updatedData.statusnow2;
      } else {
        console.warn("❓ สถานะใหม่ไม่อยู่ในรายการสถานะที่กำหนด:", newStatus);
      }

      const excludeKeys = ["medications", "userstatus1", "userstatus21", "userstatus3", "userstatus4", "userstatus5", "userstatus6", "userstatus7", "userstatus8", "userstatus9"];
      const cleanedData = Object.fromEntries(
        Object.entries(updatedData)
          .filter(([key, value]) =>
            !excludeKeys.includes(key) &&
            value !== undefined &&
            value !== null &&
            value !== ""
          )
          .map(([key, value]) => key === "bmi" ? [key, parseFloat(value as string)] : [key, value])
      );

      console.log("🚀 ส่งข้อมูลไป API ที่ /prescriptions/" + updatedData.id);
      const res = await fetch(`${baseUrlAPI}/prescriptions/${updatedData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ บันทึกไม่สำเร็จ, status:", res.status, "response:", text);
        alert(`เกิดข้อผิดพลาดระหว่างบันทึกข้อมูล (status: ${res.status})`);
        return;
      }

      const result = await res.json();
      console.log("✅ บันทึกข้อมูลสำเร็จ:", result);

      if (onClose) onClose();

    } catch (err) {
      console.error("🔥 เกิดข้อผิดพลาดระหว่างบันทึกข้อมูล:", err);
      alert("เกิดข้อผิดพลาดระหว่างบันทึกข้อมูล");
    }
  };

  return (
    <Dialog
      open={!!data}
      onClose={() => {
        const meds = editableData.medicationHospitals || [];
        const hasUnassigned = meds.some((med) => {
          const cabinetOptions = med.medication?.CabinetMed || [];
          const hasCabinetOptions = cabinetOptions.length > 0;
          const isUnassigned =
            !med.boxcabinetName || !med.cabinetName || !med.row || !med.slot;
          return hasCabinetOptions && isUnassigned;
        });
        if (hasUnassigned) {
          alert(" กรุณาเลือกตู้ยาสำหรับยาที่มีตู้ให้เลือกก่อนปิดหน้าต่าง");
          return;
        }
        onClose();
      }}
      className="bg-black/40 relative z-50"
    >
      <div className="fixed inset-0 bg-opacity-30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-2">
        <Dialog.Panel className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-4 w-[1900px] h-[95vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col">
          <div className="grid gap-4 md:grid-cols-[40%_60%]">
            {/* ฝั่งซ้าย: รายละเอียดใบสั่งยา */}
            <div>
              <Dialog.Title className="text-2xl font-semibold mb-4 text-center relative">
                รายละเอียดใบสั่งยา
                <button
                  ref={buttonRef}
                  onClick={() => setShowPopup(!showPopup)}
                  className="ml-2 text-blue-600 hover:text-blue-800 align-middle"
                >
                  <Info size={20} />
                </button>
                {showPopup && (
                  <InfoPopup2
                    ref={popupRef}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2"
                    editableData={editableData}
                  />
                )}

              </Dialog.Title>

              <div className="grid grid-cols-6 gap-4">
                <div>
                  <label>เลขใบสั่งยา:</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={editableData?.number || ""}
                    onChange={(e) => handleChange("number", e.target.value)}
                    readOnly={true}  // แก้ตรงนี้
                  />
                </div>
                <div>
                  <label>เลขคิว:</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={editableData?.queNum || ""}
                    onChange={(e) => handleChange("queNum", e.target.value)}
                    readOnly={true}  // แก้ตรงนี้
                  />
                </div>
                <div>
                  <label>เลข HN:</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={editableData?.hnCode || ""}
                    onChange={(e) => handleChange("hnCode", e.target.value)}
                    readOnly={true}  // แก้ตรงนี้
                  />
                </div>
                <div>
                  <label>เลข AN:</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={editableData?.anCode || ""}
                    onChange={(e) => handleChange("anCode", e.target.value)}
                    readOnly={true}  // แก้ตรงนี้
                  />
                </div>
                <div>
                  <label>ชื่อผู้ป่วย:</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={editableData?.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    readOnly={true}  // แก้ตรงนี้
                  />
                </div>

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>สถานะใบสั่งยา:</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md" value={editableData?.statusnow1 || ""} onChange={(e) => handleChange("statusnow1", e.target.value)}>
                    <option value="1">กำลังคัดแยก</option>
                    <option value="2">กำลังจัดยา</option>
                    <option value="3">รอตรวจสอบ</option>
                    <option value="4">ตรวจสอบสำเร็จ</option>
                    <option value="5">จ่ายยาสำเร็จ</option>
                    <option value="6">ยกเลิก</option>
                    <option value="7">ลบทิ้ง</option>
                    <option value="8">พักตะกร้านอกตู้</option>
                    <option value="9">จัดใหม่</option>
                    <option value="10">พักตะกร้าในตู้</option>
                  </select>
                </div>
                <div>
                  <label>ผู้ใช้ที่สแกนบาร์โค้ด:</label>
                  <input
                    type="password"
                    ref={inputRef}
                    className="pl-4 pr-4 py-2 border border-gray-300 rounded-md text-sm w-80 focus:outline-none focus:ring-0"
                    placeholder="สแกนบาร์โค้ดหรือกรอกข้อมูลผู้ใช้"
                    value={scannedUser}
                    onChange={(e) => handleScannedUserChange(e.target.value)}
                  />

                </div>
                <div>
                  {editableData?.statusCabinet && (
                    <div>
                      <label>สถานะตู้ยา:</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={editableData.statusCabinet}
                        onChange={(e) => handleChange("statusCabinet", e.target.value)}
                      >
                        <option value="Waiting">Waiting – รอจัดยา</option>
                        <option value="Progress">Progress – กำลังจัดยา</option>
                        <option value="Finished">Finished – จัดยาเสร็จแล้ว</option>
                        <option value="ErrorCabinet">ErrorCabinet – เกิดข้อผิดพลาดในการจัดยา</option>
                      </select>
                    </div>
                  )}

                </div>
                {(editableData?.statusnow1 === "6" || editableData?.statusnow1 === "7") && (
                  <div className="col-span-2">
                    <label>เหตุผล:</label>
                    <input className="w-full p-2 border border-gray-300 rounded-md" value={editableData?.reason || ""} onChange={(e) => handleChange("reason", e.target.value)} />
                  </div>
                )}
                {editableData?.statusCabinet === "ErrorCabinet" && (
                  <div className="col-span-2">
                    <label>ข้อผิดพลาด:</label>
                    <input className="w-full p-2 border border-gray-300 rounded-md" value={editableData?.error_message || ""} onChange={(e) => handleChange("error_message", e.target.value)} />
                  </div>
                )}
              </div>
              {/* ข้อมูลทั่วไปที่อยู่เหนือแท็บ */}
              <div className="flex items-center w-full max-w-5xl mx-auto p-2">
                {steps
                  .filter(step => {
                    if (step.statusValue === "9") {
                      return editableData?.statusnow1 === "9";
                    }
                    return true;
                  })
                  .map((step, index, arr) => {
                    const { statusValue: stepStatus, label } = step;
                    const currentStatus = editableData?.statusnow1;
                    const currentIndex = arr.findIndex(s => s.statusValue === currentStatus);
                    const stepIndex = arr.findIndex(s => s.statusValue === stepStatus);
                    const isLast = index === arr.length - 1;
                    const isStatus9 = currentStatus === "9";
                    const isActive = isStatus9 ? label === "จัดยาใหม่" : stepIndex <= currentIndex;
                    const isCurrent = isStatus9 ? label === "จัดยาใหม่" : stepIndex === currentIndex;
                    const leftLineGreen = !isStatus9 && stepIndex <= currentIndex;
                    const rightLineGreen = !isStatus9 && stepIndex < currentIndex;
                    const tooltip = step.time
                      ? step.label === "จัดยาใหม่"
                        ? `ผู้สั่งจัดยาใหม่: ${step.user || "ไม่ทราบผู้ทำ"}\n${new Date(step.time).toLocaleString("th-TH")}`
                        : `${step.user || "ไม่ทราบผู้ทำ"}\n${new Date(step.time).toLocaleString("th-TH")}`
                      : "ยังไม่มีข้อมูล";
                    return (
                      <div key={index} className="relative flex-1 flex flex-col items-center group">
                        {/* เส้นเชื่อมซ้าย */}
                        {index !== 0 && (
                          <div className={`absolute top-2.5 left-0 w-1/2 h-0.5 z-0 ${leftLineGreen ? "bg-green-500" : "bg-gray-300"}`} />
                        )}
                        {/* เส้นเชื่อมขวา */}
                        {!isLast && (
                          <div className={`absolute top-2.5 right-0 w-1/2 h-0.5 z-0 ${rightLineGreen ? "bg-green-500" : "bg-gray-300"}`} />
                        )}
                        {/* จุดสถานะ */}
                        <div className="relative z-10">
                          <div className={`w-5 h-5 rounded-full border-2 ${isActive ? "bg-green-500 border-green-500" : "bg-gray-200 border-gray-400"}`} />
                          {/* Tooltip */}
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-max bg-white shadow-md border text-sm p-2 rounded z-20 hidden group-hover:block whitespace-pre">
                            {tooltip}
                          </div>
                        </div>
                        {/* ข้อความใต้จุด */}
                        <span className={`text-sm mt-2 text-center ${isCurrent ? "text-green-600 font-semibold" : "text-gray-500"}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
              </div>

            </div>

            {/* ฝั่งขวา: รายการยา */}
            <div className="space-y-4 border-l p-3 border-gray-300 pl-4">
              <Dialog.Title className="text-2xl font-semibold mb-4 text-center relative">
                รายละเอียดรายการยา
                <button
                  ref={buttonRef1}
                  onClick={() => setShowPopup1(!showPopup1)}
                  className="ml-2 text-blue-600 hover:text-blue-800 align-middle"
                >
                  <Info size={20} />
                </button>
                {showPopup1 && (
                  <InfoPopup3
                    ref={popupRef1}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2"
                    editableData={editableData}
                  />
                )}

              </Dialog.Title>
              <div className="flex justify-between items-center">
                {/* ซ้าย: ช่องค้นหา + รายการ */}
                <div className="flex items-center gap-4 w-3/4">
                  <input
                    type="text"
                    placeholder="🔍 ค้นหาชื่อยา..."
                    className="p-2 border border-gray-300 rounded-md w-1/2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMedTableOpen((prev) => {
                    const newState = !prev;
                    if (newState) {
                      setTimeout(() => {
                        medTableRef.current?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }
                    return newState;
                  });
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded shadow font-semibold mb-2 flex justify-between items-center"
              >
                <span>
                  {isMedTableOpen
                    ? `ซ่อนรายการยา (${displayMeds.length} รายการ)`
                    : `แสดงรายการยา (${displayMeds.length} รายการ)`}
                </span>
                <span className="text-xl">
                  {isMedTableOpen ? "▲" : "▼"}
                </span>
              </button>
              {/* ตารางรายการยา */}
              {isMedTableOpen && (
                <div
                  ref={medTableRef}
                  className="rounded-md overflow-y-auto max-h-[500px] p-2"
                >
                  <table className="min-w-full table-auto border">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr>
                        <th className="border px-4 py-2 w-[80px]">รูป</th>
                        <th className="border px-4 py-2 w-[100px]">รหัสยา</th>
                        <th className="border px-4 py-2 w-[280px]">ชื่อยา</th>
                        <th className="border px-4 py-2 w-[100px]">ประเภทยา</th>
                        <th className="border px-4 py-2 w-[80px]">จำนวน</th>
                        <th className="border px-4 py-2 w-[100px]">ตู้ยา</th>
                        <th className="border px-4 py-2 w-[50px]">ตัวเลือก</th>
                      </tr>
                    </thead>
                    <tbody>

                      {displayMeds.map((med, index) => {
                        const isDeleted = med.status === "2"; // แจ้งปัญหา
                        const isCanceled = med.status === "3"; // ไม่จัดยานี้
                        const cabinets = med.medication?.CabinetMed || [];
                        const hasSelectedCabinet = med.boxcabinetName && med.cabinetName && med.row && med.slot;
                        const imagePath = med.image1 ?? med.medication?.image1 ?? null;
                        const imageUrl = imagePath ? `${baseUrlAPI}${imagePath}` : null;
                        const openMedPopup = () => {
                          setSelectedMed(med);
                          setShowMedPopup(true);
                        };

                        return (
                          <tr
                            key={index}
                            className={`cursor-pointer ${isDeleted
                              ? "border-2 border-orange-500 bg-orange-100"
                              : isCanceled
                                ? "border-2 border-red-500 bg-red-100"
                                : ""
                              }`}
                          >

                            <td className="px-4 py-2 border">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt="รูปยา"
                                  className={`w-10 h-10 object-contain rounded ${isDeleted ? "opacity-50" : "hover:scale-150 transition-transform duration-200"}`}
                                />
                              ) : "-"}
                            </td>
                            {/* <td className="border px-4 py-2" onClick={openMedPopup}>{med.medCode || "-"}</td> */}
                            <td className="border px-4 py-2" onClick={openMedPopup}>
                              {med.medCode
                                ? med.medCode.length > 10
                                  ? med.medCode.substring(0, 10) + "..."
                                  : med.medCode
                                : "-"}
                            </td>

                            {/* <td className="border px-4 py-2" onClick={openMedPopup}>{med.medName || "-"}</td> */}
                            <td className="border px-4 py-2" onClick={openMedPopup}>
                              {med.medName
                                ? med.medName.length > 10
                                  ? med.medName.substring(0, 10) + "..."
                                  : med.medName
                                : "-"}
                            </td>

                            <td className="border px-4 py-2">
                              {med.medication?.typeMed || "-"}
                            </td>
                            <td className="border px-4 py-2" onClick={openMedPopup}>{med.amoung || "-"}</td>
                            <td className="border px-4 py-2">
                              {isDeleted || isCanceled ? (
                                <span className="text-sm italic text-gray-400">
                                  {isCanceled ? "รายการถูกยกเลิก" : "รายการที่ถูกรายงานแล้ว"}
                                </span>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  {hasSelectedCabinet ? (
                                    <>
                                      <span className="text-green-700 font-semibold">
                                        {med.boxcabinetName}
                                        {med.cabinetMed?.quantity !== undefined && (
                                          <div className="text-xs text-gray-500">
                                            ยาในตู้: {med.cabinetMed.quantity}
                                          </div>
                                        )}
                                      </span>
                                      {med.CabinetMed?.quantity !== undefined && (
                                        <span className="text-xs text-gray-500">
                                          ยาในตู้: {med.CabinetMed.quantity}
                                        </span>
                                      )}
                                    </>
                                  ) : cabinets.length > 0 ? (
                                    cabinets.map((cabinet: CabinetMed, i: number) => (
                                      <div key={i} className="flex flex-col items-center">
                                        <button
                                          onClick={() => handleSelectCabinet(med.id, cabinet)}
                                          className="w-25 h-10 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md shadow flex flex-col justify-center items-center text-center"
                                        >
                                          <div className="text-sm font-semibold">{cabinet.boxcabinetName}</div>
                                          {cabinet.quantity !== undefined && (
                                            <div className="text-[12px] text-white mt-1 leading-tight">
                                              ยาในตู้: {cabinet.quantity}
                                            </div>
                                          )}
                                        </button>
                                      </div>

                                    ))
                                  ) : (
                                    <span>ไม่พบตู้ยา</span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="border px-4 py-2">
                              {med.status === "1" ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteTarget({
                                      index,
                                      id: med.id,
                                      reasons: [],
                                      note: "",
                                      med: {
                                        ...med,
                                        image1: imageUrl,
                                        cabinetMed: {
                                          ...med.cabinetMed,
                                          ipCabinet: med.cabinetMed?.ipCabinet ?? "-"
                                        }
                                      }
                                    });
                                  }}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow"
                                >
                                  แจ้งปัญหา
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const { reasons, note } = parseTextStatus(med.textstatus);

                                    setDeleteTarget({
                                      index,
                                      id: med.id,
                                      reasons,
                                      note,
                                      readonly: true,
                                      med: {
                                        ...med,
                                        image1: imageUrl,
                                        cabinetMed: {
                                          ...med.cabinetMed,
                                          ipCabinet: med.cabinetMed?.ipCabinet ?? "-"
                                        }
                                      }
                                    });
                                  }}
                                  className="bg-gray-400 text-white px-3 py-1 rounded-md shadow cursor-pointer hover:bg-gray-500"
                                >
                                  ดูปัญหา
                                </button>
                              )}
                            </td>


                          </tr>

                        );
                      })}
                      {Array.from({ length: Math.max(0, 6 - filteredMeds.length) }).map((_, index) => (
                        <tr key={`empty-${index}`}>
                          <td className="border px-4 py-2 text-center text-gray-400" colSpan={6}>
                            -
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              )}
              <div className="  items-center">
                <div>
                  <span>จัดได้: {displayMeds.filter(m => m.status === "1" || m.status === "2").length} รายการ ยกเลิก: {displayMeds.filter(m => m.status === "3").length} รายการ รวมทั้งหมด: {displayMeds.length} รายการ</span>
                </div>
              </div>
              <div className="flex justify-end gap-6 items-center">
                {/* ปุ่มจัดยาทันที */}
                <button
                  className={`px-6 py-2 rounded-md text-white ${hasUnassigned ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                  disabled={hasUnassigned}
                  onClick={async () => {
                    const updated = {
                      ...editableData,
                      statusnow1: "2",
                    };
                    setEditableData(updated);
                    await handleSaveAndPrintCustom(updated);
                  }}
                >
                  จัดยาทันที
                </button>

                {/* ปริ้นฉลากยา */}
                <label className="flex items-center gap-3 text-lg font-medium">
                  <input
                    type="checkbox"
                    checked={printLabel}
                    onChange={(e) => setPrintLabel(e.target.checked)}
                    className="w-6 h-6 accent-green-600"
                  />
                  <span>ปริ้นฉลากยา</span>
                </label>

                {/* ปริ้นใบสั่งยา */}
                <label className="flex items-center gap-3 text-lg font-medium">
                  <input
                    type="checkbox"
                    checked={printPrescription}
                    onChange={(e) => setPrintPrescription(e.target.checked)}
                    className="w-6 h-6 accent-green-600"
                  />
                  <span>ปริ้นใบสั่งยา</span>
                </label>
                {/* ปุ่มปิด */}
                <button
                  className={`px-6 py-2 rounded-md text-black ${hasUnassigned ? "bg-gray-200 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"}`}
                  disabled={hasUnassigned}
                  onClick={onClose}
                >
                  ปิด
                </button>

                {/* ปุ่มบันทึก */}
                <button
                  className={`px-6 py-2 rounded-md text-white ${hasUnassigned ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-600"}`}
                  disabled={hasUnassigned}
                  onClick={handleSaveAndPrint}
                >
                  บันทึก
                </button>

              </div>
            </div>

            {/* แสดงรูปขยาย (คงที่บนขวาของหน้าจอเสมอ) */}
            {previewImage && (
              <div
                className="fixed top-4 right-4 bg-white p-2 rounded shadow-lg border z-50"
                style={{ width: '270px', height: '270px' }}
              >
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
      {showMedPopup && selectedMed && (
        <MedInfoPopup
          open={showMedPopup}
          onClose={() => setShowMedPopup(false)}
          med={selectedMed}
          userName={user?.name}
        />

      )}
    </Dialog>
  );
}
