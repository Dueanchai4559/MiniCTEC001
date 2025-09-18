/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Prescription {
  id: number;
  number?: string;
  queNum?: string;
  hnCode?: string;
  anCode?: string;
  name?: string;
  Urgent?: string;

  statusnow1?: string;
  statusnow1_1?: string;
  userstatus1_1Name?: string;
  status1_1Time?: string;
  status1_1IP?: string;

  reason?: string;
  statusnow2?: string;
  statustimenow2_1?: string;

  CabinetName?: string;
  statusCabinet?: string;
  Cabinet_IP?: string;
  error_message?: string;

  gender?: string;
  dob?: string;
  cid?: string;
  heartRate?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  allprescrip: string;
  heartRateStatus?: string;
  heartRateColor?: string;

  diagnosis?: string;
  chronicDisease?: string;
  drugAllergy?: string;

  rightType?: string;
  rightTypegroup?: string;
  rightTypeCode?: string;
  patientType?: string;
  typeprescription?: string;
  ward?: string;
  HospitalName?: string;
  doctor?: string;
  department?: string;
  checkedBy?: string;

  // ผู้คัดแยก
  userstatus1Name?: string;
  status1Time?: string;
  status1IP?: string;

  // ผู้จัดยา
  userstatus21Name?: string;
  status21Time?: string;
  status21IP?: string;

  userstatus22Name?: string;
  status22Time?: string;
  status22IP?: string;

  userstatus23Name?: string;
  status23Time?: string;
  status23IP?: string;

  userstatus24Name?: string;
  status24Time?: string;
  status24IP?: string;

  userstatus25Name?: string;
  status25Time?: string;
  status25IP?: string;

  // ผู้ตรวจสอบ
  userstatus3Name?: string;
  status3Time?: string;
  status3IP?: string;

  // ผู้จ่ายยา
  userstatus4Name?: string;
  status4Time?: string;
  status4IP?: string;

  // ผู้ยกเลิก
  userstatus5Name?: string;
  status5Time?: string;
  status5IP?: string;

  // ผู้ลบทิ้ง
  userstatus6Name?: string;
  status6Time?: string;
  status6IP?: string;

  // ผู้พักตะกร้านอก
  userstatus7Name?: string;
  status7Time?: string;
  status7IP?: string;

  // ผู้พักตะกร้าในตู้
  userstatus7_1Name?: string;
  status7_1Time?: string;
  status7_1IP?: string;

  statusnow3?: string;
  statustimenow3_1?: string;

  // ผู้สั่งจัดยาใหม่
  userstatus8Name?: string;
  status8Time?: string;
  status8IP?: string;

  // ID
  userstatusAdd?: number;
  userstatus1Id?: number;
  userstatus1_1Id?: number;
  userstatus21Id?: number;
  userstatus22Id?: number;
  userstatus23Id?: number;
  userstatus24Id?: number;
  userstatus25Id?: number;
  userstatus3Id?: number;
  userstatus4Id?: number;
  userstatus5Id?: number;
  userstatus6Id?: number;
  usersId?: number;
  cabinetMedId?: number;
  wardRoomId?: number;
  // เวลา
  updatedAt: string;
  createdAt: string;
}

export interface medicationHospitals {
  [x: string]: any;
  status: string;
  cabinetMed: any;
  id: number;
  medCode?: string;
  medName?: string;
  amoung?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  package?: string;
  medStorage?: string;
  medEXP?: string;
  usageTH?: string;
  usageEN?: string;
  dosage?: string;
  time1TH?: string;
  time2TH?: string;
  time3TH?: string;
  time1EN?: string;
  time2EN?: string;
  time3EN?: string;
  warning?: string;
  advice?: string;
  price?: string;
  userAdd?: string;
  ipuser?: string;
  prescriptionId?: number;
  createdAt?: string;
  updatedAt?: string;
  medication?: Medication;
  boxcabinetName?: string;
  cabinetName?: string;
  row?: string;
  slot?: string;
  typyCabinet?: string;
  location?: string;
  cabinetMedId?: number;
}

export interface Medication {
  id: number;
  medCode?: string;
  medName?: string;
  medNameTH?: string;
  medNameEN?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  package?: string;
  medStorage?: string;
  medMax?: number;
  medeMin?: number;
  medEXP?: string;
  usageTH?: string;
  usageEN?: string;
  dosage?: string;
  time1TH?: string;
  time2TH?: string;
  time3TH?: string;
  time1EN?: string;
  time2EN?: string;
  time3EN?: string;
  warning?: string;
  advice?: string;
  price?: string;
  userAdd?: string;
  ipuser?: string;
  packageName?: string;
  CabinetMed?: CabinetMed[];
}

export interface CabinetMed {
  id: number;
  cabinetName: string;
  row: string;
  slot: string;
  typyCabinet: string;
  location: string;
  statusCabi?: string;
  medCode?: string;
  medName?: string;
  quantity?: number;
  lotNum1?: string;
  expMed1?: string;
  lotNum2?: string;
  expMed2?: string;
  barCode1?: string;
  barCode2?: string;
  maxValue?: number;
  minValue?: number;
  unit?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  ipCabinet: string;
  ipuser?: string;
  createdAt: string;
  updatedAt: string;
  boxcabinetName: string;
}

export interface EditableData {
  [x: string]: any;
  id: number;
  dob?: string;
  age?: string;
  heartRateStatus?: string;
  heartRateColor?: string;
  reason?: string;
  medications: Medication[];
  medicationHospitals: medicationHospitals[];
  number?: string;
  queNum?: string;
  hnCode?: string;
  anCode?: string;
  name?: string;
  gender?: string;
  cid?: string;
  heartRate?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  diagnosis?: string;
  chronicDisease?: string;
  drugAllergy?: string;
  rightType?: string;
  error_message?: string;
  createdAt?: string;
  statusnow1?: string;
  statusCabinet?: string;
  statusnow2?: string;
  userstatus1Name?: string;
  status1Time?: string;
  status1IP?: string;
  userstatus21Name?: string;
  status21Time?: string;
  status21IP?: string;
  userstatus22Name?: string;
  status22Time?: string;
  status22IP?: string;
  userstatus23Name?: string;
  status23Time?: string;
  status23IP?: string;
  userstatus24Name?: string;
  status24Time?: string;
  status24IP?: string;
  userstatus25Name?: string;
  status25Time?: string;
  status25IP?: string;
  userstatus3Name?: string;
  status3Time?: string;
  status3IP?: string;
  userstatus4Name?: string;
  status4Time?: string;
  status4IP?: string;
  userstatus5Name?: string;
  status5Time?: string;
  status5IP?: string;
  userstatus6Name?: string;
  status6Time?: string;
  status6IP?: string;
  // ผู้พักตะกร้านอก
  userstatus7Name?: string;
  status7Time?: string;
  status7IP?: string;
  rightTypegroup?: string;
  rightTypeCode?: string;
  patientType?: string;
  typeprescription?: string;
  ward?: string;
  HospitalName?: string;
  // ผู้พักตะกร้าในตู้
  userstatus7_1Name?: string;
  status7_1Time?: string;
  status7_1IP?: string;
  userstatus8Name?: string;
  status8Time?: string;
  status8IP?: string;
  statustimenow2_1?: string;
  Urgent?: string;
  bed?: string;
  floor?: string;
  doctor?: string;
  checkedBy?: string;
}


export interface Props {
  data: any;
  onClose: () => void;
  id: number;
}
