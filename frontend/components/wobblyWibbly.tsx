"use client";

import React from "react";
import { WobbleCard } from "./ui/wobble-card";

export function WobbleCardDemo() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-blue-500 min-h-[500px] lg:min-h-[300px]"
        className="">
        <div className="max-w-xs text-center">
          <h2
            className="text-left text-balance text-base md:text-xl lg:text-3xl bbh-sans-bartle font-semibold tracking-[-0.015em] text-white">
            Fluxion, powering the entire universe
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
            We are a team of developers and designers on a mission to make app creation faster and easier. With high-quality, ready-to-use templates, we empower creators to focus on innovation, not setup.
          </p>
        </div>
        {/* <img
          src="/eddd.jpg"
          width={300}
          height={200}
          alt="Eddy"
          className="absolute -right-4 lg:-right-[40%] -bottom-10 object-contain rounded-2xl" /> */}
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h1
          className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white bbh-sans-bartle">
        No messy code, no partial designs, no wasted time.
        </h1>
        <p className="mt-4 max-w-104 text-left  text-base/6 text-neutral-200">
          When a creator needs support, we step in — helping them build without hurdles.
        </p>
      </WobbleCard>
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-3 bg-green-500 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2
            className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white bbh-sans-bartle">
            Get busy for blazing-fast cutting-edge state of the art templates
            today!
          </h2>
          <p className="mt-4 max-w-104 text-left  text-base/6 text-neutral-200">
            With over 100,000 monthly active bot users, Fluxion is the most
            popular template selector for developers.
          </p>
        </div>
      </WobbleCard>
    </div>
  );
}
