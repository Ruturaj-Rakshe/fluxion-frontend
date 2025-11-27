import { DottedGlowBackgroundDemoSecond } from "@/components/DottedBack";
import React from "react";
import { BentoGrid } from "../../../../components/Bentogrid";

export default function adminDashboard() {
  return (
    <section className="relative bg-black min-h-screen w-full flex flex-col items-center px-4 py-20">
      
      {/* HEADER */}
      <div className="relative flex items-center justify-center mb-16">
        <h1 className="py-24 text-3xl sm:text-4xl md:text-5xl text-center whitespace-nowrap lg:text-6xl font-bold text-white bbh-sans-bogle-regular">
          ADMIN DASHBOARD
        </h1>
      </div>

      {/* BENTO GRID */}
      <div className="w-full max-w-7xl">
        <BentoGrid />
      </div>
    </section>
  );
}
