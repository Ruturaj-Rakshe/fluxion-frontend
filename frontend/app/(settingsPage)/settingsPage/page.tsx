"use client";
import { DropdownMenuDialog } from "@/components/Collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { ProfileAvatarUploader } from "./utils";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    username: "Maria Fernanda",
    email: "maria.fernanda@example.com",
    organization: "Org",
    contactNumber: "+1 802-223-1047",
    address: "1234 Main St, City, Country",
    membershipPlan: "Small User",
  });

  const [editing, setEditing] = useState<string | null>(null);

  const handleSave = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
    setEditing(null);
  };

  return (
    <section className="p-6 bg-black min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full">
        <div className="pt-5">
          <h1 className="text-gradient text-4xl font-bold zalando-sans-expanded">
            Greetings {profile.username}!
          </h1>
          <h2 className="text-purple-300 font-bold mt-2 pl-4 zalando-sans-expanded">
            You can update your profile here
          </h2>
        </div>

        <div className="flex justify-end items-center px-2">
          <div className="bg-linear-to-br from-[#04071D] to-[#0C0E23] border border-white/10 rounded-full flex items-center justify-center gap-4 px-6 py-3 min-w-[250px]">
            <Avatar>
              <AvatarImage className="cursor-pointer" src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-white zalando-sans-expanded">{profile.username}</h2>
              <h3 className="text-xs font-bold text-purple-200 zalando-sans-expanded">Subscription</h3>
            </div>
            <DropdownMenuDialog />
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-2 justify-center">
        {/* LEFT CARD */}
        <div className="bg-linear-to-br from-[#04071D] to-[#0C0E23] border border-white/10 h-[60vh] w-[32%] rounded-2xl">
          <h1 className="pt-2.5 text-center text-xl text-gradient zalando-sans-expanded">
            PROFILE PICTURE
          </h1>
          <h2 className="text-center text-xs mt-4 text-purple-200 font-bold zalando-sans-expanded">
            Small/Mini User
          </h2>
          <ProfileAvatarUploader />
          <h3 className="text-gradient text-center text-xs mt-3 zalando-sans-expanded m-2">
            Click on the avatar to change your profile picture.
          </h3>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-linear-to-br from-[#04071D] to-[#0C0E23] border border-white/10 h-[60vh] w-[64%] rounded-2xl">
          <h1 className="text-gradient font-bold text-lg pt-2.5 pl-3 text-center zalando-sans-expanded">
            BIO & OTHER DETAILS
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 w-full text-white m-4">
            {/* COLUMN 1 */}
            <div>
              {/* NAME */}
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg">Name</label>
              <div className="flex gap-4">
                {editing === "username" ? (
                  <>
                    <input
                      className="bg-transparent border px-2 rounded"
                      defaultValue={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    />
                    <Button className="w-20 h-8" onClick={() => handleSave("username", profile.username)}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">{profile.username}</h1>
                    <Button className="w-20 h-8" onClick={() => setEditing("username")}>
                      Change
                    </Button>
                  </>
                )}
              </div>

              {/* EMAIL */}
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg mt-8 block">Email</label>
              <div className="flex gap-4">
                {editing === "email" ? (
                  <>
                    <input
                      className="bg-transparent border px-2 rounded"
                      defaultValue={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                    <Button className="w-20 h-8" onClick={() => handleSave("email", profile.email)}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">{profile.email}</h1>
                    <Button className="w-20 h-8" onClick={() => setEditing("email")}>
                      Change
                    </Button>
                  </>
                )}
              </div>

              {/* ORGANIZATION */}
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg mt-8 block">
                Organization
              </label>
              <div className="flex gap-4">
                {editing === "organization" ? (
                  <>
                    <input
                      className="bg-transparent border px-2 rounded"
                      defaultValue={profile.organization}
                      onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                    />
                    <Button className="w-20 h-8" onClick={() => handleSave("organization", profile.organization)}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">{profile.organization}</h1>
                    <Button className="w-20 h-8" onClick={() => setEditing("organization")}>
                      Change
                    </Button>
                  </>
                )}
              </div>

              {/* CONTACT */}
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg mt-8 block">
                Contact Number
              </label>
              <div className="flex gap-4">
                {editing === "contactNumber" ? (
                  <>
                    <input
                      className="bg-transparent border px-2 rounded"
                      defaultValue={profile.contactNumber}
                      onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })}
                    />
                    <Button className="w-20 h-8" onClick={() => handleSave("contactNumber", profile.contactNumber)}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">{profile.contactNumber}</h1>
                    <Button className="w-20 h-8" onClick={() => setEditing("contactNumber")}>
                      Change
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* COLUMN 2 */}
            <div>
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg">Orders</label>
              <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">254</h1>

              <label className="zalando-sans-expanded text-gradient font-semibold text-lg mt-8 block">
                Signup Date
              </label>
              <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">4 April 2023</h1>

              {/* MEMBERSHIP PLAN */}
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg mt-8 block">
                Membership/Plan
              </label>
              <div className="flex gap-4">
                {editing === "membershipPlan" ? (
                  <>
                    <input
                      className="bg-transparent border px-2 rounded"
                      defaultValue={profile.membershipPlan}
                      onChange={(e) => setProfile({ ...profile, membershipPlan: e.target.value })}
                    />
                    <Button className="w-20 h-8" onClick={() => handleSave("membershipPlan", profile.membershipPlan)}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">{profile.membershipPlan}</h1>
                    <Button className="w-20 h-8" onClick={() => setEditing("membershipPlan")}>
                      Change
                    </Button>
                  </>
                )}
              </div>

              {/* ADDRESS */}
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg mt-8 block">
                Address/Location
              </label>
              <div className="flex gap-4">
                {editing === "address" ? (
                  <>
                    <input
                      className="bg-transparent border px-2 rounded"
                      defaultValue={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    />
                    <Button className="w-20 h-8" onClick={() => handleSave("address", profile.address)}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">{profile.address}</h1>
                    <Button className="w-20 h-8" onClick={() => setEditing("address")}>
                      Change
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
