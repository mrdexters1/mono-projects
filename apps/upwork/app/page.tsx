import { Badge, Button, Card, CardDescription, CardHeader, CardTitle } from "@ui";
import ContactForm from "@upwork/components/ContactForm";
import { BarChart3, CheckCircle, Chrome, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col gap-[32px] justify-center items-center  max-w-4xl mx-auto pr-5 pl-5 pt-10 pb-10">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-full text-xs font-medium text-primary mb-2">
          <Zap className="h-4 w-4" />
          Chrome Extension + Smart AI
        </div>
        <h1 className="text-2xl font-bold mb-6 purple heading">Upwork AI Job Analyzer for Freelancers</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Instantly analyze any Upwork job post and get AI-powered advice on whether it’s worth applying. This Chrome
          extension with an integrated AI Agent reviews client activity, hiring history, engagement and much more to
          help freelancers focus only on high-potential opportunities.
        </p>

        <div className="flex flex-col sm:flex-row justify-center align-start">
          <div className="flex flex-col">
            <Button
              size="lg"
              className="gap-2"
              disabled
            >
              <Chrome className="h-5 w-5" />
              <span>Install Extension</span>
            </Button>
            <small className="mt-2">closed beta testing, to apply, please fill out the form below</small>
          </div>
        </div>
      </div>

      <ContactForm />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 card">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 gap-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg black font-bold mb-2">Smart Analysis</CardTitle>
            <CardDescription>
              Advanced feature engineering and scoring algorithms predict your reply success rate
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-6 card">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 gap-4">
              <Chrome className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-lg black font-bold mb-2">Browser Extension</CardTitle>
            <CardDescription>Seamless integration with Upwork - analyze jobs without leaving the page</CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-6 card">
          <CardHeader className="pb-4">
            <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center mb-4 gap-4">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <CardTitle className="flex flex-row gap-[4px] text-lg black font-bold mb-2">
              Actionable AI Tips <Badge className="soon">soon</Badge>
            </CardTitle>
            <CardDescription>
              Get specific recommendations to improve your profile and proposal strategy
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="text-center">
        <h6 className="text-2xl font-bold mb-6 purple heading">Support</h6>
        <ul className="text-lg text-muted-foreground mb-6 flex gap-4 justify-center">
          <li>
            <a href="mailto:mrdexters1@gmail.com">Email</a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/vadymwebdev/"
              target="_blank"
              rel="noopener nofollow"
            >
              Linkedin
            </a>
          </li>
        </ul>
      </div>
    </main>
  );
}
