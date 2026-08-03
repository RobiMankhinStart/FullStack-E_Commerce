"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Target,
  HeartHandshake,
  Compass,
  ShieldCheck,
  Globe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Button from "@/app/components/commonUI/Button";

const AboutPage = () => {
  return (
    <main className="bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Section */}
      <section className="px-6 py-16 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="max-w-3xl">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600 mb-3 flex items-center gap-2">
            <Sparkles size={16} /> About RoyalCart
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
            Modern editorial design for meaningful living.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl font-medium">
            RoyalCart creates immersive product experiences for people who seek
            clarity, craft, and elegant simplicity. We blend architectural
            precision, thoughtful materials, and thoughtful curation to deliver
            elevated essentials for everyone.
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="px-6 pb-16 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Mission Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Target size={22} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Our Mission
            </p>
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              Design with intention.
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              We help discerning creators shape their spaces with thoughtful
              objects, premium materials, and editorial storytelling that feels
              both timeless and contemporary.
            </p>
          </div>

          {/* Values Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <HeartHandshake size={22} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Our Values
            </p>
            <ul className="space-y-3 mt-4 text-sm font-semibold text-slate-800">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                <span>Quality over quantity.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                <span>Precision in every detail.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-indigo-600 shrink-0" />
                <span>Story-led product curation.</span>
              </li>
            </ul>
          </div>

          {/* Approach Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Compass size={22} />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Our Approach
            </p>
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              Enduring style.
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              From concept to collection, each item is selected to feel
              effortless, structured, and meaningful. We partner with makers and
              designers who share our dedication to enduring style.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="px-6 pb-24 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 sm:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 block">
                Why RoyalCart
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 leading-tight">
                Thoughtful products for intentional spaces.
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8 text-base">
                We believe every object should have purpose. Whether it’s a
                tailored overcoat, a sculptural home accent, or a daily carry
                essential, our collections are designed to bring calm, clarity,
                and craft into modern living.
              </p>

              <Link href="/contact" passHref legacyBehavior>
                <Button
                  size="lg"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 active:scale-[0.99]"
                >
                  <span>Contact our team</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6">
              {/* Premium Curation */}
              <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center mb-4">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-black">Premium curation</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Each launch is curated to complement the way you live, work,
                  and collect.
                </p>
              </div>

              {/* Global Sourcing */}
              <div className="rounded-3xl bg-slate-100/80 border border-slate-200 p-8 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center mb-4 shadow-sm">
                  <Globe size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Global sourcing
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  We source from makers around the world, prioritizing quality
                  materials and responsible craft.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
