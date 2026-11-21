import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Footer from "@/components/Footer";
import RegisterSW from "@/components/RegisterSW";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#1ea7ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: { default: "CleanersMarketplace — Find Work. Find Cleaners. Connect.", template: "%s | CleanersMarketplace" },
  description: "Connecting cleaning professionals with people and businesses that need cleaning services. Post a job and get a fair price from your room photos in seconds.",
  keywords: ["cleaning", "cleaner", "marketplace", "AI pricing", "escrow", "domestic cleaning", "UK"],
  authors: [{ name: "CleanersMarketplace" }],
  creator: "CleanersMarketplace",
  applicationName: "CleanersMarketplace",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL("https://cleanersmarketplace.co.uk"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://cleanersmarketplace.co.uk",
    siteName: "CleanersMarketplace",
    title: "CleanersMarketplace — Find Work. Find Cleaners. Connect.",
    description: "Connecting cleaning professionals with people and businesses that need cleaning services. Post a job and get a fair price from your room photos in seconds.",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "CleanersMarketplace" }],
  },
  twitter: {
    card: "summary",
    title: "CleanersMarketplace — Find Work. Find Cleaners. Connect.",
    description: "Connecting cleaning professionals with people and businesses that need cleaning services. Post a job and get a fair price from your room photos in seconds.",
    images: ["/icons/icon-512.png"],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/icons/icon-512.png" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CleanersMarketplace",
    startupImage: "/icons/icon-512.png",
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Footer />
        </Providers>
        <RegisterSW />
      </body>
    </html>
  );
}
