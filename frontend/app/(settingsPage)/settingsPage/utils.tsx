"use client";
import { useState } from "react";
import Image from "next/image";

export function ProfileAvatarUploader() {
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    const reader = new FileReader(); //Reading the file selected by the user
    reader.onloadend = () => setProfilePic(reader.result as string); //onloadend event triggers after reading is complete
    reader.readAsDataURL(file); //Convert the file to base64 string
  };

  return (
    <label className="cursor-pointer block">
      <div className="rounded-full w-20 h-20 sm:w-28 sm:h-28 md:w-50 md:h-50 lg:w-70 lg:h-70 xl:w-70 xl:h-70 mx-auto mt-6 border border-purple-500 overflow-hidden flex items-center justify-center">
        {profilePic ? (
          <Image src={profilePic} alt="Profile Pic" className="w-full h-full object-cover" />
        ) : (
            <Image
              src="/test duck.jpg"
              alt=""
              width={300}
              height={300}
              className="w-full h-full object-cover">

            </Image>
        )}
      </div>

      <input
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={handleProfilePicChange}
      />
    </label>
  );
}
