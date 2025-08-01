/* eslint-disable @next/next/no-img-element */
"use client";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { text } from "./page/vatext";
import { useRouter } from "next/navigation";

export default function Home() {
  const [language, setLanguage] = useState("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "th" : "en");
  };

  // ข้อมูล user ที่ฟิกไว้
  const fixedUsers = [
    { username: "TEST123456", password: "TEST123456", role: "userMedCa" },
    { username: "admin", password: "123456", role: "adminCT" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const foundUser = fixedUsers.find(
      (u) =>
        u.username.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!foundUser) {
      setErrorMessage(
        language === "en"
          ? text.login.invalidCredentials.en
          : text.login.invalidCredentials.th
      );
      return;
    }

    // เก็บ session ไว้ใน localStorage
    const now = new Date();
    const expireAt = new Date();
    expireAt.setHours(23, 59, 59, 999);

    const authData = {
      user: {
        id: 1,
        username: foundUser.username,
        role: foundUser.role,
      },
      lastActive: now.getTime(),
      expireAt: expireAt.getTime(),
    };
    localStorage.setItem("authUser", JSON.stringify(authData));

    // redirect
    router.push("/page");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100 w-full h-full">
      <div
        className="min-h-screen bg-white-100 w-full h-full p-10 bg-cover bg-center shadow-xl flex flex-col items-center justify-center"
        style={{
          backgroundImage: "url('/upload/logo.png')",
          backgroundSize: "90%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-center mb-4 ml-[400px]">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 text-blue-500 hover:underline font-semibold text-2xl"
          >
            <img
              src={`/upload/${language === "en" ? "TH.png" : "EN.png"}`}
              alt="Language Icon"
              className="w-12 h-10"
            />
            <span>{language === "en" ? "ไทย" : "EN"}</span>
          </button>
        </div>

        <div className="text-center mb-5">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-wide hover:text-blue-600 transition-colors duration-300">
            {language === "en" ? text.login.heading.en : text.login.heading.th}
          </h1>
          <h2 className="text-3xl font-medium text-gray-600 mb-6 italic tracking-wide">
            {language === "en"
              ? text.login.hospitalName.en
              : text.login.hospitalName.th}
          </h2>
        </div>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">
              {language === "en"
                ? text.login.userNameLabel.en
                : text.login.userNameLabel.th}
            </label>
            <input
              id="email"
              type="text"
              placeholder={language === "en" ? "Enter your user name" : "กรอกชื่อผู้ใช้"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">
              {language === "en"
                ? text.login.passwordLabel.en
                : text.login.passwordLabel.th}
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={language === "en" ? "Enter your password" : "กรอกรหัสผ่านของคุณ"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-2/2 right-4 transform -translate-y-7"
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-500" />
              ) : (
                <FaEye className="text-gray-500" />
              )}
            </button>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
            >
              {language === "en"
                ? text.login.buttonLabel.en
                : text.login.buttonLabel.th}
            </button>
          </div>
        </form>

        <div className="text-center mt-2 flex justify-center space-x-4">
          <div className="mt-2 text-center text-sm text-gray-600">
            <a href="/signup" className="text-blue-500 hover:underline">
              {language === "en"
                ? text.login.signUpLink.en
                : text.login.signUpLink.th}
            </a>
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 left-0 w-full text-center text-sm text-gray-400 z-50 flex items-center justify-center space-x-2">
        <img src="/upload/logo1.jpg" alt="CTECH Logo" className="h-4 w-4" />
        <span>
          Powered by <span className="font-semibold text-gray-600">CTEC Customized Technology Co. Ltd.</span>
        </span>
      </div>
    </div>
  );
}
