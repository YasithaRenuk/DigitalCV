"use client";

import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import logo from "../../../../public/DigitalCVlogoThatICrop.png";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src={logo}
            alt="DigitalCV Logo"
            width={110}
            height={40}
            priority
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {status === "authenticated" && session?.user ? (
            <>
              {/* Profile */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full border"
                  />
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-800">
                  {session.user.name}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              {/* Sign up */}
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                // onClick={() => router.push("/signup")}
                onClick={() => signIn("google")}
              >
                Sign up
              </Button>

              {/* Login */}
              <Button
                variant="outline"
                className="px-4 py-2 rounded-lg"
                onClick={() => signIn("google")}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
