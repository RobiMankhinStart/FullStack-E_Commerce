"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const BreadCrumb = ({ items }) => {
  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 text-xs font-medium uppercase tracking-widest"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={item.name} className="flex items-center space-x-2">
            <ChevronRight size={14} className="text-slate-300" />
            {index === items.length - 1 ? (
              <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest cursor-default">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-slate-400 hover:text-indigo-600 transition-colors text-xs font-medium uppercase tracking-widest"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
