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
  title: "Popular Cryptocurrencies and Tokens Today, Prices, Rankings and Trends",
  description:
    "View today’s top cryptocurrencies and tokens. Get real-time prices, 24-hour changes, market capitalization and live rankings.",
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
    <html
      lang="en"
      className="dark"
    >
      <body className={dmSans.variable}>{children}</body>
    </html>
  );
}
