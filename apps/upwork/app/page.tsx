import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui";
import { BarChart3, CheckCircle, Chrome, Code2, Zap } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-6">
          <Zap className="h-4 w-4" />
          Chrome Extension + Next.js API
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Upwork Apply Advisor - AI Job Post Analyzer for Freelancers
        </h1>
        <p className="text-xl text-muted-foreground mb-2 max-w-3xl mx-auto">
          Instantly analyze any Upwork job post and get AI-powered advice on whether it’s worth applying. This Chrome
          extension with an integrated AI Agent reviews client activity, hiring history, and engagement to help
          professional freelancers focus only on high-potential opportunities.
        </p>
        <div className="inline-flex items-center mb-8 max-w-3xl mx-auto">
          <Image
            src="/next.svg"
            alt="Upwork Apply Advisor - AI Job Post Analyzer for Freelancers"
            width={16}
            height={16}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="gap-2"
          >
            <Chrome className="h-5 w-5" />
            Install Extension
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <Code2 className="h-5 w-5" />
            View Documentation
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Card className="p-6">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Smart Analysis</CardTitle>
            <CardDescription>
              Advanced feature engineering and scoring algorithms predict your reply success rate
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-6">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Chrome className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-lg">Browser Extension</CardTitle>
            <CardDescription>Seamless integration with Upwork - analyze jobs without leaving the page</CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-6">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <CardTitle className="text-lg">Actionable Tips</CardTitle>
            <CardDescription>
              Get specific recommendations to improve your profile and proposal strategy
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="mb-16">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            Technical Implementation
          </CardTitle>
          <CardDescription>Production-ready architecture with modern web technologies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Chrome Extension (MV3)</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Shadow DOM</Badge>
                <Badge variant="secondary">Content Scripts</Badge>
                <Badge variant="secondary">esbuild</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Resilient DOM extraction with fallback selectors</li>
                <li>• Isolated Shadow DOM UI panel</li>
                <li>• Real-time analysis on Upwork pages</li>
                <li>• Professional floating interface</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Next.js API Server</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Next.js 14</Badge>
                <Badge variant="secondary">App Router</Badge>
                <Badge variant="secondary">Zod Validation</Badge>
                <Badge variant="secondary">TypeScript</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Feature engineering and scoring algorithms</li>
                <li>• Profile ingestion and job matching</li>
                <li>• CORS-enabled API endpoints</li>
                <li>• Deterministic tip generation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
