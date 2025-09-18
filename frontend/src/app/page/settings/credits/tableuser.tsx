/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";

const technologies = [
  {
    name: "React",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    url: "https://reactjs.org",
  },
  {
    name: "Next.js",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg",
    url: "https://nextjs.org",
  },
  {
    name: "Tailwind CSS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
    url: "https://tailwindcss.com",
  },
  {
    name: "Prisma",
    logo: "https://avatars.githubusercontent.com/u/17219288?s=200&v=4",
    url: "https://www.prisma.io",
  },
  {
    name: "TypeScript",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
    url: "https://www.typescriptlang.org",
  },
  {
    name: "ECharts",
    logo: "https://echarts.apache.org/zh/images/logo.png",
    url: "https://echarts.apache.org/",
  },
  {
    name: "Express",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png",
    url: "https://expressjs.com/",
  },
  {
    name: "Multer",
    logo: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
    url: "https://github.com/expressjs/multer",
  },
  {
    name: "Lucide React",
    logo: "https://lucide.dev/logo.light.svg",
    url: "https://lucide.dev/",
  },
  {
    name: "React Slick",
    logo: "https://avatars.githubusercontent.com/u/12292014?s=200&v=4",
    url: "https://react-slick.neostack.com/",
  }, {
    name: "PostgreSQL",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg",
    url: "https://www.postgresql.org/",
  },

  {
    name: "xlsx",
    logo: "https://sheetjs.com/sketch128.png",
    url: "https://sheetjs.com/",
  },
  {
    name: "Cloudflare Tunnel",
    logo: "https://avatars.githubusercontent.com/u/314135?s=200&v=4",
    url: "https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/",
  },
  {
    name: "Flaticon",
    logo: "data:image/png;base64,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",
    url: "https://www.flaticon.com/",
  },
  {
    name: "NextUI",
    logo: "https://avatars.githubusercontent.com/u/101346705?s=200&v=4",
    url: "https://nextui.org/",
  },
  {
    name: "และอื่น ๆ อีกมากมาย...",
    logo: "https://cdn-icons-png.flaticon.com/512/1828/1828961.png", // ไอคอนแบบทั่วไป
    url: "#",
  },
];

export default function TechnologyCredits() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        เทคโนโลยีที่ใช้ในระบบนี้
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {technologies.map((tech) => (
          <a
            key={tech.name}
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 border rounded hover:shadow-lg transition"
          >
            <img
              src={tech.logo}
              alt={tech.name}
              className="w-16 h-16 object-contain"
            />
            <span className="text-center font-medium text-gray-700">
              {tech.name}
            </span>
          </a>
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} พัฒนาและดูแลระบบโดย <b>SALMON DT</b> |
        หากต้องการติดต่อสอบถามหรือเสนอแนะเพิ่มเติม
        กรุณาส่งอีเมลมาที่{" "}
        <a
          href="https://mail.google.com/mail/?view=cm&to=salmon4559@gmail.com&su=ติดต่อมาจากโปรแกรม CTEC"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          salmon4559@gmail.com
        </a>
        โดยระบุหัวข้อว่า <b>&quot;ติดต่อมาจากโปรแกรม CTEC&quot;</b>
      </p>

    </div>
  );
}
