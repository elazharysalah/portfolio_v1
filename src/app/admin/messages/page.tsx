"use client";

import { useEffect, useState } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [items, setItems] = useState<Message[]>([]);

  async function load() {
    setItems(await (await fetch("/api/admin/messages")).json());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Messages</h1>
      {items.length === 0 && <p className="empty-state">No messages yet.</p>}
      {items.map((item) => (
        <div className="admin-card" key={item.id} style={{ opacity: item.read ? 0.75 : 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <strong>{item.name}</strong> · <a href={`mailto:${item.email}`}>{item.email}</a>
              <div style={{ color: "#9a9aa5", fontSize: "0.85rem", marginTop: 4 }}>
                {item.subject || "(no subject)"} · {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="admin-actions">
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/admin/messages", {
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
                  await fetch(`/api/admin/messages?id=${item.id}`, { method: "DELETE" });
                  load();
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <p style={{ whiteSpace: "pre-wrap", marginBottom: 0 }}>{item.message}</p>
        </div>
      ))}
    </div>
  );
}
