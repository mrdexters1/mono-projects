import { Button } from "@ui";

export const Hero = () => {
  const partnerLogos = [
    { name: "Binance", logo: "BIN" },
    { name: "Coinbase", logo: "CB" },
    { name: "KuCoin", logo: "KC" },
    { name: "Kraken", logo: "KR" },
    { name: "Huobi", logo: "HB" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-48 h-48 bg-primary-glow/10 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center md:text-left animate-fade-in">
            <h1 className="heading-1 mb-6">
              Discover the
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Top Performing </span>
              Crypto Tokens
            </h1>

            <p className="body-large mb-8 max-w-lg">
              Stay ahead of the market with real-time cryptocurrency prices, trending tokens, and comprehensive market
              analytics. Your gateway to profitable crypto investments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button className="btn-hero text-lg px-8 py-6">View Tokens Now</Button>

              <Button
                variant="outline"
                className="glass-card border-glass-border hover:bg-glass-background text-text-primary px-8 py-6"
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="flex justify-center animate-fade-in-delay-2">
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-primary rounded-full opacity-20 animate-pulse-glow"></div>
              <div
                className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-secondary rounded-full opacity-30 animate-pulse-glow"
                style={{ animationDelay: "1s" }}
              ></div>
              <div className="absolute top-1/2 -right-12 w-8 h-8 bg-success rounded-full opacity-40 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="container mx-auto px-4 pb-8">
          <div className="text-center animate-fade-in-delay-3">
            <p className="text-text-secondary text-sm mb-6">Trusted by traders on leading exchanges</p>

            <div className="flex justify-center items-center space-x-8 opacity-60">
              {partnerLogos.map((partner) => (
                <div
                  key={partner.name}
                  className="glass-card px-4 py-2 rounded-lg hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="text-text-secondary font-semibold text-sm">{partner.logo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
