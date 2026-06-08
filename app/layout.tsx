import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono, DM_Serif_Display } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// Umami Cloud analytics — privacy-friendly, cookieless. Only loads when the
// website id is configured, so local/dev builds don't ping the collector.
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DisplayXR",
    template: "%s | DisplayXR",
  },
  description:
    "An open platform for spatial displays — OpenXR extension specifications, a reference runtime, and reference implementations for tracked stereo and multiview lightfield 3D displays. Build portable spatial display applications across engines, graphics APIs, and vendor hardware.",
  openGraph: {
    title: "DisplayXR",
    description:
      "OpenXR for spatial displays. An open platform — extension specifications, a reference runtime, and reference implementations — for tracked stereo and multiview 3D displays.",
    url: "https://displayxr.org",
    siteName: "DisplayXR",
    type: "website",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "DisplayXR — OpenXR for Spatial Displays",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DisplayXR",
    description:
      "OpenXR for spatial displays. An open platform — extension specifications, a reference runtime, and reference implementations — for tracked stereo and multiview 3D displays.",
    images: ["/og-image.jpeg"],
  },
  icons: {
    icon: [
      {
        url: "/icon-light.png",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.png",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${dmSerifDisplay.variable} font-sans antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        {UMAMI_WEBSITE_ID && (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id={UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
