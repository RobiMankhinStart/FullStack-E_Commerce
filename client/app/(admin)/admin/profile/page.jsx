"use client";

import Image from "next/image";
import { useState } from "react";
import { FiBell, FiMoon, FiShield, FiSmartphone } from "react-icons/fi";
import Button from "@/app/components/commonUI/Button";
import Input from "@/app/components/commonUI/Input";
import { MOCK_ADMIN_PROFILE } from "@/app/lib/mockData";
import { useSignoutMutation } from "../../services/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const [profile, setProfile] = useState(MOCK_ADMIN_PROFILE);
  const [previewUrl, setPreviewUrl] = useState(MOCK_ADMIN_PROFILE.avatar);
  const [signout, { isLoading }] = useSignoutMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);
    setProfile((current) => ({ ...current, avatar: nextUrl }));
  };
  const router = useRouter();
  const handleSignout = async () => {
    try {
      const res = await signout().unwrap();
      toast.success(res?.message || "Signed Out Successfully");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

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
            <Image
              src={previewUrl}
              alt="Admin profile"
              width={96}
              height={96}
              unoptimized={previewUrl.startsWith("blob:")}
              className="h-24 w-24 rounded-full object-cover"
            />
            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              {profile.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{profile.role}</p>
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
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Full name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            <Input
              label="Email address"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="Enter your location"
            />
          </div>
          <div className="mt-5 flex justify-between">
            <div className="flex flex-wrap gap-3">
              <Button className="cursor-pointer" variant="primary">
                Save profile
              </Button>
              <Button className="cursor-pointer" variant="outline">
                Cancel
              </Button>
            </div>
            <Button
              onClick={handleSignout}
              className="cursor-pointer"
              variant="logout"
            >
              Sign Out
            </Button>
          </div>
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
