"use client";

import Link from "next/link";
import { FiArrowRight, FiEye, FiLock, FiMail } from "react-icons/fi";
import Button from "@/app/components/commonUI/Button";
import Input from "@/app/components/commonUI/Input";
import AuthShell from "@/app/(auth)/components/AuthShell";

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in to your account"
      description="Access your recent orders, saved addresses, and account preferences in one calm workspace."
      footerText="New here?"
      footerLink="Create account"
      footerHref="/signup"
    >
      <form className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<FiMail size={16} />}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          leftIcon={<FiLock size={16} />}
          rightIcon={<FiEye size={16} />}
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
