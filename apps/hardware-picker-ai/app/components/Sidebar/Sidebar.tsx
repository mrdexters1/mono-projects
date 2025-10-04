"use client";

import Image from "next/image";

export default function Sidebar() {
  return (
    <>
      <span className="block uppercase tracking-wide text-sm text-primary/70 font-bold">Hardware Picker AI</span>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">
        <span className="max-w-[560px] bg-gradient-accent bg-clip-text text-transparent inline-block bg-no-repeat [background-size:100%_100%] mt-1">
          AI-powered guide to your dream computer
        </span>
      </h1>

      <div className="text-base sm:text-lg lg:text-xl text-muted-foreground mt-4">
        <p>Build your ideal PC tailored to your budget, goals, and style - in seconds.</p>
        <p>AI assistance will guide you smoothly through every step.</p>
      </div>

      <div className="relative flex justify-center lg:justify-start">
        <Image
          src="/images/mascot.png"
          alt="Hardware Picker AI Robot Assistant"
          width={400}
          height={600}
          className="relative w-full 
			max-w-[220px] sm:max-w-[280px] 
			lg:max-w-[350px] xl:max-w-[400px] 
			animate-float drop-shadow-2xl"
        />
      </div>
    </>
  );
}
