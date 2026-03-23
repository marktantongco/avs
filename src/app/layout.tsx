import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "AVS — AI Visual Synthesis",
  description: "AI Visual Synthesis - Build perfect prompts for Midjourney, FLUX, DALL-E and more. No blank inputs. Every tap produces output.",
  keywords: ["AI", "Midjourney", "FLUX", "DALL-E", "prompt builder", "image generation", "Stable Diffusion", "Ideogram"],
  authors: [{ name: "AVS Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AVS — AI Visual Synthesis",
    description: "Build perfect prompts for AI image generation",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${barlow.variable} ${barlowCondensed.variable} ${spaceMono.variable} antialiased bg-[#0A0A0A] text-[#F5F5F5] overflow-hidden font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
