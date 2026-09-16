"use client";

import { FormEvent, useEffect, useState } from "react";

type Item = {
  id?: string;
  company: string;
  role: string;
  location: string;
  period: string;
  description: string;
  sortOrder: number;
};

const empty: Item = {
  company: "",
  role: "",
  location: "",
  period: "",
  description: "",
  sortOrder: 0,
};

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Item>(empty);

  async function load() {
    setItems(await (await fetch("/api/admin/experience")).json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/experience", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(empty);
    load();
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Experience</h1>
      <form className="admin-card" onSubmit={onSubmit}>
        {(["company", "role", "location", "period"] as const).map((key) => (
          <label className="field" key={key}>
            {key}
            <input
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required={key !== "location"}
            />
          </label>
        ))}
        <label className="field">
          Description
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
          {form.id ? "Update" : "Add"} experience
        </button>
      </form>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Company</th>
              <th>Period</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.role}</td>
                <td>{item.company}</td>
                <td>{item.period}</td>
                <td className="admin-actions">
                  <button type="button" onClick={() => setForm({ ...item, location: item.location || "" })}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={async () => {
                      await fetch(`/api/admin/experience?id=${item.id}`, { method: "DELETE" });
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
