/* eslint-disable @next/next/no-img-element */
'use client';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from 'react';
import { text } from '../page/vatext';
import Link from 'next/link';
import { baseUrlAPI } from "../ip";
import { nanoid } from 'nanoid';
export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState("en");
  const [showPassword, setShowPassword] = useState(false);
  const [rfidValue] = useState<string | null>(null);
  const [barcodeValue] = useState<string>(() => nanoid(8));
  const [qrCodeValue] = useState<string>(() => nanoid(10));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    if (password.length < 4) {
      setMessage(language === "en" ? text.signup.passwordTooShort.en : text.signup.passwordTooShort.th);
      return;
    }

    if (password !== confirmPassword) {
      setMessage(language === "en" ? text.signup.notmatch.en : text.signup.notmatch.th);
      return;
    }


    if (!firstName || !username || !gender) {
      setMessage(language === "en" ? text.signup.requiredFieldsMessage.en : text.signup.requiredFieldsMessage.th);
      return;
    }

    const genderValue = gender === "male" || gender === "ชาย" ? "MALE"
      : gender === "female" || gender === "หญิง" ? "FEMALE"
        : "";
    if (!genderValue) {
      setMessage("Invalid gender");
      return;
    }
    try {
      const res = await fetch(`${baseUrlAPI}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: firstName,
          username,
          password,
          email,
          phone,
          gender: genderValue,
          role: "waitting",
          rfid: rfidValue || nanoid(12),
          barcode: barcodeValue || nanoid(8),
          qrCode: qrCodeValue || nanoid(10),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(language === "en" ? text.signup.successMessage.en : text.signup.successMessage.th);

        //ล้างข้อมูลฟอร์ม
        setFirstName('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setEmail('');
        setPhone('');
        setGender('');
      } else {
        let errorMsg = "";

        switch (data.message) {
          case "duplicate_username":
            errorMsg = language === "en"
              ? text.signup.duplicateUsername.en
              : text.signup.duplicateUsername.th;
            break;
          case "duplicate_email":
            errorMsg = language === "en"
              ? "This email is already in use."
              : "อีเมลนี้ถูกใช้งานแล้ว";
            break;

          case "duplicate_name":
            errorMsg = language === "en"
              ? text.signup.duplicateName.en
              : text.signup.duplicateName.th;
            break;
          case "duplicate_phone":
            errorMsg = language === "en"
              ? text.signup.duplicatePhone.en
              : text.signup.duplicatePhone.th;
            break;
          case "duplicate_barcode":
            errorMsg = language === "en" ? "Barcode already used" : "บาร์โค้ดนี้มีผู้ใช้งานแล้ว";
            break;
          case "duplicate_qrcode":
            errorMsg = language === "en" ? "QR Code already used" : "QR Code นี้มีผู้ใช้งานแล้ว";
            break;
          case "duplicate_rfid":
            errorMsg = language === "en" ? "RFID already used" : "RFID นี้มีผู้ใช้งานแล้ว";
            break;

          default:
            errorMsg = language === "en"
              ? text.signup.signupFailed.en
              : text.signup.signupFailed.th;
        }

        setMessage(errorMsg); //  ย้ายมาที่นี่!

      }

    } catch (error) {
      console.error('Error:', error);
      setMessage(language === "en" ? text.signup.errorGeneric.en : text.signup.errorGeneric.th);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "th" : "en");
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div
      className="min-h-screen bg-white-100 w-full h-full p-10 bg-cover bg-center shadow-xl flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/upload/logo.png')",
        backgroundSize: "90%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex justify-between items-center w-full mb-4">
        {/* ลิงก์ไปหน้าก่อนหน้า (ซ้าย) */}
        <div></div>

        {/* ปุ่มเลือกภาษา (ขวา) */}
        <div className="text-right">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 text-blue-500 hover:underline font-medium"
          >
            <img
              src={`/upload/${language === "en" ? "TH.png" : "EN.png"}`}
              alt="Language Icon"
              className="w-8 h-5"
            />
            <span>{language === "en" ? "ไทย" : "EN"}</span>
          </button>
        </div>
      </div>

      <div className="text-center mb-5">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 tracking-wide hover:text-blue-600 transition-colors duration-300">
          {language === "en" ? text.signup.heading.en : text.signup.heading.th}
        </h1>
      </div>

      {message && <div className="text-center mb-4 text-red-500">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name & Username in one row */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-lg font-medium text-gray-700">{language === "en" ? text.signup.firstNameLabel1.en : text.signup.firstNameLabel1.th}</label>
            <input
              type="text"
              value={firstName}
              placeholder={language === "en" ? text.signup.firstNameLabel2.en : text.signup.firstNameLabel2.th}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-md"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-lg font-medium text-gray-700">{language === "en" ? text.signup.userNameLabel1.en : text.signup.userNameLabel1.th}</label>
            <input
              type="text"
              value={username}
              placeholder={language === "en" ? text.signup.userNameLabel2.en : text.signup.userNameLabel2.th}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-md"
            />
          </div>
        </div>

        {/* Password & Confirm Password in one row */}
        <div className="flex space-x-4">
          <div className="relative">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">
              {language === "en" ? text.signup.passwordLabel1.en : text.signup.passwordLabel1.th}
            </label>
            <input
              id="password1"
              type={showPassword ? "text" : "password"}
              placeholder={language === "en" ? text.signup.passwordLabel2.en : text.signup.passwordLabel2.th}
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
              {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">
              {language === "en" ? text.signup.confirmPasswordLabel1.en : text.signup.confirmPasswordLabel1.th}
            </label>
            <input
              id="password2"
              type={showPassword ? "text" : "password"}
              placeholder={language === "en" ? text.signup.confirmPasswordLabel2.en : text.signup.confirmPasswordLabel2.th}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-2/2 right-4 transform -translate-y-7"
            >
              {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
            </button>
          </div>
        </div>

        {/* Email & Phone in one row */}
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-lg font-medium text-gray-700">{language === "en" ? text.signup.emailLabel1.en : text.signup.emailLabel2.th}</label>
            <input
              type="email"
              value={email}
              placeholder={language === "en" ? text.signup.emailLabel2.en : text.signup.emailLabel2.th}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-md"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-lg font-medium text-gray-700">{language === "en" ? text.signup.phoneLabel1.en : text.signup.phoneLabel2.th}</label>
            <input
              type="tel"
              value={phone}
              placeholder={language === "en" ? text.signup.phoneLabel2.en : text.signup.phoneLabel2.th}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">{language === "en" ? text.signup.genderLabel.en : text.signup.genderLabel.th}</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="w-full p-2 bg-gray-200 rounded-md border border-gray-300 shadow-md"
          >
            <option value="">{language === "en" ? text.signup.genderLabel0.en : text.signup.genderLabel0.th}</option>
            <option value="male">{language === "en" ? text.signup.genderLabel1.en : text.signup.genderLabel1.th}</option>
            <option value="female">{language === "en" ? text.signup.genderLabel2.en : text.signup.genderLabel2.th}</option>
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </div>
        <div className="text-left">
          <Link href="/" className="text-blue-500 hover:underline">
            {language === "en" ? text.forgotPassword.backPage.en : text.forgotPassword.backPage.th}
          </Link>
        </div>
      </form>
      {/* Footer แบบติดจอ */}
      <div className="fixed bottom-2 left-0 w-full text-center text-sm text-gray-400 z-50 flex items-center justify-center space-x-2">
        <img src="/upload/logo1.jpg" alt="CTECH Logo" className="h-4 w-4" />
        <span>
          Powered by <span className="font-semibold text-gray-600">CTEC Customized Technology Co. Ltd.</span>
        </span>
      </div>
    </div>
  );
}
