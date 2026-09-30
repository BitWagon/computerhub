import localFont from "next/font/local";
import PWARegister from "@/components/PWARegister";
import "./globals.css";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000"
  ),

  title: {
    default: "ComputerHub",
    template: "%s | ComputerHub",
  },

  description:
    "ComputerHub - Buy and sell computers, laptops, gaming PCs and accessories.",

  keywords: [
    "ComputerHub",
    "Laptop",
    "Gaming PC",
    "Computer Store",
    "Electronics",
    "Pakistan",
  ],

  authors: [
    {
      name: "ComputerHub",
    },
  ],

  creator: "ComputerHub",

  applicationName: "ComputerHub",

  openGraph: {
    title: "ComputerHub",
    description:
      "Buy and sell computers, laptops and accessories.",

    url:
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000",

    siteName: "ComputerHub",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "ComputerHub",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "ComputerHub",

    description:
      "Buy and sell computers, laptops and accessories.",

    images: ["/icons/icon-512.png"],
  },

  icons: {
    icon: "/icons/icon-192.png",

    apple:
      "/icons/apple-touch-icon.png",

    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
  <meta name="theme-color" content="#2563eb" />

  <meta
    name="apple-mobile-web-app-capable"
    content="yes"
  />

  <meta
    name="apple-mobile-web-app-status-bar-style"
    content="default"
  />

  <link rel="manifest" href="/manifest.webmanifest" />
</head>
      <body
  className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 text-gray-900 antialiased`}
>
        <CartProvider>
  <WishlistProvider>
    <Navbar />

    <main>{children}</main>

    <Footer />

    <PWARegister />

    <Toaster
  position="top-right"
  richColors
  closeButton
  expand
  duration={3000}
/>
  </WishlistProvider>
</CartProvider>
      </body>
    </html>
  );
}