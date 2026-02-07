"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../../../public/DigitalCVlogoThatICrop.png";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="w-full">
      {/* Bottom bar */}
      <div>
        <div className="max-w-7xl mx-auto bg-gray-400 h-px" />
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center text-xs text-gray-500 gap-3 text-center">
          <p>© 2026 DigitalCV. All rights reserved.</p>

          <div className="flex gap-4">
            <Link href="/privacyPolicy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/TAC" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
