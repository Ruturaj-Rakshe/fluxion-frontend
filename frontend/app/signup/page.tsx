"use client"

import ButtonFooter from "@/components/ButtonFooter"
import SignupFormDemo from "@/components/SignupFormDemo"
import { useEffect } from "react";

export default function Signup() {

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      document.body.style.overflow = "hidden";   // disable scroll on laptops
    }
    return () => {
      document.body.style.overflow = "auto";     // restore on exit
    };
  }, []);

  return (
    <div
      className="
        h-screen           /* Force full height */
        lg:fixed inset-0   /* Lock on desktop */
        overflow-y-auto    /* Scroll on mobile */
        lg:overflow-hidden /* No scroll on desktop */
        bg-black 
        py-10 px-4
      "
      style={{
        backgroundImage: "url('/signupbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Left text */}
        <div className="text-white mt-6 lg:mt-0">
          <h1 className="text-2xl md:text-3xl text-center bbh-sans-bartle">
            Welcome to Fluxion!
          </h1>
          <p className="mt-12 text-neutral-300 text-4xl font-bold md:text-center zalando-sans-expanded">
            Your personal command center for everything productivity—fast, minimal, and built for creators who want control.
          </p>
          <p className="mt-12 text-neutral-300 text-4xl font-bold md:text-center zalando-sans-expanded">
            If you're returning to Fluxion, log in below to access your dashboard instantly.
          </p>
          <div className="flex justify-center mt-8">
            <ButtonFooter title="Login" href="/signin" />
          </div>
        </div>

        {/* Signup form */}
        <div className="lg:mt-0">
          <SignupFormDemo 
            EmailAddressText="Email Address"
            NameText="Name"
            PasswordText="Password"
            ButtonText="Sign Up"
            HeaderText="Create Your Account"
            TextBelowHeader="Start your free trial today. No credit card required."
            LoginText="Sign up using Google"
          />
        </div>
      </div>
    </div>
  );
}
