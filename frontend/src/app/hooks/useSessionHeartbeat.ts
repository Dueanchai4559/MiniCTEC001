// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";

// export default function useSessionHeartbeat() {
//   const router = useRouter();
//   const popupRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     const checkSession = () => {
//       const raw = localStorage.getItem("authUser");
//       if (!raw) return;

//       const auth = JSON.parse(raw);
//       const now = Date.now();

//       const hasExpired = now > auth.expireAt;
//       const inactiveTooLong = now - auth.lastActive > 150 * 60 * 1000;

//       if (hasExpired || inactiveTooLong) {
//         console.warn("🔒 หมดอายุ! เคลียร์ session และ redirect");
//         localStorage.removeItem("authUser");

//         // ใช้ setTimeout เพื่อรอให้ alert ปิดก่อน redirect
//         alert("เซสชันหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่");
//         setTimeout(() => {
//           router.push("/");
//         }, 100); // หรือจะ 500ms ก็ได้
//         return;
//       }

//       // ไม่หมดอายุ → ค่อยอัปเดต
//       auth.lastActive = now;
//       localStorage.setItem("authUser", JSON.stringify(auth));
//     };

//     const events = ["mousemove", "keydown", "click", "scroll"];
//     events.forEach((e) => window.addEventListener(e, checkSession));

//     checkSession(); // ตรวจทันทีตอนโหลดหน้า

//     return () => {
//       events.forEach((e) => window.removeEventListener(e, checkSession));
//     };
//   }, [router]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(event.target as Node) &&
//         !buttonRef.current?.contains(event.target as Node)
//       ) {
//         setShowPopup(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

// }



// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";

// export default function useSessionHeartbeat() {
//   const router = useRouter();
//   const popupRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const [showPopup, setShowPopup] = useState(false);

//   useEffect(() => {
//     const checkSession = () => {
//       const raw = localStorage.getItem("authUser");
//       if (!raw) return;

//       const auth = JSON.parse(raw);
//       const now = Date.now();

//       const hasExpired = now > auth.expireAt;
//       const inactiveTooLong = now - auth.lastActive > 150 * 60 * 1000;

//       if (hasExpired || inactiveTooLong) {
//         console.warn("🔒 หมดอายุ! เคลียร์ session และ redirect");
//         localStorage.removeItem("authUser");

//         alert("เซสชันหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่");
//         setTimeout(() => {
//           router.push("/");
//         }, 100);
//         return;
//       }

//       //   ถ้ายังไม่หมดอายุ → อัปเดต
//       auth.lastActive = now;
//       localStorage.setItem("authUser", JSON.stringify(auth));

//       //   เพิ่มส่วนนี้: ตรวจ fullscreen
//       const isFullScreen =
//         document.fullscreenElement ||
//         (document as any).webkitFullscreenElement || // Safari
//         (document as any).mozFullScreenElement || // Firefox
//         (document as any).msFullscreenElement; // IE11

//       if (!isFullScreen) {
//         const el = document.documentElement;
//         if (el.requestFullscreen) {
//           el.requestFullscreen().catch((err) => {
//             console.warn("❗ ไม่สามารถเข้า fullscreen:", err);
//           });
//         } else if ((el as any).webkitRequestFullscreen) {
//           (el as any).webkitRequestFullscreen(); // Safari
//         } else if ((el as any).msRequestFullscreen) {
//           (el as any).msRequestFullscreen(); // IE11
//         }
//       }
//     };

//     const events = ["mousemove", "keydown", "click", "scroll"];
//     events.forEach((e) => window.addEventListener(e, checkSession));

//     checkSession(); // ตรวจทันทีตอนโหลดหน้า

//     return () => {
//       events.forEach((e) => window.removeEventListener(e, checkSession));
//     };
//   }, [router]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(event.target as Node) &&
//         !buttonRef.current?.contains(event.target as Node)
//       ) {
//         setShowPopup(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
// }



/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function useSessionHeartbeat() {
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const raw = localStorage.getItem("authUser");
      if (!raw) return;

      const auth = JSON.parse(raw);
      const now = Date.now();

      const hasExpired = now > auth.expireAt;
      const inactiveTooLong = now - auth.lastActive > 150 * 60 * 1000;

      if (hasExpired || inactiveTooLong) {
        console.warn("🔒 หมดอายุ! เคลียร์ session และ redirect");
        localStorage.removeItem("authUser");
        router.push("/"); // ออกจากระบบทันทีแบบเงียบ ๆ
        return;
      }

      auth.lastActive = now;
      localStorage.setItem("authUser", JSON.stringify(auth));
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, checkSession));
    checkSession(); // ตรวจทันที

    return () => {
      events.forEach((e) => window.removeEventListener(e, checkSession));
    };
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDifferentDay = (lastActive: number) => {
    const last = new Date(lastActive);
    const now = new Date();
    return (
      last.getDate() !== now.getDate() ||
      last.getMonth() !== now.getMonth() ||
      last.getFullYear() !== now.getFullYear()
    );
  };


  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    if (!raw) return;

    const auth = JSON.parse(raw);
    const now = Date.now();

    const hasExpired = now > auth.expireAt;
    const differentDay = isDifferentDay(auth.lastActive);

    if (hasExpired || differentDay) {
      localStorage.removeItem("authUser");
      router.push("/");
    }
  }, []);

  // useEffect(() => {
  //   let isRefresh = true;

  //   const beforeUnloadHandler = () => {
  //     if (!isRefresh) {
  //       //   เคลียร์ authUser เฉพาะตอนปิดแท็บจริง ๆ (ไม่ใช่ refresh)
  //       localStorage.removeItem("authUser");
  //     }
  //   };

  //   const unloadHandler = () => {
  //     isRefresh = false;
  //   };

  //   //   ถ้า visibility เปลี่ยนเป็น hidden → ถือว่า "กำลังจะออกจากหน้านี้"
  //   const visibilityHandler = () => {
  //     if (document.visibilityState === "hidden") {
  //       isRefresh = false;
  //     }
  //   };

  //   window.addEventListener("beforeunload", beforeUnloadHandler);
  //   window.addEventListener("unload", unloadHandler);
  //   document.addEventListener("visibilitychange", visibilityHandler);

  //   return () => {
  //     window.removeEventListener("beforeunload", beforeUnloadHandler);
  //     window.removeEventListener("unload", unloadHandler);
  //     document.removeEventListener("visibilitychange", visibilityHandler);
  //   };
  // }, []);

}
