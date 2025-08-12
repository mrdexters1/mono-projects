import { Button } from "@ui";

export const Hero = () => {
  return (
    <section className="relative flex items-center justify-center">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left animate-fade-in">
            <h1 className="heading-1 mb-6 animate-in fade-in zoom-in">
              Discover the
              <span>Top Performing</span>
              Crypto Tokens
            </h1>

            <p className="body-large mb-8 max-w-lg">
              Stay ahead of the market with real-time cryptocurrency prices, trending tokens, and comprehensive market
              analytics. Your gateway to profitable crypto investments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button className="btn-hero text-lg px-8 py-6">View Tokens Now</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
