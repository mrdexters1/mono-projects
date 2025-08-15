"use client";

import { Button, Card } from "@ui";
import { useState } from "react";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setMessage("Please confirm consent to be contacted.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (res.ok) {
        setMessage("Success! You're on the list.");
        setEmail("");
        setName("");
      } else {
        const data = await res.json().catch(() => null);
        setMessage(data?.message || "Something went wrong. Please try again.");
      }
    } catch (_err) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="card max-w-2xl mb-6 p-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Your Name (optional)"
          />
        </div>
        <label
          className="flex items-center text-sm gap-1"
          id="checkbox-validation"
        >
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1"
          />
          <span>I agree to receive emails and confirm that I can unsubscribe anytime.</span>
        </label>
        {message && (
          <div
            className={`p-3 rounded-md ${message.includes("Success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {message}
          </div>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full agree"
        >
          {isSubmitting ? "Joining..." : "Join Beta"}
        </Button>
      </form>
    </Card>
  );
}
