"use client";

import { FormEvent, useEffect, useState } from "react";
import { FileUploadButton } from "@/components/admin/FileUploadButton";

type Item = {
  id?: string;
  imageUrl: string;
  caption: string;
  sortOrder: number;
};

const empty: Item = { imageUrl: "", caption: "", sortOrder: 0 };

export default function AdminGalleryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Item>(empty);

  async function load() {
    setItems(await (await fetch("/api/admin/gallery")).json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/gallery", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(empty);
    load();
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Gallery</h1>
      <form className="admin-card" onSubmit={onSubmit}>
        <div className="field">
          Image URL
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            required
          />
          <FileUploadButton
            label="Upload image"
            onUploaded={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
          />
        </div>
        <label className="field">
          Caption
          <input
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
          />
        </label>
        <label className="field">
          Sort order
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
          />
        </label>
        <button className="btn-primary" type="submit">
          {form.id ? "Update" : "Add"} image
        </button>
      </form>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Caption</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.imageUrl} alt="" style={{ width: 96, borderRadius: 8 }} />
                </td>
                <td>{item.caption}</td>
                <td className="admin-actions">
                  <button
                    type="button"
                    onClick={() => setForm({ ...item, caption: item.caption || "" })}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={async () => {
                      await fetch(`/api/admin/gallery?id=${item.id}`, { method: "DELETE" });
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
