import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RoyalCart | Modern  Essentials",
  description:
    "A meticulously modern selection of human needs and editorial-grade apparel for the modern observer.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased suppressHydrationWarning`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
