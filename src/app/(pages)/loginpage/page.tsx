"use client"

import Image from "next/image"
import LoginPage from "../../components/LoginPage/LoginPage"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/createcv");
    }
  }, [status, router]);

  return (
    <div className="flex flex-col md:flex-row h-screen pt-10 md:pt-1">
      {/* Left Section (30%) */}
      <div className="md:w-[30%] w-full h-full relative">
        <Image
          src="https://picsum.photos/300/400"
          alt="sideImg"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Section (70%) */}
      <div className="md:w-[70%] w-full flex items-center justify-center">
        <LoginPage/>
      </div>
    </div>
  )
}

export default Page
