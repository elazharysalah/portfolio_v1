"use client";

import { useState } from "react";

export async function uploadFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url as string;
}

export function FileUploadButton({
  label,
  onUploaded,
  accept = "*/*",
}: {
  label: string;
  onUploaded: (url: string, file: File) => void;
  accept?: string;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <label className="admin-btn" style={{ display: "inline-block", cursor: "pointer" }}>
      {busy ? "Uploading..." : label}
      <input
        type="file"
        accept={accept}
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          try {
            const url = await uploadFile(file);
            onUploaded(url, file);
          } catch {
            alert("Upload failed");
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
    </label>
  );
}
