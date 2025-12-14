"use client";

import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center  px-4 text-center">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl font-semibold">Login To Your Account</h1>
        {/* <p className="text-gray-500 text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis.
        </p> */}

        <Button
          onClick={() => signIn("google")}
          variant="outline"
          className="w-full border mt-2.5 mb-2.5 h-12 text-gray-700 shadow-sm flex items-center justify-center gap-2 py-5 rounded-lg"
        >
          <svg className="w-16 h-16" viewBox="0 0 48 48">
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

        <p className="text-[10px] text-gray-400 mt-10 leading-relaxed">
          By continuing, you agree to emergent Terms of Service and Privacy
          Policy. This site is protected by reCAPTCHA Enterprise and the Google
          Privacy Policy and Terms of Service apply.
        </p>
      </div>
    </div>
  );
}
