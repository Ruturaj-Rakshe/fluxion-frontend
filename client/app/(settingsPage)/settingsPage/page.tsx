"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ProfileAvatarUploader } from "./utils";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbarr";
import { authAPI, orderAPI } from "@/lib/api";
import { UserProfile, UpdateProfileData } from "@/lib";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [tempValues, setTempValues] = useState<Record<string, string>>({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [emailOtp, setEmailOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showPasswordOtp, setShowPasswordOtp] = useState(false);
  const [passwordOtp, setPasswordOtp] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Helper to safely extract message from unknown errors (handles Error and axios-style responses)
  const getErrorMessage = (error: unknown, fallback = "An error occurred") => {
    if (!error) return fallback;
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    const maybeAxios = error as { response?: { data?: { message?: string } } } | undefined;
    return maybeAxios?.response?.data?.message ?? fallback;
  };

  useEffect(() => {
    fetchUserProfile();
    fetchOrderCount();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.user) {
        if (response.user && Object.keys(response.user).length > 0) {
          setProfile(response.user as UserProfile);
        } else {
          setProfile(null);
        }
      }
      setLoading(false);
    } catch (error: unknown) {
      console.error("Error fetching profile:", getErrorMessage(error));
      setLoading(false);
    }
  };

  const fetchOrderCount = async () => {
    try {
      const response = await orderAPI.getUserOrders();
      setOrderCount(response.orders?.length || 0);
    } catch (error: unknown) {
      console.error("Error fetching orders:", getErrorMessage(error));
    }
  };

  const handleSave = async (field: string) => {
    if (!profile || !tempValues[field]) return;

    // If changing email, send OTP first
    if (field === "email") {
      setUpdating(true);
      try {
        // First update the email in the backend
        const updateData: Partial<Record<keyof UpdateProfileData, string>> = {};
        const key = field as keyof UpdateProfileData;
        updateData[key] = tempValues[field];

        const response = await authAPI.updateProfile(updateData as unknown as UpdateProfileData);

        if (response.user) {
          setProfile(response.user);
          // Send OTP to new email
          await authAPI.sendVerificationEmail();
          setShowOtpInput(true);
          setEditing(null); 
          setTempValues({});
          alert("Email updated! Please check your new email for verification code.");
        }
      } catch (error: unknown) {
        console.error("Error updating email:", getErrorMessage(error));
        alert(getErrorMessage(error, "Failed to update email"));
      } finally {
        setUpdating(false);
      }
      return;
    }

    setUpdating(true);
    try {
      const updateData: Partial<UpdateProfileData> = {};
      const key = field as keyof UpdateProfileData;
      updateData[key] = tempValues[field] as unknown as UpdateProfileData[keyof UpdateProfileData];

      const response = await authAPI.updateProfile(updateData as UpdateProfileData);
      if (response.user) {
        setProfile(response.user);
      }
      setEditing(null);
      setTempValues({});
      alert("Profile updated successfully!");
    } catch (error: unknown) {
      console.error("Error updating profile:", getErrorMessage(error));
      alert(getErrorMessage(error, "Failed to update profile"));
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setUpdating(true);
    try {
      await authAPI.verifyEmail(emailOtp);
      alert("Email verified successfully!");
      setShowOtpInput(false);
      setEmailOtp("");
      setEditing(null);
      await fetchUserProfile(); // Refresh profile
    } catch (error: unknown) {
      console.error("Error verifying email:", getErrorMessage(error));
      alert(getErrorMessage(error, "Invalid OTP. Please try again."));
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Please fill all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    setUpdating(true);
    try {
      // Send OTP to email for password change verification
      await authAPI.sendPasswordChangeOtp(passwordData.currentPassword, passwordData.newPassword);
      setShowPasswordOtp(true);
      alert("OTP sent to your email! Please verify to complete password change.");
    } catch (error: unknown) {
      console.error("Error sending password change OTP:", getErrorMessage(error));
      alert(getErrorMessage(error, "Failed to send OTP. Please check your current password."));
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyPasswordOtp = async () => {
    if (!passwordOtp || passwordOtp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setUpdating(true);
    try {
      await authAPI.verifyPasswordChangeOtp(passwordOtp);
      alert("Password changed successfully!");
      setShowPasswordChange(false);
      setShowPasswordOtp(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordOtp("");
    } catch (error: unknown) {
      console.error("Error verifying password OTP:", getErrorMessage(error));
      alert(getErrorMessage(error, "Invalid OTP. Please try again."));
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="p-6 bg-black min-h-screen">
        <Navbar className="" />
        <div className="grid grid-cols-1 sm:grid-cols-2 w-full mt-24">
          <div className="pt-5">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-48 mt-2 ml-4" />
          </div>
        </div>

        <div className="mt-10 flex gap-2 justify-center">
          {/* LEFT CARD SKELETON */}
          <div className="bg-linear-to-br from-[#04071D] to-[#0C0E23] border border-white/10 h-[60vh] w-[32%] rounded-2xl">
            <Skeleton className="h-7 w-48 mx-auto mt-2.5" />
            <Skeleton className="h-4 w-32 mx-auto mt-4" />
            <div className="flex justify-center mt-8">
              <Skeleton className="w-32 h-32 rounded-full" />
            </div>
            <Skeleton className="h-3 w-56 mx-auto mt-3" />
          </div>

          {/* RIGHT CARD SKELETON */}
          <div className="bg-linear-to-br from-[#04071D] to-[#0C0E23] border border-white/10 h-[60vh] w-[64%] rounded-2xl">
            <Skeleton className="h-6 w-48 mx-auto mt-2.5" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 w-full m-4 gap-8">
              {/* COLUMN 1 SKELETON */}
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-8 w-48" />
                </div>
                <div>
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-8 w-56" />
                </div>
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-8 w-40" />
                </div>
              </div>

              {/* COLUMN 2 SKELETON */}
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <div>
                  <Skeleton className="h-5 w-28 mb-2" />
                  <Skeleton className="h-8 w-44" />
                </div>
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-8 w-36" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="p-6 bg-black min-h-screen">
        <Navbar className="" />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-red-500 text-2xl">Failed to load profile</div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 bg-black min-h-screen">
      <Navbar className="" />
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full mt-24">
        <div className="pt-5 pl-5">
          <h1 className="text-gradient text-4xl font-bold zalando-sans-expanded">
            Greetings {profile.name}!
          </h1>
          <h2 className="text-purple-300 font-bold mt-2 pl-4 zalando-sans-expanded">
            You can update your profile here
          </h2>
        </div>

        {/* <div className="flex justify-end items-center px-2">
          <div className="bg-linear-to-br from-[#04071D] to-[#0C0E23] border border-white/10 rounded-full flex items-center justify-center gap-4 px-6 py-3 min-w-[250px]">
            <Avatar>
              <AvatarImage 
                className="cursor-pointer" 
                src={profile.avatarUrl || "https://github.com/shadcn.png"} 
              />
              <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-white zalando-sans-expanded">{profile.name}</h2>
              <h3 className="text-xs font-bold text-purple-200 zalando-sans-expanded">
                {profile.role === "ADMIN" ? "Admin" : "User"}
              </h3>
            </div>
            <DropdownMenuDialog />
          </div>
        </div> */}
      </div>

      <div className="mt-10 flex gap-2 justify-center">
        {/* LEFT CARD */}
        <div className="bg-linear-to-br from-[#04071D] to-[#0C0E23] border border-white/10 h-[60vh] w-[32%] rounded-2xl">
          <h1 className="pt-2.5 text-center text-xl text-gradient zalando-sans-expanded">
            PROFILE PICTURE
          </h1>
          <h2 className="text-center text-xs mt-4 text-purple-200 font-bold zalando-sans-expanded">
            {profile.isEmailVerified ? "✓ Email Verified" : "⚠ Email Not Verified"}
          </h2>
          <ProfileAvatarUploader />
          <h3 className="text-gradient text-center text-xs mt-3 zalando-sans-expanded m-2">
            Click on the avatar to change your profile picture.
          </h3>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-linear-to-br from-[#04071D] to-[#0C0E23] border border-white/10 w-[64%] rounded-2xl pb-6">
          <h1 className="text-gradient font-bold text-lg pt-2.5 pl-3 text-center zalando-sans-expanded">
            BIO & OTHER DETAILS
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 w-full text-white m-4 gap-4">
            {/* COLUMN 1 */}
            <div>
              {/* NAME */}
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg">Name</label>
              <div className="flex gap-4">
                {editing === "name" ? (
                  <>
                    <input
                      className="bg-transparent border px-2 rounded text-white"
                      defaultValue={profile.name}
                      onChange={(e) => setTempValues({ ...tempValues, name: e.target.value })}
                    />
                    <Button 
                      className="w-20 h-8" 
                      onClick={() => handleSave("name")}
                      disabled={updating}
                    >
                      {updating ? "..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">{profile.name}</h1>
                    <Button className="w-20 h-8" onClick={() => {
                      setEditing("name");
                      setTempValues({ ...tempValues, name: profile.name });
                    }}>
                      Change
                    </Button>
                  </>
                )}
              </div>

              {/* EMAIL */}
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg mt-8 block">Email</label>
              {showOtpInput ? (
                // OTP Verification Mode
                <div className="flex gap-2 items-center flex-wrap">
                  <div className="flex gap-2 items-center w-full">
                    <input
                      className="bg-transparent border px-2 py-1 rounded text-white w-40"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                    />
                    <Button 
                      className="w-24 h-8" 
                      onClick={handleVerifyEmailOtp}
                      disabled={updating}
                    >
                      {updating ? "..." : "Verify OTP"}
                    </Button>
                    <Button 
                      className="w-20 h-8" 
                      variant="outline"
                      onClick={() => {
                        setShowOtpInput(false);
                        setEmailOtp("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <span className="text-xs text-purple-300">Check your email for the verification code</span>
                </div>
              ) : (
                <div className="flex gap-4 items-center flex-wrap">
                  {editing === "email" ? (
                    <>
                      <input
                        className="bg-transparent border px-2 rounded text-white"
                        defaultValue={profile.email}
                        onChange={(e) => setTempValues({ ...tempValues, email: e.target.value })}
                      />
                      <Button 
                        className="w-20 h-8" 
                        onClick={() => handleSave("email")}
                        disabled={updating}
                      >
                        {updating ? "..." : "Save"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">{profile.email}</h1>
                      {profile.isEmailVerified ? (
                        <span className="text-green-400 text-xs">✓ Verified</span>
                      ) : (
                        <span className="text-yellow-400 text-xs">⚠ Not Verified</span>
                      )}
                      <Button className="w-20 h-8" onClick={() => {
                        setEditing("email");
                        setTempValues({ ...tempValues, email: profile.email });
                      }}>
                        Change
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* PASSWORD */}
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg mt-8 block">Password</label>
              {showPasswordOtp ? (
                // Password OTP Verification Mode
                <div className="flex gap-2 items-center flex-wrap">
                  <div className="flex gap-2 items-center w-full">
                    <input
                      className="bg-transparent border px-2 py-1 rounded text-white w-40"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={passwordOtp}
                      onChange={(e) => setPasswordOtp(e.target.value.replace(/\D/g, ''))}
                    />
                    <Button 
                      className="w-24 h-8" 
                      onClick={handleVerifyPasswordOtp}
                      disabled={updating}
                    >
                      {updating ? "..." : "Verify OTP"}
                    </Button>
                    <Button 
                      className="w-20 h-8" 
                      variant="outline"
                      onClick={() => {
                        setShowPasswordOtp(false);
                        setPasswordOtp("");
                        setShowPasswordChange(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <span className="text-xs text-purple-300">Check your email for the verification code</span>
                </div>
              ) : (
                <div className="flex gap-4 items-center">
                  {showPasswordChange ? (
                    <div className="flex flex-col gap-2 w-full">
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          className="bg-transparent border px-2 py-1 rounded text-white w-full pr-10"
                          placeholder="Current Password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-100"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className="bg-transparent border px-2 py-1 rounded text-white w-full pr-10"
                          placeholder="New Password (min 6 chars)"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-100"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="bg-transparent border px-2 py-1 rounded text-white w-full pr-10"
                          placeholder="Confirm New Password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-100"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="w-20 h-8" 
                          onClick={handlePasswordChange}
                          disabled={updating}
                        >
                          {updating ? "..." : "Save"}
                        </Button>
                        <Button 
                          className="w-20 h-8" 
                          variant="outline"
                          onClick={() => {
                            setShowPasswordChange(false);
                            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">••••••••</h1>
                      <Button className="w-20 h-8" onClick={() => setShowPasswordChange(true)}>
                        Change
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* ORGANIZATION */}
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg mt-8 block">
                Organization
              </label>
              <div className="flex gap-4">
                {editing === "organization" ? (
                  <>
                    <input
                      className="bg-transparent border px-2 rounded text-white"
                      defaultValue={profile.organization || ""}
                      onChange={(e) => setTempValues({ ...tempValues, organization: e.target.value })}
                    />
                    <Button 
                      className="w-20 h-8" 
                      onClick={() => handleSave("organization")}
                      disabled={updating}
                    >
                      {updating ? "..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">
                      {profile.organization || "Not set"}
                    </h1>
                    <Button className="w-20 h-8" onClick={() => {
                      setEditing("organization");
                      setTempValues({ ...tempValues, organization: profile.organization || "" });
                    }}>
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
                      className="bg-transparent border px-2 rounded text-white"
                      defaultValue={profile.contactNumber || ""}
                      onChange={(e) => setTempValues({ ...tempValues, contactNumber: e.target.value })}
                    />
                    <Button 
                      className="w-20 h-8" 
                      onClick={() => handleSave("contactNumber")}
                      disabled={updating}
                    >
                      {updating ? "..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">
                      {profile.contactNumber || "Not set"}
                    </h1>
                    <Button className="w-20 h-8" onClick={() => {
                      setEditing("contactNumber");
                      setTempValues({ ...tempValues, contactNumber: profile.contactNumber || "" });
                    }}>
                      Change
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* COLUMN 2 */}
            <div>
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg">Orders</label>
              <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">{orderCount}</h1>

              <label className="zalando-sans-expanded text-gradient font-semibold text-lg mt-8 block">
                Signup Date
              </label>
              <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">
                {formatDate(profile.createdAt)}
              </h1>

              {/* ROLE */}
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg mt-8 block">
                Account Type
              </label>
              <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">
                {profile.role === "ADMIN" ? "Administrator" : "User"}
              </h1>

              {/* ADDRESS */}
              <label className="zalando-sans-expanded text-gradient font-semibold text-lg mt-8 block">
                Address/Location
              </label>
              <div className="flex gap-4">
                {editing === "address" ? (
                  <>
                    <input
                      className="bg-transparent border px-2 rounded text-white w-64"
                      defaultValue={profile.address || ""}
                      onChange={(e) => setTempValues({ ...tempValues, address: e.target.value })}
                    />
                    <Button 
                      className="w-20 h-8" 
                      onClick={() => handleSave("address")}
                      disabled={updating}
                    >
                      {updating ? "..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl bbh-sans-bogle-regular text-purple-300">
                      {profile.address || "Not set"}
                    </h1>
                    <Button className="w-20 h-8" onClick={() => {
                      setEditing("address");
                      setTempValues({ ...tempValues, address: profile.address || "" });
                    }}>
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
