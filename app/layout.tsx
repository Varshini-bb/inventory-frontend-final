import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NotificationBell from "@/components/NotificationBell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "Manage your inventory efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div style={{ 
          position: 'fixed', 
          top: '1rem', 
          right: '1rem', 
          zIndex: 1000 
        }}>
          <NotificationBell />
        </div>
        {children}
      </body>
    </html>
  );
}