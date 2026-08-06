"use client";

import { toast } from "sonner";
import { FiArrowRight, FiEye, FiLock, FiMail, FiUser } from "react-icons/fi";
import Button from "@/app/components/commonUI/Button";
import Input from "@/app/components/commonUI/Input";
import AuthShell from "@/app/(auth)/components/AuthShell";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
  });

  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({
      nameError: "",
      emailError: "",
      passwordError: "",
    });

    try {
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data.message || "Signup failed";

        if (message === "Name is required") {
          setErrors((prev) => ({
            ...prev,
            nameError: message,
          }));
        }

        if (message === "Email is required") {
          setErrors((prev) => ({
            ...prev,
            emailError: message,
          }));
        }

        if (message === "Password is required") {
          setErrors((prev) => ({
            ...prev,
            passwordError: message,
          }));
        }

        toast.error(message);
        setLoading(false);
        return;
      }

      toast.success("Signup successful. Redirecting to verification...");
      setLoading(false);
      setTimeout(() => {
        router.push("/verifyotp");
      }, 2400);
    } catch (error) {
      console.log(error.message);

      toast.error("Signup failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create a fresh account"
      description="Start shopping with a tailored experience and keep your account details organized from day one."
      footerText="Already have an account?"
      footerLink="Sign in"
      footerHref="/signin"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Full name"
          type="text"
          placeholder="Ava Carter"
          leftIcon={<FiUser size={16} />}
          value={userData.fullname}
          onChange={(e) => {
            setUserData((prev) => ({ ...prev, fullname: e.target.value }));
            setErrors((prev) => ({ ...prev, nameError: "" }));
          }}
          error={errors?.nameError}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="ava@example.com"
          leftIcon={<FiMail size={16} />}
          value={userData.email}
          onChange={(e) => {
            setUserData((prev) => ({ ...prev, email: e.target.value }));
            setErrors((prev) => ({ ...prev, emailError: "" }));
          }}
          error={errors?.emailError}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          leftIcon={<FiLock size={16} />}
          rightIcon={<FiEye size={16} />}
          value={userData.password}
          onChange={(e) => {
            setUserData((prev) => ({ ...prev, password: e.target.value }));
            setErrors((prev) => ({ ...prev, passwordError: "" }));
          }}
          error={errors?.passwordError}
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          By creating an account, you agree to our terms and privacy policy.
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          rightIcon={<FiArrowRight size={20} />}
          className="cursor-pointer"
          loading={loading}
        >
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
