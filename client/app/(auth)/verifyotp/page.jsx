"use client";

import { FiArrowRight, FiKey, FiMail } from "react-icons/fi";
import { toast } from "sonner";
import Button from "@/app/components/commonUI/Button";
import Input from "@/app/components/commonUI/Input";
import AuthShell from "@/app/(auth)/components/AuthShell";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [errors, setErrors] = useState({
    emailError: "",
    otpError: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({ emailError: "", otpError: "" });

    try {
      const response = await fetch("http://localhost:8000/auth/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          otp: formData.otp.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      const message = data.message || "Verification failed";

      if (!response.ok) {
        const normalizedMessage = message.toLowerCase();

        if (normalizedMessage.includes("email")) {
          setErrors((prev) => ({ ...prev, emailError: message }));
        }

        if (normalizedMessage.includes("otp")) {
          setErrors((prev) => ({ ...prev, otpError: message }));
        }

        toast.error(message);
        setLoading(false);
        return;
      }

      toast.success(message || "Account verified successfully");
      setLoading(false);
      setTimeout(() => router.push("/signin"), 1800);
    } catch (error) {
      toast.error("Verification failed. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!formData.email.trim()) {
      setErrors((prev) => ({ ...prev, emailError: "Email is required" }));
      toast.error("Email is required to resend the code");
      return;
    }

    setResending(true);
    try {
      const response = await fetch("http://localhost:8000/auth/resendotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email.trim() }),
      });

      const data = await response.json().catch(() => ({}));
      const message = data.message || "Unable to resend code";

      if (!response.ok) {
        toast.error(message);
        setResending(false);
        return;
      }

      toast.success(message);
      setResending(false);
    } catch (error) {
      toast.error("Unable to resend code. Please try again.");
      setResending(false);
    }
  };

  return (
    <AuthShell
      title="Verify your code"
      description="We sent a temporary verification code to your email. Enter it below to continue."
      footerText="Remembered your password?"
      footerLink="Back to sign in"
      footerHref="/signin"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<FiMail size={16} />}
          value={formData.email}
          onChange={(event) => {
            const nextValue = event.target.value;
            setFormData((prev) => ({ ...prev, email: nextValue }));
            setErrors((prev) => ({ ...prev, emailError: "" }));
          }}
          error={errors.emailError}
        />

        <Input
          label="Verification code"
          type="text"
          placeholder="Enter the code from your email"
          leftIcon={<FiKey size={16} />}
          value={formData.otp}
          onChange={(event) => {
            const nextValue = event.target.value;
            setFormData((prev) => ({ ...prev, otp: nextValue }));
            setErrors((prev) => ({ ...prev, otpError: "" }));
          }}
          error={errors.otpError}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            The code is valid for 2 minutes. Request a new one if needed.
          </div>
          <Button
            type="button"
            size="sm"
            rounded="sm"
            variant="outline"
            className="cursor-pointer"
            loading={resending}
            onClick={handleResend}
          >
            Resend Code
          </Button>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          rightIcon={<FiArrowRight size={16} />}
          className="cursor-pointer"
          loading={loading}
        >
          Verify code
        </Button>
      </form>
    </AuthShell>
  );
}
