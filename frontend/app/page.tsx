'use client';
import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
import { Competi } from '@/components/Competi';
import { AppleCardsCarouselDemo } from '@/components/AppleCards';
import { MegaButton } from '@/components/ui/megaButton';
import Accordion from '@/components/ui/Accordion';
import { PricingCard } from '@/components/ui/PricingCard';
import Approach from '@/components/CanvasDemo';
import { faqData } from '@/components/utils';
import { DottedGlowBackgroundDemoSecond } from '@/components/DottedBack';




export default function Home() {
  const [heroReady, setHeroReady] = useState(false);
  const insideMaskRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);



  useEffect(() => {
    gsap.registerPlugin(SplitText, ScrollTrigger);
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    ScrollTrigger.clearScrollMemory();
    
    const title = new SplitText(".title", { type: "chars" });
    title.chars.forEach((char) => char.classList.add("text-gradient"));

    const video = videoRef.current;
    if(!video) return;

    video.addEventListener('loadeddata', () => {
      setHeroReady(true);
      gsap.to(video, {
      currentTime: video.duration || 5, // fallback
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true
      },
    })
    })
    setTimeout(() => setHeroReady(true), 2000);



    gsap.fromTo(
      title.chars,
      { yPercent: 300, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.06,
      }
    );

    gsap.fromTo("#globeone .parallel", 
    { y: 100 }, 
    {
      y: -100,
      ease: "none",
      scrollTrigger: {
        trigger: "#globeone",
        start: "top center",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.fromTo("#globeone .text-parallax",
      { y: -100 },
      {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: "#globeone",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
      }
    );

    gsap.fromTo("#globesecond .text-parallax-second",
      { y: 300 },
      {
        y: -10,
        ease: "none",
        scrollTrigger: {
          trigger: "#globesecond",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    gsap.fromTo("#globesecond .parallel-second",
      { y: -100 },
      {
        y: 100,
        ease: "none",
        scrollTrigger: {
          trigger: "#globesecond",
          start: "top center",
          end: "bottom top",
          scrub: true
        },
      }
    );

    const maskedTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#portal',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        pin: true,
        pinSpacing: true,
      }
    });

    maskedTl.to('.masked-img', {
      scale: 1.1,
      maskPosition: 'center',
      maskSize: '400%',
      "-webkit-mask-size": '400%',
      duration: 1,
      ease: 'power1.inOut',
    });

    if (insideMaskRef.current) {
      const innerTitles = insideMaskRef.current.querySelectorAll(".title");
      maskedTl.add(() => {
        innerTitles.forEach(titleEl => {
          const split = new SplitText(titleEl, { type: "chars" });
          gsap.from(split.chars, {
            opacity: 0,
            yPercent: 150,
            duration: 1,
            ease: "expo.out",
            stagger: 0.05
          });
        });
      }, "+=1.5");
    }

    setTimeout(() => {
  ScrollTrigger.refresh();

  // Smoothly fade in the portal section after layout settles
  gsap.to("#portal", {
    opacity: 1,
    duration: 1,
    ease: "power2.out",
  });
}, 800);


  }, []);

  return (
    <div className='overflow-x-hidden'>
      {/* HERO */}
      <section id="hero" className="relative min-h-dvh w-full overflow-hidden flex flex-col justify-end bg-black">
        <div className="container mx-auto px-5 pb-20 text-center md:text-left">
          <video
          src="/videos/fluxion.mp4"
          ref={videoRef}
          muted
          autoPlay
          loop
          playsInline
          className='absolute inset-0 w-full h-full object-cover'>

          </video>
           <h1 className={`bbh-sans-bartle text-3xl md:text-7xl text-gradient title transition-opacity duration-700 ${heroReady ? "opacity-100" : "opacity-0"}`}>
              Fluxion
           </h1>
           
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-linear-to-b from-transparent via-black/50 to-black pointer-events-none z-5" />
      </section>


      

      {/* PORTAL */}

      <section className='bg-black min-h-dvh w-full'>
<section
  id="portal"
  className="opacity-0 bg-black min-h-dvh w-full grid grid-cols-1 md:grid-cols-2 items-center justify-center overflow-hidden relative"
>
  {/* Left word */}
  <div className="flex justify-center items-center h-full">
    <h1 className="bbh-sans-bartle text-white sm:text-3xl md:text-xl lg:text-2xl text-center pr-4 md:pr-12">
      Innovation
    </h1>
  </div>

  {/* Masked image in center */}
  <div className="masked-img absolute inset-0 flex justify-center items-center z-10">
    <Competi />
  </div>

  {/* Right word */}
  <div className="flex justify-center items-center h-full">
    <h1 className="bbh-sans-bartle text-white sm:text-3xl md:text-xl lg:text-2xl text-center pl-2 md:pl-6">
      Unleashed
    </h1>
  </div>
</section>
      </section>


      {/* APPLE CARDS */}
      <section className="bg-black min-h-dvh w-full flex justify-center items-center px-5 py-20">
        <AppleCardsCarouselDemo />
      </section>

      {/* BUILT TO SCALE */}
      <section className="bg-black py-20 px-6 text-center w-full">
        <h1 className=" sm:text-5xl md:text-7xl text-gradient font-bold bbh-sans-bartle mb-6">
          Built to <span className="text-purple-800">Launch.</span> Designed to <span className="text-purple-800">SCALE.</span>
        </h1>
        <p className="text-white text-sm md:text-xl max-w-3xl mx-auto">
          A snapshot of our work — from rapid MVPs to polished, market-ready products. Each project is a proof of speed, quality, and results.
        </p>
        <div className="pt-10 flex justify-center"><MegaButton /></div>
      </section>

      <div className='bg-black'>
        <h1 className='sm:text-4xl md:text-3xl lg:text-4xl bbh-sans-bartle text-center text-gradient'>Benefits of hiring us</h1>
      </div>
      

      {/* GLOBE ONE */}
      <section id="globeone" className="bg-black py-20 px-5 flex flex-col md:flex-row items-center justify-center gap-10 w-full">
        <div className="flex justify-center">
          <div className="relative overflow-hidden rounded-3xl h-[300px] md:h-[500px] w-[250px] md:w-[400px]">
            <img src="/pic1.jpg" className="parallel absolute inset-0 w-full h-full object-cover rounded-2xl" alt="Man using laptop" />
          </div>
        </div>

        <div className="text-white text-center md:text-left text-parallax space-y-6">
          <h1 className="text-xl md:text-2xl lg:text-5xl bbh-sans-bartle font-bold text-gradient">Empowering Ideas Through Code</h1>
          <p className="text-base md:text-lg max-w-md mx-auto md:mx-0">
            At Allevia Labs, we blend creativity and technology to build immersive digital experiences.
          </p>
        </div>
      </section>

      {/* GLOBE SECOND */}
      <section id="globesecond" className="bg-black py-20 px-5 flex flex-col md:flex-row-reverse items-center justify-center gap-10 w-full">
        <div className="flex justify-center">
          <div className="relative overflow-hidden rounded-3xl h-[300px] md:h-[500px] w-[250px] md:w-[400px]">
            <img src="/image2.jpg" className="parallel-second absolute inset-0 w-full h-full object-cover rounded-2xl" alt="Working" />
          </div>
        </div>

        <div className="text-gradient text-center md:text-left text-parallax-second space-y-6">
          <h1 className="text-xl md:text-2xl lg:text-5xl font-bold bbh-sans-bartle">Building the Future, One Line of Code at a Time</h1>
          <p className="text-base md:text-lg max-w-md mx-auto md:mx-0">
            We turn bold ideas into digital realities. Combining precision engineering with elegant design.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-black py-20 px-6 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="text-center md:text-left">
            <h1 className="sm:text-4xl md:text-3xl lg:text-4xl font-bold text-purple-500 mb-6 bbh-sans-bartle">Frequently Asked Questions</h1>
            <p className="text-white md:text-lg text-sm leading-relaxed">
              Find answers to common questions. Still confused? Reach out — we’re here to help!
            </p>
            <div className="pt-6 flex justify-center md:justify-start"><MegaButton /></div>
          </div>

          <div className="pt-6 md:pt-0">
            <Accordion data={faqData} />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-black py-20 px-6 text-center w-full">
        <h1 className="sm:text-3xl md:text-4xl text-gradient font-bold mb-4 bbh-sans-bartle">Feasible Plans</h1>
        <p className="text-white max-w-2xl text-sm mx-auto mb-8">
          Transparent pricing tailored to your needs. Let’s discuss your project and find a plan that works for you.
        </p>
        <PricingCard />
      </section>

      {/* APPROACH */}
      <section className="bg-black py-20 px-5 w-full">
        <h1 className="text-center text-gradient md:text-4xl sm:text-3xl font-bold mb-10 bbh-sans-bartle">Approach Towards Work</h1>
        <Approach />
        
      </section>



<section className="relative min-h-[50dvh] bg-black overflow-hidden">
  <DottedGlowBackgroundDemoSecond
    className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20"
    color="rgba(255,255,255,1)"
    glowColor="rgba(255,255,255,1)"
    backgroundOpacity={0}
    opacity={1}
    gap={12}
    radius={3.2}
    speedMin={0.3}
    speedMax={3.2}
    speedScale={1}
  />
</section>


    </div>
  );
}
