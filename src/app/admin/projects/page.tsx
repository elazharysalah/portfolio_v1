"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { FileUploadButton } from "@/components/admin/FileUploadButton";

type Item = {
  id?: string;
  title: string;
  url: string;
  description: string;
  content: string;
  imageUrl: string;
  featured: boolean;
  accessMode: "link" | "hidden" | "request";
  sortOrder: number;
};

const empty: Item = {
  title: "",
  url: "",
  description: "",
  content: "",
  imageUrl: "",
  featured: false,
  accessMode: "link",
  sortOrder: 0,
};

function buildFigureHtml(url: string, alt: string, caption: string) {
  const safeAlt = alt.replace(/"/g, "&quot;");
  const captionHtml = caption.trim()
    ? `\n  <figcaption>${caption.trim()}</figcaption>`
    : "";
  return `
<figure class="case-figure">
  <img src="${url}" alt="${safeAlt}" loading="lazy" />${captionHtml}
</figure>
`;
}

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Item>(empty);
  const [imageCaption, setImageCaption] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  async function load() {
    setItems(await (await fetch("/api/admin/projects")).json());
  }

  useEffect(() => {
    load();
  }, []);

  function insertIntoContent(snippet: string) {
    const el = contentRef.current;
    if (!el) {
      setForm((prev) => ({ ...prev, content: `${prev.content}\n${snippet}` }));
      return;
    }

    const start = el.selectionStart ?? form.content.length;
    const end = el.selectionEnd ?? form.content.length;
    const next = form.content.slice(0, start) + snippet + form.content.slice(end);
    setForm((prev) => ({ ...prev, content: next }));

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/projects", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(empty);
    setImageCaption("");
    setImageAlt("");
    load();
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Case Studies</h1>
      <form className="admin-card" onSubmit={onSubmit}>
        <label className="field">
          Title
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>
        <label className="field">
          URL (used when access mode is “Enable visit link”)
          <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        </label>
        <label className="field">
          Visit button mode
          <select
            value={form.accessMode}
            onChange={(e) =>
              setForm({
                ...form,
                accessMode: e.target.value as Item["accessMode"],
              })
            }
          >
            <option value="link">Enable visit link</option>
            <option value="hidden">Hide visit button</option>
            <option value="request">Request access (email me)</option>
          </select>
        </label>
        {form.accessMode === "link" && !form.url && (
          <p className="error-text">Add a URL above so the Visit project button works.</p>
        )}
        {form.accessMode === "request" && (
          <p style={{ color: "#9a9aa5", fontSize: "0.85rem", marginTop: "-0.35rem" }}>
            Visitors can send an access request. You’ll see it in Admin → Access Requests.
          </p>
        )}
        <label className="field">
          Short description (card preview)
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </label>

        <label className="field">
          Full case study content (HTML allowed — like a blog post)
          <textarea
            ref={contentRef}
            rows={14}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="<p>Problem...</p><p>Solution...</p><p>Results...</p>"
          />
        </label>

        <div className="admin-card" style={{ marginBottom: "1rem", background: "#121217" }}>
          <strong style={{ display: "block", marginBottom: "0.75rem" }}>
            Insert image into case study
          </strong>
          <p style={{ color: "#9a9aa5", fontSize: "0.85rem", marginTop: 0 }}>
            Upload an image to insert it at the cursor position in the content above. Images
            appear full-width and can be clicked to enlarge while reading.
          </p>
          <label className="field">
            Alt text
            <input
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Describe the image"
            />
          </label>
          <label className="field">
            Caption (optional)
            <input
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              placeholder="Short caption under the image"
            />
          </label>
          <div className="admin-actions">
            <FileUploadButton
              label="Upload & insert image"
              accept="image/*"
              onUploaded={(url, file) => {
                const alt = imageAlt.trim() || file.name.replace(/\.[^.]+$/, "");
                insertIntoContent(buildFigureHtml(url, alt, imageCaption));
                setImageAlt("");
                setImageCaption("");
              }}
            />
          </div>
        </div>

        <div className="field">
          Card cover image URL
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          <FileUploadButton
            label="Upload cover image"
            accept="image/*"
            onUploaded={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
          />
        </div>
        <label className="field">
          Sort order
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          />
        </label>
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1rem" }}>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured on About (Case Study)
        </label>
        <button className="btn-primary" type="submit">
          {form.id ? "Update" : "Add"} case study
        </button>
      </form>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Access</th>
              <th>Featured</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>
                  {item.accessMode === "hidden"
                    ? "Hidden"
                    : item.accessMode === "request"
                      ? "Request"
                      : "Link"}
                </td>
                <td>{item.featured ? "Yes" : "No"}</td>
                <td className="admin-actions">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...item,
                        url: item.url || "",
                        imageUrl: item.imageUrl || "",
                        content: item.content || "",
                        accessMode: item.accessMode || "link",
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={async () => {
                      await fetch(`/api/admin/projects?id=${item.id}`, { method: "DELETE" });
                      load();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
