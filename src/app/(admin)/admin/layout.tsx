import { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DigitalCV Admin – Create a Professional ATS-Friendly CV Online",
  description: "Build and store your ATS-friendly CV with DigitalCV. Easy online CV maker for job seekers in Sri Lanka and beyond.",
  applicationName: "DigitalCV",
  icons: {
    icon: "/DigitalCVlogo.png",
    shortcut: "/DigitalCVlogo.png",
    apple: "/DigitalCVlogo.png"
  }
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <SidebarProvider>
            <AppSidebar />
            <div className="bg-[#FBF2ED] w-full">
              {/* <SidebarTrigger/> */}
              {children}
            </div>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
