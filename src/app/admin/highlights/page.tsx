"use client";

import { FormEvent, useEffect, useState } from "react";

type Item = { id?: string; value: string; label: string; sortOrder: number };

export default function AdminHighlightsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Item>({ value: "", label: "", sortOrder: 0 });

  async function load() {
    const res = await fetch("/api/admin/highlights");
    setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/highlights", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ value: "", label: "", sortOrder: 0 });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/highlights?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Highlights</h1>
      <form className="admin-card" onSubmit={onSubmit}>
        <label className="field">
          Value
          <input
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            required
          />
        </label>
        <label className="field">
          Label
          <input
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            required
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
          {form.id ? "Update" : "Add"} highlight
        </button>
      </form>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Value</th>
              <th>Label</th>
              <th>Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.value}</td>
                <td>{item.label}</td>
                <td>{item.sortOrder}</td>
                <td className="admin-actions">
                  <button type="button" onClick={() => setForm(item)}>
                    Edit
                  </button>
                  <button type="button" className="danger" onClick={() => item.id && remove(item.id)}>
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
