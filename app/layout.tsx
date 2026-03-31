import type { Metadata } from "next";
import { Inter, JetBrains_Mono, DM_Serif_Display } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

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
    "An open runtime and extension stack for spatial displays, including tracked stereo and multiview lightfield 3D displays. Build portable spatial display applications across engines, graphics APIs, and vendor hardware.",
  openGraph: {
    title: "DisplayXR",
    description:
      "OpenXR for spatial displays. An open runtime and extension stack for tracked stereo and multiview 3D displays.",
    url: "https://displayxr.dev",
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
      "OpenXR for spatial displays. An open runtime and extension stack for tracked stereo and multiview 3D displays.",
    images: ["/og-image.jpeg"],
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
      </body>
    </html>
  );
}
