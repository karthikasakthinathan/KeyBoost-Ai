import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const font = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
export const metadata: Metadata = { title: "KeyBoost AI", description: "AI keyword and advertising ideas for your business" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
      <body className="font-sans"><Navbar />{children}</body>
    </html>
  );
}
