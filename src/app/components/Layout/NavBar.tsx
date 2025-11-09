'use client';

import Image from "next/image";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full shadow-md shadow-primary left-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          {/* <Image src="/logo.png" alt="DigitalCV Logo" width={40} height={40} /> */}
          <span className="text-xl font-bold">
            DigitalCV
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {status === "authenticated" && session?.user ? (
            <div className="flex items-center space-x-3">
              <span className="text-gray-800 dark:text-gray-200">
                {session.user.name}
              </span>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="rounded-full border border-gray-300"
                />
              )}
              <Button
                onClick={() => signOut()}
                className="px-4 py-2"
                variant="outline"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => signIn("google")}
              className="px-4 py-2"
            >
              Log In
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-primary"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700">
          <div className="flex flex-col items-start px-4 py-3 space-y-3">
            {status === "authenticated" && session?.user ? (
              <>
                <div className="flex items-center space-x-3">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="rounded-full border border-gray-300"
                    />
                  )}
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {session.user.name}
                  </span>
                </div>
                <Button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2"
                  variant="outline"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => signIn("google")}
                className="w-full text-left px-4 py-2 "
              >
                Log In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
