'use client';

import { Button } from "@/components/ui/button";
import FeatureSection from "../components/HomePage/FeatureSection";
import Hero from "../components/HomePage/Hero";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const onClickCreate = () => {
    if (session) {
      router.push("/createcv");
    } else {
      router.push("/loginpage");
    }
  };
  return (
    <div>
      <Hero/>
      <FeatureSection/>
      <div className="w-full flex justify-center">
        <div className="shadow-2xl w-[1183px] h-[383px] m-10 bg-white rounded-lg justify-center flex">
          <Button className="mt-64" onClick={onClickCreate}>
            Create Your CV Now!
          </Button>
        </div>
      </div>

    </div>
  );
}