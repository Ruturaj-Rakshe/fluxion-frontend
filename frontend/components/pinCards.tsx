"use client";

import React, { useState } from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Template } from "@/lib/index";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

interface ThreeDCardDemoProps {
  template?: Template;
  children?: React.ReactNode;
  className?: string;
}

export function ThreeDCardDemo({ template, children, className }: ThreeDCardDemoProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);

  // Fallback data for when no template is provided
  const displayData = template || {
    id: "default",
    title: "Make things float in air",
    description: "Hover over this card to unleash the power of CSS perspective",
    price: 99,
    thumbnailUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imageUrl: "",
    isActive: "ACTIVE" as const,
    createdAt: "",
    updatedAt: ""
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (displayData.id === "default") return;

    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    try {
      setAdding(true);
      await addToCart(displayData.id, 1);
      alert("Added to cart successfully!");
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      alert(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleCardClick = () => {
    if (displayData.id !== "default") {
      router.push(`/previewPage?id=${displayData.id}`);
    }
  };

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <CardContainer className="inter-var">
        <CardBody
          className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/10 dark:bg-black dark:border-white/20 border-black/10 w-auto sm:w-120 h-auto rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white">
          {displayData.title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
          {displayData.description}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src={displayData.thumbnailUrl}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt={displayData.title} />
        </CardItem>
        <div className="flex justify-between items-center mt-20">
          <Link href={`/previewPage?id=${displayData.id}`}>
            <Button variant={"outline"} size={"sm"} className="cursor-pointer bg-black text-white">Live Preview</Button>
          </Link>
          <Button 
            variant={"outline"} 
            size={"sm"} 
            className="cursor-pointer bg-black text-white"
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? "Adding..." : `Buy Now: $${displayData.price}`}
          </Button>
        </div>
      </CardBody>
    </CardContainer>
    </div>
  );
}
