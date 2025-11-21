"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cardy } from "./Cardy";
import "./anoSection.css";

gsap.registerPlugin(ScrollTrigger);

export function AnoSection() {
  const container = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!container.current) return;
    const cardsEl = container.current.querySelector(".cards");
    const cards = cardRefs.current;
    if (!cardsEl) return;

    const totalScrollHeight = window.innerHeight * 3;
    const positions = [14, 38, 62, 86];
    const rotations = [-15, -7.5, 7.5, 15];

    ScrollTrigger.create({
      trigger: cardsEl,
      start: "top center",
      end: () => `+=${totalScrollHeight}`,
      pin: true,
      anticipatePin: 1
    });

    cards.forEach((card, index) => {
      if (!card) return;
      gsap.to(card, {
        left: `${positions[index]}%`,
        rotation: `${rotations[index]}deg`,
        ease: "none",
        scrollTrigger: {
          trigger: cardsEl,
          start: "top top",
          end: () => `+=${window.innerHeight}`,
          scrub: 0.5,
          id: `spread-${index}`,
        },
      });
    });

    cards.forEach((card, index) => {
      if (!card) return;
      const frontEl = card.querySelector(".flip-card-front");
      const backEl = card.querySelector(".flip-card-back");

      const staggerOffset = index * 0.05;
      const startOffset = 1 / 3 + staggerOffset;
      const endOffset = 2 / 3 + staggerOffset;

      ScrollTrigger.create({
        trigger: cardsEl,
        start: "top top",
        end: () => `+=${totalScrollHeight}`,
        scrub: 1,
        id: `rotate-flip-${index}`,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress >= startOffset && progress <= endOffset) {
            const animationProgress = (progress - startOffset) / (1 / 3);
            const frontRotation = -180 * animationProgress;
            const backRotation = 180 - 180 * animationProgress;
            const cardRotation = rotations[index] * (1 - animationProgress);

            gsap.to(frontEl, { rotateY: frontRotation, ease: "power1.out" });
            gsap.to(backEl, { rotateY: backRotation, ease: "power1.out" });
            gsap.to(card, {
              xPercent: -50,
              yPercent: -50,
              rotate: cardRotation,
              ease: "power1.out",
            });
          }
        },
      });
    });
  }, []);

  return (
    <div ref={container}>
      <section className="first">
        <h1>
          Keep Scrolling to <br /> reveal the cards
        </h1>
      </section>

      <section className="cards text-white">
        {[...Array(4)].map((_, index) => (
          <Cardy
            key={index}
            id={`card-${index + 1}`}
            frontSrc="/playing-card.png"
            backText="This is the back of card"
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
          />
        ))}
      </section>

      <section className="footer">
        <h1>Footer or upcoming section</h1>
      </section>
    </div>
  );
}
