"use client";
import React from "react";

interface FigmaEmbedProps {
  src: string;
}

const FigmaEmbed: React.FC<FigmaEmbedProps> = ({ src }) => {
  return (
    <div className="w-full flex justify-center px-2 sm:px-4">
      <div className="relative w-full max-w-[900px] aspect-9/16 sm:max-w-[600px] md:max-w-[800px] lg:max-w-[900px]">
        <iframe
          src={src}
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0 rounded-xl"
          style={{
            transform: "scale(0.9)",
            transformOrigin: "center",
          }}
        />
      </div>
    </div>
  );
};

export default FigmaEmbed;
