"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const Page = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/createcv");
  }, [status, router]);

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-110px)] pt-10 md:pt-1">
      <div className="flex items-center justify-center w-full px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
          {/* Logo / Brand */}
          <h2 className="text-xl font-bold mb-2">
            Digital<span className="text-orange-500">CV</span>
          </h2>

          {/* Heading */}
          <h1 className="text-2xl font-semibold mt-6">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-2">
            Please sign in using your Google account
          </p>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs text-gray-400">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Button */}
          <Button
            onClick={() => signIn("google")}
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-3 border rounded-lg shadow-sm hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.67 13.21 17.91 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.1 24.55c0-1.57-.14-3.09-.39-4.55H24v9.02h12.55c-.54 2.8-2.13 5.16-4.52 6.79l7.02 5.44C43.82 37.24 46.1 31.34 46.1 24.55z"
              />
              <path
                fill="#FBBC05"
                d="M10.54 28.41c-.48-1.41-.75-2.92-.75-4.41s.27-3 .75-4.41L2.56 13.22C.91 16.59 0 20.2 0 24s.91 7.41 2.56 10.78l7.98-6.37z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.9-5.77l-7.02-5.44c-2.04 1.35-4.65 2.16-8.88 2.16-6.09 0-11.33-3.71-13.46-9.08l-7.98 6.37C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Footer */}
          <p className="text-[11px] text-gray-400 mt-8 leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
