"use client";
import React, { useRef, useEffect } from "react";
import { TypewriterEffect } from "./ui/typewriter-effect";
import { wordsBee } from "./utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Competi() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const typeRef = useRef<any>(null);

  useEffect(() => {
    if (!sectionRef.current || !typeRef.current) return;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%", // when top of section hits 80% of viewport
      onEnter: () => {
        typeRef.current.startTyping(); // trigger typewriter
      },
    });
  }, []);

  return (
    <div className="w-full h-full relative">
      <video
        src="/videos/planets.mp4"
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />

      <section
        ref={sectionRef}
        id="inside-mask"
        className="container mx-auto absolute left-1/2 -translate-x-1/2 top-10 md:top-10 lg:top-10 z-20"
      >
        <div className="grid grid-cols-12 w-full gap-8 items-start">
          <div className="col-span-12 md:col-span-6 flex flex-col gap-5 items-center">
            <TypewriterEffect
              ref={typeRef}
              words={wordsBee}
              className="text-white text-center bbh-sans-bartle sm:text-xl md:text-2xl pt-2"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
