"use client";

import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="hidden lg:block fixed right-0 top-0 h-full w-1/2 bg-gradient-hero p-8 flex flex-col justify-center">
      <div className="space-y-8">
        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
          Hardware Picker AI
          <span className="bg-gradient-accent bg-clip-text text-transparent block">
            Your Personal PC Builder Assistant
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-xl">
          Get the perfect PC build for your budget, needs, and preferences - instantly. Powered by AI to guide you
          through every step.
        </p>

        <div className="relative flex justify-center lg:justify-start">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <Image
            src="/images/mascot.png"
            alt="Hardware Picker AI Robot Assistant"
            width={400}
            height={600}
            className="relative z-10 w-full max-w-md lg:max-w-lg animate-float drop-shadow-2xl"
          />
        </div>
      </div>
    </aside>
  );
}
