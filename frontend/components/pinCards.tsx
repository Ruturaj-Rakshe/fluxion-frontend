"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Button } from "./ui/button";
import Link from "next/link";

export function ThreeDCardDemo({children, className}: {children?: React.ReactNode, className?: string}) {
  return (
    <CardContainer className="inter-var">
      <CardBody
        className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/10 dark:bg-black dark:border-white/20 border-black/10 w-auto sm:w-120 h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white">
          Make things float in air
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Hover over this card to unleash the power of CSS perspective
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail" />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <Link href={"/previewPage"}>
            <Button variant={"outline"} size={"sm"} className="cursor-pointer bg-black text-white">Live Preview</Button>
          </Link>
          <Link href={"/cartPage"}>
            <Button variant={"outline"} size={"sm"} className="cursor-pointer bg-black text-white">Buy Now: $99</Button>
          </Link>
        </div>
      </CardBody>
    </CardContainer>
  );
}
