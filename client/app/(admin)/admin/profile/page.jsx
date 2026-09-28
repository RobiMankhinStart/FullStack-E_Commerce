"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiLoader,
  FiMoon,
  FiShield,
  FiSmartphone,
  FiUser,
} from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import Button from "@/app/components/commonUI/Button";
import Input from "@/app/components/commonUI/Input";
import {
  useSignoutMutation,
  useGetAdminProfileQuery,
  useUpdateProfileMutation,
} from "../../services/api";

const settingsSections = [
  {
    title: "Notifications",
    description:
      "Stay on top of orders, low stock alerts and customer messages.",
    icon: FiBell,
  },
  {
    title: "Appearance",
    description: "Switch between a calm workspace and a more focused display.",
    icon: FiMoon,
  },
  {
    title: "Security",
    description: "Ensure the right roles and permissions are always in place.",
    icon: FiShield,
  },
  {
    title: "Mobile",
    description:
      "Use the same tools while keeping an eye on operations on the go.",
    icon: FiSmartphone,
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    role: "admin",
    avatar: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const {
    data: profileResponse,
    isLoading: isFetchingProfile,
    isError,
    error: fetchError,
  } = useGetAdminProfileQuery();

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [signout, { isLoading: isSigningOut }] = useSignoutMutation();

  useEffect(() => {
    if (profileResponse) {
      const user = profileResponse?.data || profileResponse || {};

      setProfile({
        fullname: user.fullname || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || "admin",
        avatar: user.avatar || "",
      });
      setPreviewUrl(user.avatar || "");
    }
  }, [profileResponse]);

  useEffect(() => {
    if (isError) {
      console.error("Failed to fetch profile:", fetchError);
      toast.error("Could not load your admin profile.");

      if (fetchError?.status === 401) {
        router.push("/signin");
      }
    }
  }, [isError, fetchError, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB.");
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setPreviewUrl(nextUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("fullname", profile.fullname);
    formData.append("phone", profile.phone || "");
    formData.append("address", profile.address || "");

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await updateProfile(formData).unwrap();
      const updatedUser = response?.data || response || {};

      if (updatedUser) {
        setProfile((prev) => ({
          ...prev,
          fullname: updatedUser.fullname || prev.fullname,
          phone: updatedUser.phone || prev.phone,
          address: updatedUser.address || prev.address,
          avatar: updatedUser.avatar || prev.avatar,
        }));
        setPreviewUrl(updatedUser.avatar || previewUrl);
        setAvatarFile(null);

        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to update profile. Please try again.",
      );
    }
  };

  const handleSignout = async () => {
    try {
      const res = await signout().unwrap();
      toast.success(res?.message || "Signed out successfully");
      setTimeout(() => router.push("/signin"), 800);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  if (isFetchingProfile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <FiLoader className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">
            Settings
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">
            Manage your admin profile
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Update contact details, photo, and account basics from one simple
            panel.
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              <div className="relative h-24 w-24 overflow-hidden rounded-full bg-slate-100 ring-4 ring-slate-50 shadow-inner">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Admin profile"
                    fill
                    sizes="96px"
                    unoptimized={previewUrl.startsWith("blob:")}
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                    <FiUser className="h-10 w-10" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <span className="text-sm font-semibold text-white">Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              {profile.fullname || "Admin User"}
            </h3>
            <p className="mt-1 text-sm capitalize text-slate-500">
              {profile.role || "admin"}
            </p>

            <div className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
              <p className="text-sm font-semibold text-slate-700">
                Change photo
              </p>
              <p className="mt-1 text-sm text-slate-500">
                PNG, JPG, or WebP files are accepted.
              </p>
              <Input
                type="file"
                accept="image/*"
                className="mt-3"
                onChange={handlePhotoChange}
              />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <Input
              label="Full name"
              name="fullname"
              value={profile.fullname}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            <Input
              label="Email address"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled
            />
            <Input
              label="Phone number"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
            <Input
              label="Current living place"
              name="address"
              value={profile.address}
              onChange={handleChange}
              placeholder="Enter your location"
            />

            <div className="md:col-span-2 mt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  className="cursor-pointer"
                  variant="primary"
                  loading={isUpdating}
                >
                  Save profile
                </Button>
                <Button
                  type="button"
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    setPreviewUrl(profile.avatar || "");
                    setAvatarFile(null);
                  }}
                >
                  Cancel
                </Button>
              </div>

              <Button
                type="button"
                onClick={handleSignout}
                className="cursor-pointer"
                variant="logout"
                loading={isSigningOut}
              >
                Sign Out
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {settingsSections.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-50 p-2 text-indigo-700">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-5">
                Manage
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
