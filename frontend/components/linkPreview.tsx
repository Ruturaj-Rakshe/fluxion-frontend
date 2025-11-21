"use client";
import React from "react";
import { LinkPreview } from "@/components/ui/link-preview";

export function LinkPreviewDemoSecond() {
  return (
    <div className="flex justify-center items-start h-[40rem] flex-col px-4">
      <p
        className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl  text-left mb-10">
        Visit{" "}
        <LinkPreview
          isStatic
          imageSrc="/aboutUs.png"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500">
          Aceternity UI
        </LinkPreview>{" "}
        and for amazing Tailwind and Framer Motion components.
      </p>
      <p
        className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl  text-left ">
        I listen to{" "}
        <LinkPreview
          imageSrc="/aboutUs.png"
          isStatic
          className="font-bold">
          this guy
        </LinkPreview>{" "}
        and I watch{" "}
        <LinkPreview
          url="/templates"
          imageSrc="/contact.png"
          isStatic
          className="font-bold">
          this movie
        </LinkPreview>{" "}
        twice a day
      </p>
    </div>
  );
}
