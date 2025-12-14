"use client"

import ButtonFooter from "@/components/ButtonFooter"
import SignupFormDemo from "@/components/SignupFormDemo"
import { Navbar } from "@/components/Navbarr"
import { Footeer } from "@/components/Footeer"
import { useEffect, useState } from "react";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import ZodSchemas from "@/lib/zodValidation";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      document.body.style.overflow = "hidden";   // disable scroll on laptops
    }
    return () => {
      document.body.style.overflow = "auto";     // restore on exit
    };
  }, []);

  const handleSignup = async (formData: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError("");

    try {
      // Added zod schema here..
      const validatedFormData = ZodSchemas.RegisterUser.safeParse(formData);
      if(!validatedFormData.success){
        return setError("Invalid signup data. Please check your inputs.");
      }
      const response = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.token) {
        router.push("/");
      }
    }  catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Failed to reset password. Please try again.");
                console.error("Reset password error:", err);
            } else {
                setError("Failed to reset password. Please try again.");
                console.error("Reset password error:", err);
            }
        
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen overflow-y-auto bg-black pt-36 pb-10 px-4"
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
            If you&apos;re returning to Fluxion, log in below to access your dashboard instantly.
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
            onSubmit={handleSignup}
            error={error}
            loading={loading}
          />
        </div>
      </div>
    </div>
    <Footeer />
  </>
  );
}
