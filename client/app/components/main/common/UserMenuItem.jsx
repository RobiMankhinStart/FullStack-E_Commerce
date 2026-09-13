import Link from "next/link";

export const UserMenuItem = ({ href, icon, label }) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors"
  >
    {icon}
    {label}
  </Link>
);
