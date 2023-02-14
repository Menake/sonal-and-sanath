import { Arimo } from "@next/font/google";
import type { ReactElement } from "react";

const arimo = Arimo({
  subsets: ["latin"],
  variable: "--font-arimo",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen flex-col px-5 pt-3">
      <div className="z-2 flex flex-row text-2xl font-light text-[#646B61]">
        <span>Sonal</span>
        <div className="relative z-0 mt-2 -ml-0.5 text-3xl font-light opacity-40">
          &
        </div>
        <div className="-ml-0.5 mt-5">Sanath</div>
      </div>
      <div
        className={` ${arimo.variable} flex w-full flex-col px-3 font-arimo sm:items-center`}
      >
        {children}
      </div>
    </div>
  );
}
