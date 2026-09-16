"use client";

import { FormEvent, useState } from "react";
import type { PortfolioPayload } from "@/lib/types";

export function Contact({
  profile,
  settings,
}: {
  profile: PortfolioPayload["profile"];
  settings: PortfolioPayload["settings"];
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message");
      }
      form.reset();
      setStatus("Message sent. Thanks for reaching out!");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2 className="section-title with-rule">{settings.contactTitle}</h2>
      <div className="contact-layout">
        <div>
          <h3 className="block-title" style={{ marginTop: 0 }}>
            {settings.contactDetailsTitle}
          </h3>
          <ul className="contact-list">
            {profile.phone && (
              <li>
                <h5>Mobile</h5>
                <a href={`tel:${profile.phone.replace(/\s+/g, "")}`}>{profile.phone}</a>
              </li>
            )}
            <li>
              <h5>Email</h5>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            {profile.location && (
              <li>
                <h5>Location</h5>
                <p>{profile.location}</p>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="block-title" style={{ marginTop: 0 }}>
            {settings.contactFormTitle}
          </h3>
          <form className="form-grid" onSubmit={onSubmit}>
            <label>
              Full name
              <input name="name" required placeholder="Your name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required placeholder="you@email.com" />
            </label>
            <label>
              Subject
              <input name="subject" placeholder="How can I help?" />
            </label>
            <label>
              Message
              <textarea name="message" required placeholder="Write your message..." />
            </label>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
            {status && <p className="form-status">{status}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
