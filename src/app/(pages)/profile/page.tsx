"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/loginpage");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Static data for demo
  const username = "gimhan";
  const pin = "1***9";
  const profileStrength = "100%";
  const daysLeft = 179;

  const email = session?.user?.email || "gimhanpabasara4@gmail.com";
  const profilePic = session?.user?.image || null;
  const name = session?.user?.name;

  const onClick = (topic:string) => { 
    router.push("/contactus?reasonTopic="+topic);
  };

  return (
    <div className="min-h-[calc(100vh-150px)] flex flex-col items-center py-6 px-4 md:px-10">
      {/* User Info Card */}
      <div className="p-6 flex flex-col md:flex-row w-full md:w-[70%] justify-between items-start bg-white shadow rounded-lg">
        {/* Left Side: Avatar + User Details */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-5 w-full md:w-auto">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-orange-200 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
            {profilePic ? (
              <img src={profilePic} alt="Profile Pic" className="w-full h-full object-cover" />
            ) : (
              "😺"
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 flex flex-col gap-1 md:gap-2 mt-2 md:mt-0 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:gap-2 justify-center md:justify-start">
              <h2 className="text-xl md:text-2xl font-semibold">{name}</h2>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border mt-1 md:mt-0">Membership</span>
            </div>
            <p className="text-gray-500">{email}</p>
            <p className="mt-2">
              Profile Strength:{" "}
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md">{profileStrength}</span>
            </p>
          </div>
        </div>

        {/* Right Side: Username, PIN, Days Left */}
        <div className="mt-4 md:mt-0 text-center md:text-right w-full md:w-auto">
          <p className="text-gray-700">
            username: <span className="font-medium">{username}</span> | PIN: <span className="font-medium">{pin}</span>
          </p>
          <p className="mt-1 text-yellow-700 font-medium">{daysLeft} days left</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 w-full md:w-[70%]">
        <Button variant="outline" className="flex-1 border border-primary bg-white hover:bg-primary hover:text-white h-56 md:h-72" onClick={() => onClick("Change username and PIN")}>
          Change username & PIN
        </Button>
        <Button className="flex-1 border border-primary bg-white hover:bg-primary hover:text-white h-56 md:h-72" onClick={() => onClick("Report an issue on Your CV")}>
          Report an issue on Your CV
        </Button>
        <Button className="flex-1 border border-primary bg-white hover:bg-primary hover:text-white h-56 md:h-72" onClick={() => onClick("Extend membership")}>
          Extend membership
        </Button>
      </div>

      {/* Logout Button */}
      <div className="mt-6 w-full md:w-[70%] flex justify-end">
        <Button
          onClick={() => signOut()}
          className="border border-red-400 text-red-600 bg-white hover:bg-red-50 px-6 py-2"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
