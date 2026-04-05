import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/components/CartDrawer";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ErrorMonitor } from "@/components/ErrorMonitor";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Headless Store",
  description: "Modern headless WooCommerce store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ErrorBoundary>
          <Providers>
            <Header variant="dark" />
            {children}
            <Footer />
            <CartDrawer />
            <Toaster position="top-right" />
            <ErrorMonitor />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
