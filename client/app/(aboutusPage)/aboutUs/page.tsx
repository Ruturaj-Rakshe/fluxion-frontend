"use client";

import { LampContainer } from "@/components/ui/lamp";
import { WobbleCardDemo } from "@/components/wobblyWibbly";
import { motion } from "framer-motion";

import { Navbar } from "@/components/Navbarr";
import ButtonFooter from "@/components/ButtonFooter";

export default function AboutUsPage() {
  return (
    <div className="pb-20 bg-black">
      <Navbar />
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="mt-5 bg-linear-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center bbh-sans-bartle text-xl font-medium tracking-tight text-transparent lg:text-7xl md:text-4xl"
        >
          Start smarter <br /> Build beautifully.
        </motion.h1>
 
      </LampContainer>
    
      <div className="mt-10 mb-16 w-full">
        <WobbleCardDemo />
      </div>

      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 items-start justify-center text-center px-4 gap-12 lg:text-left">
        {/* Left Column */}
        <div className="flex flex-col items-center lg:items-start space-y-6">
          <p className="bg-linear-to-b from-white bg-clip-text text-transparent text-xl font-bold sm:text-3xl bbh-sans-bartle">
            Curious to know more? Very well then
          </p>
            <ButtonFooter title="Contact Us" href="/contact"/>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center lg:items-start space-y-6">
          <p className="bg-linear-to-b from-white bg-clip-text text-transparent text-xl font-bold sm:text-3xl bbh-sans-bartle">
            All set? Let’s choose your templates.
          </p>
          <ButtonFooter title="GO!" href="/browsingPage"/>
        </div>
      </div>
    </div>
  );
}
