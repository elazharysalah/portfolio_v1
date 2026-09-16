"use client";

import { FormEvent, useEffect, useState } from "react";
import { FileUploadButton } from "@/components/admin/FileUploadButton";

type Profile = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  footerText: string;
};

const empty: Profile = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  avatarUrl: "",
  resumeUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  twitterUrl: "",
  websiteUrl: "",
  footerText: "",
};

export default function AdminProfilePage() {
  const [form, setForm] = useState<Profile>(empty);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setForm({
            name: data.name || "",
            title: data.title || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            bio: data.bio || "",
            avatarUrl: data.avatarUrl || "",
            resumeUrl: data.resumeUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            githubUrl: data.githubUrl || "",
            instagramUrl: data.instagramUrl || "",
            facebookUrl: data.facebookUrl || "",
            twitterUrl: data.twitterUrl || "",
            websiteUrl: data.websiteUrl || "",
            footerText: data.footerText || "",
          });
        }
      });
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
  }

  function set(key: keyof Profile, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Profile</h1>
      <form className="admin-card" onSubmit={onSubmit}>
        {(
          [
            ["name", "Name"],
            ["title", "Title"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["location", "Location"],
            ["linkedinUrl", "LinkedIn URL"],
            ["githubUrl", "GitHub URL"],
            ["instagramUrl", "Instagram URL"],
            ["facebookUrl", "Facebook URL"],
            ["twitterUrl", "Twitter/X URL"],
            ["websiteUrl", "Website URL"],
            ["footerText", "Footer text"],
          ] as [keyof Profile, string][]
        ).map(([key, label]) => (
          <label className="field" key={key}>
            {label}
            <input value={form[key]} onChange={(e) => set(key, e.target.value)} />
          </label>
        ))}

        <label className="field">
          Bio (HTML allowed)
          <textarea rows={8} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
        </label>

        <div className="field">
          Avatar URL
          <input value={form.avatarUrl} onChange={(e) => set("avatarUrl", e.target.value)} />
          <FileUploadButton label="Upload avatar" onUploaded={(url) => set("avatarUrl", url)} />
        </div>

        <div className="field">
          Resume URL
          <input value={form.resumeUrl} onChange={(e) => set("resumeUrl", e.target.value)} />
          <FileUploadButton label="Upload resume" onUploaded={(url) => set("resumeUrl", url)} />
        </div>

        <button className="btn-primary" type="submit">
          Save profile
        </button>
        {status && <p className="form-status">{status}</p>}
      </form>
    </div>
  );
}
