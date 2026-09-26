import localFont from "next/font/local";
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
  metadataBase: new URL("https://YOURDOMAIN.com"),

  title: {
    default: "ComputerHub | Computers, Laptops & Technology",
    template: "%s | ComputerHub",
  },

  description:
    "ComputerHub is a technology marketplace for laptops, desktops, PC components, monitors, accessories and gaming products.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "ComputerHub",
    description:
      "Technology Marketplace for laptops, desktops and gaming products.",
    url: "https://YOURDOMAIN.com",
    siteName: "ComputerHub",
    type: "website",
    images: ["/og-image.jpg"],
  },

  twitter: {
    card: "summary_large_image",
    title: "ComputerHub",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <WishlistProvider>
            <Navbar />

            <main>{children}</main>

            <Footer />

            <Toaster
              position="top-right"
              richColors
              closeButton
            />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}