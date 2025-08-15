import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Upwork Apply Advisor - AI Job Post Analyzer for Freelancers",
  description:
    "Instantly analyze any Upwork job post and get AI-powered advice on whether it’s worth applying. This Chrome extension with an integrated AI Agent reviews client activity, hiring history, and engagement to help professional freelancers focus only on high-potential opportunities.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dmSans.variable}>{children}</body>
      <GoogleAnalytics gaId="G-6SJWM9XFLD" />
    </html>
  );
}
