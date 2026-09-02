"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Clock, Send, Sparkles } from "lucide-react";
import Input from "@/app/components/commonUI/Input";
import Button from "@/app/components/commonUI/Button";
import { toast } from "sonner";
// import { apiClient } from "@/app/lib/apiClient";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Send message to your Express backend contact endpoint
      // await apiClient.post("/contact", formData);
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (error) {
      console.error("Contact form submit error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-slate-50 min-h-screen text-slate-900">
      {/* Header Section */}
      <section className="px-6 py-16 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="max-w-3xl">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600 mb-3 flex items-center gap-2">
            <Sparkles size={16} /> Get in touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
            We’re here to help with every detail.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl font-medium">
            Whether you have a question about a product, need styling advice, or
            want to explore a collaboration, our team is ready to support you
            with expert care and fast response.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto pb-16">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Mail size={22} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              Customer care
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Need help with an order or product selection? Reach out to our
              concierge team.
            </p>
            <a
              href="mailto:hello@RoyalCart.com"
              className="font-bold text-indigo-600 hover:underline text-sm"
            >
              hello@RoyalCart.com
            </a>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Mail size={22} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              Wholesale inquiries
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Interested in stocking our latest collection? Our team would love
              to hear from you.
            </p>
            <a
              href="mailto:wholesale@RoyalCart.com"
              className="font-bold text-indigo-600 hover:underline text-sm"
            >
              wholesale@RoyalCart.com
            </a>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-shadow md:col-span-2 xl:col-span-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Clock size={22} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              Studio visits
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Book a private consultation with our design team and preview new
              arrivals in person.
            </p>
            <p className="font-bold text-slate-900 text-sm">
              Available by appointment
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Form & Location Card */}
      <section className="px-6 pb-24 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          {/* Form */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-10 shadow-xl shadow-slate-200/50">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
              Message our team
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                labelClassName="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Your full name"
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                labelClassName="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="name@domain.com"
                required
              />

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your request..."
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 active:scale-[0.99] disabled:opacity-50"
              >
                <Send size={18} />
                <span>{isSubmitting ? "Sending..." : "Send message"}</span>
              </Button>
            </form>
          </div>

          {/* Contact Details Card */}
          <div className="rounded-3xl bg-slate-950 p-8 sm:p-10 text-white shadow-2xl space-y-8">
            <div className="border-b border-slate-800 pb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-indigo-400" /> Location
              </span>
              <p className="text-xl font-black">Berlin, Germany</p>
            </div>

            <div className="border-b border-slate-800 pb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">
                <Clock size={16} className="text-indigo-400" /> Hours
              </span>
              <p className="text-sm font-medium text-slate-200">
                Monday–Friday, 9:00 AM – 6:00 PM CET
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-3">
                <Mail size={16} className="text-indigo-400" /> Stay connected
              </span>
              <div className="flex flex-col gap-2 text-sm">
                <Link
                  href="mailto:hello@RoyalCart.com"
                  className="font-bold text-white hover:text-indigo-300 transition-colors"
                >
                  hello@RoyalCart.com
                </Link>
                <Link
                  href="mailto:wholesale@RoyalCart.com"
                  className="font-bold text-white hover:text-indigo-300 transition-colors"
                >
                  wholesale@RoyalCart.com
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
