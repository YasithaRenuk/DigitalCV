import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/app/globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import Navbar from "../components/Layout/NavBar";
import Footer from "../components/Layout/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "DigitalCV – Create a Professional ATS-Friendly CV Online",
  description: "Build and store your ATS-friendly CV with DigitalCV. Easy online CV maker for job seekers in Sri Lanka and beyond.",
  keywords:["CV",'ATS CV','Digital CV','online CV maker','create CV Sri Lanka','professional CV','resume builder','job CV online','ai cv generator','cv template',' ai cv','ai cv creator'],
  metadataBase: new URL("https://digitalcv.lk/"),
  applicationName: "DigitalCV",
  openGraph:{
    title: "DigitalCV – Professional ATS-Friendly CV Maker",
    description: "Create, customize and store your professional CV online with DigitalCV. Share your resume instantly with a custom link.",
    url: "https://digitalcv.lk/",
    siteName: "DigitalCV",
    images: [
      {
        url: "https://digitalcv.lk/DigitalCVlogo.png",
        width: 1200,
        height: 630,
        alt: "DigitalCV – Online CV Maker"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true
    }
  },
  icons: {
    icon: "/DigitalCVlogo.png",
    shortcut: "/DigitalCVlogo.png",
    apple: "/DigitalCVlogo.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const isAdmin =
    typeof window !== "undefined"
      ? window.location.pathname.startsWith("/admin")
      : false;

  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <SessionProvider>
          {!isAdmin && <Navbar />}
          <div>{children}</div>
          {!isAdmin && <Footer />}
        </SessionProvider>
      </body>
    </html>
  );
}
