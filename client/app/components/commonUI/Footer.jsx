import React from "react";
import Link from "next/link";

const Footer = () => {
  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "New Arrivals", href: "/shop" },
        { name: "Collections", href: "/collections" },
        { name: "Sale", href: "/sale" },
      ],
    },
    {
      title: "Service", 
      links: [
        { name: "Shipping", href: "/shipping" },
        { name: "Returns", href: "/returns" },
        { name: "Privacy Policy", href: "/privacy" },
      ],
    },
    {
      title: "Follow",
      links: [
        { name: "Instagram", href: "#" },
        { name: "Journal", href: "#" },
        { name: "Sustainability", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter text-slate-900 block mb-6"
            >
              RoyalCart
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Defining the intersection of architecture, fashion, and digital
              commerce. Made with intention.
            </p>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} CURATOR Editorial. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link
              href="#"
              className="text-xs text-slate-400 hover:text-slate-900"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-xs text-slate-400 hover:text-slate-900"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-xs text-slate-400 hover:text-slate-900"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
