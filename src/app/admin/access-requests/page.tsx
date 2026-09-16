"use client";

import { useEffect, useState } from "react";

type AccessRequest = {
  id: string;
  name: string;
  email: string;
  message: string | null;
  read: boolean;
  createdAt: string;
  project: { id: string; title: string };
};

export default function AdminAccessRequestsPage() {
  const [items, setItems] = useState<AccessRequest[]>([]);

  async function load() {
    setItems(await (await fetch("/api/admin/access-requests")).json());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Access requests</h1>
      <p style={{ color: "#9a9aa5" }}>
        People asking for access to private case studies. Reply by email when you grant access.
      </p>
      {items.length === 0 && <p className="empty-state">No access requests yet.</p>}
      {items.map((item) => (
        <div className="admin-card" key={item.id} style={{ opacity: item.read ? 0.75 : 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <strong>{item.name}</strong> ·{" "}
              <a href={`mailto:${item.email}?subject=${encodeURIComponent(`Access: ${item.project.title}`)}`}>
                {item.email}
              </a>
              <div style={{ color: "#9a9aa5", fontSize: "0.85rem", marginTop: 4 }}>
                Project: {item.project.title} · {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="admin-actions">
              <a
                className="admin-btn"
                href={`mailto:${item.email}?subject=${encodeURIComponent(`Access granted: ${item.project.title}`)}`}
              >
                Email reply
              </a>
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/admin/access-requests", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: item.id, read: !item.read }),
                  });
                  load();
                }}
              >
                Mark {item.read ? "unread" : "read"}
              </button>
              <button
                type="button"
                className="danger"
                onClick={async () => {
                  await fetch(`/api/admin/access-requests?id=${item.id}`, { method: "DELETE" });
                  load();
                }}
              >
                Delete
              </button>
            </div>
          </div>
          {item.message && (
            <p style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>{item.message}</p>
          )}
        </div>
      ))}
    </div>
  );
}
