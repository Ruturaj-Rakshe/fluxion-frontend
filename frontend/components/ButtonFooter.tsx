"use client";
import Link from "next/link";
import React from "react";

interface ButtonProps {
  title: string;
  href: string;
}

const ButtonFooter = ({ title, href }: ButtonProps) => {
  return (
    <Link
      href={href}
      className="relative flex items-center justify-between h-11 px-4 pr-12 bg-white text-black font-bold text-[16px] rounded-xl shadow-[inset_0_0_1.6em_-0.6em_#714da6] overflow-hidden cursor-pointer transition-all duration-300 group w-fit md:w-auto max-w-[200px] sm:max-w-[180px]"
    >
      {title}

      {/* Icon container */}
      <div className="absolute right-1 flex items-center justify-center h-8 w-8 bg-white rounded-lg shadow-[0.1em_0.1em_0.6em_0.2em_#7b52b9] transition-all duration-300 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
        <svg
          height={24}
          width={24}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="text-black font-bold w-5 transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            fill="currentColor"
          />
        </svg>
      </div>
    </Link>
  );
};

export default ButtonFooter;
