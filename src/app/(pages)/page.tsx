'use client';

import { Button } from "@/components/ui/button";
import FeatureSection from "../components/HomePage/FeatureSection";
import Hero from "../components/HomePage/Hero";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StatsCards from "../components/HomePage/StatsCards";
import CreateDigitalCV from "../components/HomePage/CreateDigitalCV";
import HomeFooter from "../components/Layout/HomeFooter";


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
      <StatsCards/>
      <FeatureSection/>
      <CreateDigitalCV/>
      <HomeFooter/>
    </div>
  );
}