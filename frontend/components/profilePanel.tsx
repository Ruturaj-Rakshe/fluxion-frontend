"use client"
import React, { useState } from "react";
import { ThreeDCardDemo } from "./pinCards";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfileSection() {
  // Example state
  const [name, setName] = useState<string>("John Doe");
  const [email, setEmail] = useState<string>("john@example.com");
  const [avatar, setAvatar] = useState<string | null>(null); // optional

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-white">Account / Profile</h2>

      {/* Name Field */}
      <div className="flex flex-col space-y-1">
        <label className="text-neutral-300 font-medium">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      {/* Email Field */}
      <div className="flex flex-col space-y-1">
        <label className="text-neutral-300 font-medium">Email</label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          type="email"
        />
      </div>

      {/* Avatar Upload (Frontend-only) */}
      <div className="flex flex-col space-y-1">
        <label className="text-neutral-300 font-medium">Avatar</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if(files && files[0]) {
                setAvatar(URL.createObjectURL(files[0]));
            }
        }}
        />
        {avatar && (
          <img
            src={avatar}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full mt-2 object-cover"
          />
        )}
      </div>

      {/* Save Button */}
      <Button
        className="mt-4 bg-[var(--accent)] hover:opacity-90"
        onClick={() => alert("Profile saved! (frontend only)")}
      >
        Save Changes
      </Button>
    </div>
  );
}
