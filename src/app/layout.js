import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://electrohub.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ElectroHub - Premium Electronics Store in Bangladesh",
    template: "%s | ElectroHub",
  },
  description:
    "Bangladesh's #1 online electronics store. Shop premium headphones, cameras, monitors, GPUs, and accessories at unbeatable prices with free shipping over ৳5,000.",
  keywords: [
    "electronics store Bangladesh",
    "buy electronics online",
    "headphones BD",
    "cameras Bangladesh",
    "monitors Dhaka",
    "GPU Bangladesh",
    "gaming accessories",
    "tech gadgets",
    "ElectroHub",
    "online shopping Bangladesh",
  ],
  authors: [{ name: "ElectroHub" }],
  creator: "ElectroHub",
  publisher: "ElectroHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: siteUrl,
    siteName: "ElectroHub",
    title: "ElectroHub - Premium Electronics Store in Bangladesh",
    description:
      "Bangladesh's #1 online electronics store. Shop premium headphones, cameras, monitors, GPUs, and accessories at unbeatable prices.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ElectroHub - Premium Electronics Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ElectroHub - Premium Electronics Store",
    description:
      "Shop premium electronics at unbeatable prices. Free shipping over ৳5,000!",
    images: ["/og-image.png"],
    creator: "@electrohub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
