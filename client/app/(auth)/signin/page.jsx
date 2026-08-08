"use client";

import Link from "next/link";
import { FiArrowRight, FiEye, FiLock, FiMail, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";

import Button from "@/app/components/commonUI/Button";
import Input from "@/app/components/commonUI/Input";
import AuthShell from "@/app/(auth)/components/AuthShell";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
  });
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({
      emailError: "",
      passwordError: "",
    });
    try {
      const res = await fetch("http://localhost:8000/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.message || "Signin failed";
        const updatedMessage = message.toLowerCase();
        if (
          updatedMessage.includes("email") ||
          updatedMessage.includes("does not exist") ||
          updatedMessage.includes("Please verify")
        ) {
          setErrors((prev) => ({
            ...prev,
            emailError: message,
          }));
        }
        if (
          updatedMessage.includes("Password ") ||
          updatedMessage.includes("Wrong")
        ) {
          setErrors((prev) => ({
            ...prev,
            passwordError: message,
          }));
        }
        toast.error(message);
        setLoading(false);
        return;
      }

      toast.success("Signin successfull, welcome");
      setLoading(false);
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (error) {
      console.log(error.message);
      toast.error("Signin failed. Please try again.");
      setLoading(false);
    }
  };
  return (
    <AuthShell
      title="Sign in to your account"
      description="Access your recent orders, saved addresses, and account preferences in one calm workspace."
      footerText="New here?"
      footerLink="Create account"
      footerHref="/signup"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email address"
          type="text"
          value={userData.email}
          placeholder="you@example.com"
          leftIcon={<FiMail size={16} />}
          onChange={(e) => {
            const nextValue = e.target.value;
            setUserData((prev) => ({ ...prev, email: nextValue }));
            setErrors((prev) => ({ ...prev, emailError: "" }));
          }}
          error={errors?.emailError}
        />
        <Input
          value={userData.password}
          label="Password"
          type={showPass ? "text" : "password"}
          placeholder="Enter your password"
          leftIcon={<FiLock size={16} />}
          rightIcon={
            showPass ? (
              <FiEyeOff className="cursor-pointer" size={16} />
            ) : (
              <FiEye className="cursor-pointer" size={16} />
            )
          }
          rightIconAction={() => setShowPass((prev) => !prev)}
          onChange={(e) => {
            const nextValue = e.target.value;
            setUserData((prev) => ({ ...prev, password: nextValue }));
            setErrors((prev) => ({ ...prev, passwordError: "" }));
          }}
          error={errors?.passwordError}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-500">
            <input
              type="checkbox"
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Remember me
          </label>
          <Link
            href="/verifyotp"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          loading={loading}
          type="submit"
          variant="primary"
          fullWidth
          className="mt-2 cursor-pointer"
          rightIcon={<FiArrowRight size={16} />}
        >
          Continue
        </Button>
      </form>
    </AuthShell>
  );
}
