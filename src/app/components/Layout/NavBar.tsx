"use client";

import Image from "next/image";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import logo from "../../../../public/DigitalCVlogoThatICrop.png"

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();

  const handleClickProfile = () => {
    router.push("/profile");
  };

  const handleLogin = async () => {
    try {
      setLoginLoading(true);
      // you can add callbackUrl if you want
      await signIn("google");
    } finally {
      // usually redirect happens before this runs, but it's safe to keep
      setLoginLoading(false);
    }
  };

  return (
    <nav className="w-full shadow-md shadow-primary left-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="/">
          {/* <div className="flex items-center space-x-2"> */}
            <Image src={logo} alt="DigitalCV Logo" width={100} height={100} />
            {/* <span className="text-xl font-bold">DigitalCV</span> */}
          {/* </div> */}
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {status === "authenticated" && session?.user ? (
            <div className="flex items-center space-x-3">
              <span
                className="text-gray-800 dark:text-gray-200 cursor-pointer"
                onClick={handleClickProfile}
              >
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
              onClick={handleLogin}
              className="px-4 py-2"
              disabled={loginLoading || status === "loading"}
            >
              {loginLoading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-t-transparent border-current animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Log In"
              )}
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
                  <span
                    className="text-gray-800 dark:text-gray-200 font-medium cursor-pointer"
                    onClick={handleClickProfile}
                  >
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
                onClick={handleLogin}
                className="w-full text-left px-4 py-2"
                disabled={loginLoading || status === "loading"}
              >
                {loginLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-t-transparent border-current animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Log In"
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}