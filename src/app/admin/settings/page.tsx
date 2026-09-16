"use client";

import { FormEvent, useEffect, useState } from "react";

type Settings = Record<string, string>;

const FIELDS = [
  "aboutTitle",
  "highlightsTitle",
  "featuredTitle",
  "featuredSubtitle",
  "resumeTitle",
  "experienceTitle",
  "educationTitle",
  "skillsTitle",
  "portfolioTitle",
  "contactTitle",
  "contactDetailsTitle",
  "contactFormTitle",
  "galleryTitle",
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>({});
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data) setForm(data);
      });
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Site settings</h1>
      <form className="admin-card" onSubmit={onSubmit}>
        {FIELDS.map((key) => (
          <label className="field" key={key}>
            {key}
            <input
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
        <button className="btn-primary" type="submit">
          Save settings
        </button>
        {status && <p className="form-status">{status}</p>}
      </form>
    </div>
  );
}
