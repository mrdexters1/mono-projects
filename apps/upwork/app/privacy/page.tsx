import { Badge, Button, Card, CardDescription, CardHeader, CardTitle } from "@ui";
import ContactForm from "@upwork/components/ContactForm";
import { BarChart3, CheckCircle, Chrome, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col gap-[32px] justify-center items-center  max-w-4xl mx-auto pr-5 pl-5 pt-10 pb-10">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-full text-xs font-medium text-primary mb-2">
          <Zap className="h-4 w-4" />
          Last updated: 19 August 2025
        </div>
        <h1 className="text-2xl font-bold mb-6 purple heading">Privacy Policy</h1>
        <p className="text-md text-muted-foreground mb-6">
          This extension, Upwork AI Job Analyzer, does not collect, store, or sell any personally identifiable
          information from users. The extension only reads publicly available job post information on Upwork (such as
          job description, budget, and client history) in order to provide AI-powered insights.
        </p>
        <div className="text-md text-muted-foreground mb-6">
          <p>
            <b>Data Collection</b>
          </p>
          <ul className="text-md text-muted-foreground mb-6 list-none pl-6">
            <li>No personal user data (name, email, payment, location, browsing history, etc.) is collected.</li>
            <li>The extension only processes job post details visible on Upwork pages.</li>
          </ul>
        </div>
        <div className="text-md text-muted-foreground mb-6">
          <p>
            <b>Data Usage</b>
          </p>
          <ul className="text-md text-muted-foreground mb-6 list-none pl-6">
            <li>Job post details may be sent securely to our API for analysis.</li>
            <li>The API returns structured results; no personal data is transferred.</li>
          </ul>
        </div>
        <div className="text-md text-muted-foreground mb-6">
          <p>
            <b>Data Sharing</b>
          </p>
          <ul className="text-md text-muted-foreground mb-6 list-none pl-6">
            <li>We do not share, sell, or transfer user data to third parties.</li>
            <li>No tracking or advertising technologies are used inside the extension.</li>
          </ul>
        </div>
        <div className="text-md text-muted-foreground mb-6">
          <p>
            <b>Your Rights</b>
          </p>
          <p>
            As no personal data is collected, users do not need to request data deletion. The extension functions
            without storing user data.
          </p>
        </div>

        <div className="text-md text-muted-foreground mb-6">
          <p>
            <b>Contact</b>
          </p>
          <p>
            If you have questions about this Privacy Policy, please contact:{" "}
            <a href="mailto:mrdexters1@gmail.com">mrdexters1@gmail.com</a>.
          </p>
        </div>
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
