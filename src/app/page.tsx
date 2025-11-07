'use client';

import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import Hero from "./components/HomePage/Hero";
import FeatureSection from "./components/HomePage/FeatureSection";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div>
      <Hero/>
      <FeatureSection/>
    </div>
  );
}