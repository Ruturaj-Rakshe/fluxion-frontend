"use client";
import { MegaButton } from "@/components/ui/megaButton";
import SignupFormDemo from "../../../components/signup-form-demo";
import Accordion from "@/components/ui/Accordion";
import { faqData } from "@/components/utils";
import { Navbar } from "@/components/Navbarr";

export default function ContactPage() {
  return <div className="min-h-screen items-center justify-center bg-black">
    <Navbar />
    <div className="flex items-center justify-center pt-20">
      <SignupFormDemo />
    </div>
    
    <div>
      <section className="bg-black items-center justify-center py-20 px-6 w-full">
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
    </div>
    
  </div>
}