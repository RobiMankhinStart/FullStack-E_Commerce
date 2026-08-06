"use client";

import { FiArrowRight, FiKey } from "react-icons/fi";
import Button from "@/app/components/commonUI/Button";
import Input from "@/app/components/commonUI/Input";
import AuthShell from "@/app/(auth)/components/AuthShell";

export default function VerifyOtpPage() {
  return (
    <AuthShell
      title="Verify your code"
      description="We sent a temporary verification code to your email. Enter it below to continue."
      footerText="Remembered your password?"
      footerLink="Back to sign in"
      footerHref="/signin"
    >
      <form className="space-y-4">
        <Input
          label="Verification code"
          type="text"
          placeholder="Enter 6-digit code"
          leftIcon={<FiKey size={16} />}
        />

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          Code expires in 10 minutes. Request a new one if needed.
        </div>

        <Button
          variant="primary"
          fullWidth
          rightIcon={<FiArrowRight size={16} />}
          className="cursor-pointer"
        >
          Verify code
        </Button>
      </form>
    </AuthShell>
  );
}
