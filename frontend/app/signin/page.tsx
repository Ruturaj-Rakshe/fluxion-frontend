"use client"

import ButtonFooter from "@/components/ButtonFooter"
import SignupFormDemo from "@/components/SignupFormDemo"
import { useState } from "react";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import ZodSchemas from "@/lib/zodValidation";

export default function Signin() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignin = async (formData: { email: string; password: string }) => {
        setLoading(true);
        setError("");

        try {
            const validatedFormData = ZodSchemas.LoginUser.safeParse(formData);
            if(!validatedFormData.success){
                return setError("Invalid signin data. Please check your inputs.");
            }
            const response = await authAPI.signin({
                email: formData.email,
                password: formData.password,
            });

            if(response.user) {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "Signin failed. Please try again.");
            console.error("Signin error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black min-h-screen min-w-dvh py-20 px-4 flex items-center" 
            style={{ backgroundImage: "url('/signupbg.jpg')", backgroundSize: "cover", backgroundPosition: "center"  }}
        > 
            <div className="top-1 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                
                {/* Left Section */}
                <div className="order-1 lg:order-0 text-white mt-6 lg:mt-10">
                    
                    <h1 className="text-2xl md:text-3xl text-center text-nowrap bbh-sans-bartle">
                        Welcome Back!
                    </h1>

                    <p className="mt-12 text-left text-neutral-300 text-4xl font-bold md:text-center sm:text-center zalando-sans-expanded">
                        Log in to your personal command center—fast, minimal, and built for creators to stay fully in control.
                    </p>

                    <p className="mt-12 text-left text-neutral-300 text-4xl font-bold md:text-center sm:text-center zalando-sans-expanded">
                        Access your dashboard instantly and pick up right where you left off.
                    </p>

                    <div className="flex justify-center mt-8">
                        <ButtonFooter title="Sign Up" href="/signup"/>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="-mt-9 lg:-mt-12">
                    <SignupFormDemo 
                        EmailAddressText="Email Address" 
                        PasswordText="Password" 
                        ButtonText="Sign In" 
                        HeaderText="Welcome Back" 
                        TextBelowHeader="Glad to have you back" 
                        LoginText="Sign in using Google"
                        onSubmit={handleSignin}
                        error={error}
                        loading={loading}
                    />
                </div>

            </div>
        </div>
    )
}
