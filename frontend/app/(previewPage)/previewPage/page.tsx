"use client";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbarr";

import ButtonFooter from "@/components/ButtonFooter";
import FigmaEmbed from "@/components/ui/iphoneMockup";

export default function PreviewPage() {
  return (
    <div className="bg-black min-h-dvh overflow-x-hidden">
      <Navbar />

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 px-6 lg:px-16">
        {/* Left Content */}
        <div className="mt-20 lg:mt-32">
          <h1 className="font-extrabold text-white text-3xl lg:text-5xl leading-tight bbh-sans-bartle text-center lg:text-left">
            HEADER FOR THE TEMPLATE | APP
          </h1>

          <div className="py-10 lg:py-20 max-w-3xl mx-auto space-y-6 text-center lg:text-left">
            <p className="text-base lg:text-lg text-white leading-relaxed">
              Looking to build your own multi-location grocery store app like
              <span className="font-semibold text-white"> Big Bazaar</span>,
              <span className="font-semibold text-white"> JioMart</span>,
              <span className="font-semibold text-white"> Vishal Mega Mart</span>,
              or <span className="font-semibold text-white"> Walmart Pantry</span>? 
              Then this package is for you.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <ButtonFooter title="Buy Now: $99" href="/cartPage" />
              <ButtonFooter title="Add to Cart" href="/cartPage" />
            </div>

            <div className="space-y-4 text-left text-white">
              <h2 className="text-lg lg:text-xl font-bold">
                Multi-Location Grocery Delivery System Features:
              </h2>
              <ol className="list-disc pl-6 space-y-2">
                <li>User-friendly interface</li>
                <li>Real-time order tracking</li>
                <li>Multiple payment options</li>
                <li>Admin dashboard for products and orders</li>
              </ol>

              <p>
                Perfect for grocery chains like{" "}
                <span className="font-semibold">Vishal Mega Mart</span>,{" "}
                <span className="font-semibold">Jio Mart</span>,{" "}
                <span className="font-semibold">Big Bazaar</span>, or{" "}
                <span className="font-semibold">Walmart Grocery</span>.
              </p>

              <p>
                Go online quickly and cost-effectively, saving up to{" "}
                <span className="font-semibold">70–90%</span> of development time. 
                Packages are live within{" "}
                <span className="font-semibold">4–5 working days</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side (Figma Embed) */}
        <div className="mt-12 lg:mt-0 flex justify-center items-center">
          <FigmaEmbed src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/jYREOgJvzwciYhyAg2A0qO/Untitled?page-id=0%3A1&node-id=29-2&p=f&viewport=1612%2C8600%2C0.08&t=d4LzjnueM7WcV5RG-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=29%3A2" />

        </div>
      </div>

      <Navbar />
    </div>
  );
}
