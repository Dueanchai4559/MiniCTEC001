// vatext.tsx

export const text = {
  //หน้าล็อคอิน
  login: {
    heading: {
      en: "Dispensing System",
      th: "ระบบการจ่ายยา",
    },
    hospitalName: {
      en: "Hospital Name",
      th: "ชื่อโรงพยาบาล",
    },
    userNameLabel: {
      en: "User Name",
      th: "ชื่อผู้ใช้",
    },
    passwordLabel: {
      en: "Password",
      th: "รหัสผ่าน",
    },
    buttonLabel: {
      en: "Log in",
      th: "เข้าสู่ระบบ",
    },
    forgotPasswordLink: {
      en: "Forgot your password?",
      th: "ลืมรหัสผ่าน?",
    },
    signUpLink: {
      en: "Sign up",
      th: "สมัครบัญชีผู้ใช้งาน",
    },
    invalidCredentials: {
      en: "Invalid email or password",
      th: "ข้อมูลไม่ถูกต้อง",
    },
    fetchFailed: {
      en: "Failed to fetch users",
      th: "ไม่สามารถดึงข้อมูลผู้ใช้ได้",
    },
    roleNotAllowed: {
      en: "Your account is not authorized to access the system.",
      th: "บัญชีของคุณยังไม่ได้รับสิทธิ์เข้าใช้งานระบบ",
    },
  },
  //หน้าลืมรหัสผ่าน
  forgotPassword: {
    heading: {
      en: "Forgot Password",
      th: "ลืมรหัสผ่าน",
    },
    emailLabel1: {
      en: "Email",
      th: "อีเมล",
    },
    emailLabel2: {
      en: "Enter Email",
      th: "กรอกอีเมล",
    },
    buttonLabel: {
      en: "Send Reset Link",
      th: "ส่งลิงก์รีเซ็ตรหัสผ่าน",
    },
    successMessage: {
      en: "Reset link has been sent to your email",
      th: "ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของคุณ",
    },
    errorMessage: {
      en: "Failed to send reset email",
      th: "ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้",
    },
    backPage: {
      en: "Login Page",
      th: "หน้าเข้าสู่ระบบ",
    },


  },
  //หน้าสมัคร
  signup: {
    heading: {
      en: "Sign Up",
      th: "สมัครสมาชิก",
    },
    firstNameLabel1: {
      en: "First-LastName",
      th: "ชื่อ-นามสกุล",
    },
    firstNameLabel2: {
      en: "Enter Firs-LastName",
      th: "กรอกชื่อ-นามสกุล ",
    },
    userNameLabel1: {
      en: "User Name",
      th: "ชื่อผู้ใช้",
    },
    userNameLabel2: {
      en: "Enter User Name",
      th: "กรอกชื่อผู้ใช้",
    },

    passwordLabel1: {
      en: "Password",
      th: "รหัสผ่าน",
    },
    passwordLabel2: {
      en: "Enter password",
      th: "กรอกรหัสผ่าน",
    },
    confirmPasswordLabel1: {
      en: "Confirm Password",
      th: "ยืนยันรหัสผ่าน",
    },
    confirmPasswordLabel2: {
      en: "Enter Confirm Password",
      th: "กรอกยืนยันรหัสผ่าน",
    },
    emailLabel1: {
      en: "Email (optional)",
      th: "อีเมล (ไม่จำเป็น)",
    },
    emailLabel2: {
      en: "Enter Email ",
      th: "กรอกอีเมล ",
    },
    phoneLabel1: {
      en: "Phone (optional)",
      th: "เบอร์โทร (ไม่จำเป็น)",
    },
    phoneLabel2: {
      en: "Enter Phone ",
      th: "กรอกเบอร์โทร ",
    },
    genderLabel: {
      en: "Gender",
      th: "เพศ",
    },
    genderLabel0: {
      en: "Select Gender",
      th: "เลือกเพศ",
    },
    genderLabel1: {
      en: "MALE",
      th: "ผู้ชาย",
    },
    genderLabel2: {
      en: "FEMALE",
      th: "ผู้หญิง",
    },
    submitButtonLabel: {
      en: "Sign Up",
      th: "สมัครสมาชิก",
    },
    successMessage: {
      en: "Account created successfully!",
      th: "สร้างบัญชีผู้ใช้สำเร็จ!",
    },
    errorMessage: {
      en: "Something went wrong. Please try again.",
      th: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง.",
    },
    notmatch: {
      en: "Passwords do not match",
      th: "รหัสผ่านไม่ตรงกัน",
    },
    requiredFieldsMessage: {
      en: "Please fill in all required fields.",
      th: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
    },
    passwordTooShort: {
      en: "Password must be at least 4 characters",
      th: "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร",
    },
    errorGeneric: {
      en: "Something went wrong. Please try again.",
      th: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    },
    signupFailed: {
      en: "Signup failed!",
      th: "สมัครสมาชิกไม่สำเร็จ!",
    },
    duplicateUsername: {
      en: "Username already exists.",
      th: "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว",
    },
    duplicateEmail: {
      en: "Email already exists.",
      th: "อีเมลนี้ถูกใช้ไปแล้ว",
    },
    duplicateName: {
      en: "Name already exists.",
      th: "ชื่อ-นามสกุลนี้ถูกใช้ไปแล้ว",
    },
    duplicatePhone: {
      en: "Phone number already exists.",
      th: "เบอร์โทรนี้ถูกใช้ไปแล้ว",
    },
  },
  //หน้าพักตะกร้า
  basketPage: {
    heading: {
      en: "Paused Prescriptions (Outside Cabinet)",
      th: "ใบสั่งยาที่พักนอกตู้",
    },
    searchPlaceholder: {
      en: "Search prescription...",
      th: "ค้นหาใบสั่งยา...",
    },
    searchButton: {
      en: "Search",
      th: "ค้นหา",
    },
    noData: {
      en: "No prescriptions in basket.",
      th: "ไม่มีใบสั่งยาพักไว้",
    },
    continueButton: {
      en: "Continue",
      th: "ทำงานต่อ",
    },
    deleteButton: {
      en: "Delete",
      th: "ลบ",
    },
    confirmDelete: {
      en: "Are you sure you want to delete this prescription?",
      th: "คุณแน่ใจหรือไม่ว่าจะลบใบสั่งยานี้?",
    },
    greeting: {
      en: "Hello,",
      th: "สวัสดี คุณ",
    }
  },
  //หน้าเลือก1
  chooseRole: {
    heading: {
      en: "Choose Your Role",
      th: "เลือกหน้าที่จะทำงาน",
    },
    description: {
      en: "Please select which module you want to access.",
      th: "กรุณาเลือกว่าจะไปทำงานส่วนไหน",
    },
    menuItems: [
      {
        title: { en: "Dispense", th: "จัดยา" },
      },
      {
        title: { en: "Refill", th: "เติมยา" },
      },
      {
        title: { en: "Cabinet", th: "ตู้ยา" },
      },
      {
        title: { en: "Settings", th: "ตั้งค่า" },
      },
    ],
  },
  //หน้าเลือก2
  chooseRole2: {
    heading: {
      en: "Choose an option",
      th: "เลือกรายการที่ต้องการ",
    },
    description: {
      en: "Please select which module you want to access.",
      th: "กรุณาเลือกว่าจะไปทำงานส่วนไหน",
    },
    menuItems: [
      {
        title: { en: "Dispense", th: "จัดยา" },
        image: "/upload/dispensary.png",
        route: "/page/dispense",
      },
      {
        title: { en: "Register", th: "ลงทะเบียน" },
        image: "/upload/card-games.png",
        route: "/page/register",
      },
      {
        title: { en: "Cabinet", th: "ตู้ยา" },
        image: "/upload/vending.png",
        route: "/page/cabinet",
      },
      {
        title: { en: "Settings", th: "ตั้งค่า" },
        image: "/upload/settings.png",
        route: "/page/settings",
      },
    ],
  },
};


//หน้าหลัก
//หน้ากราฟ
//หน้าตั้งค่า
//หน้ารายงาน
//หน้าคัดเเยก
//หน้าจัดยา
//หน้ารอตรวจสอบ
//หน้าตรวจสอบสำเร็จ
//หน้าจ่ายยา
//หน้ายกเลิก
//หน้าใบสั่งยาทั้งหมด
//หน้าตู้ยา
//หน้ายา
//หน้าตรวจความพร้อม
//หน้ากล้อง
//หน้าเเจ้งเตือน
//หน้าโปรไฟล์