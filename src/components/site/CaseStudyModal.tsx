"use client";

import { FormEvent, useEffect, useState } from "react";
import type { PortfolioPayload } from "@/lib/types";

type Project = PortfolioPayload["projects"][number];

function domainFromUrl(url?: string | null) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);

  const accessMode = project.accessMode || "link";
  const hasRichContent = Boolean(project.content?.trim());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxSrc) {
          setLightboxSrc(null);
          return;
        }
        if (showRequestForm) {
          setShowRequestForm(false);
          return;
        }
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, lightboxSrc, showRequestForm]);

  async function submitAccessRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRequestLoading(true);
    setRequestStatus(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          message: String(data.get("message") || ""),
        }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to send request");
      }
      form.reset();
      setRequestStatus("Request sent. I’ll review it and email you if access is granted.");
    } catch (err) {
      setRequestStatus(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setRequestLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel modal-panel--case"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-topbar">
          <div className="modal-topbar__left">
            <span className="modal-topbar__label">Case study</span>
            {accessMode === "link" && project.url && (
              <span className="modal-topbar__domain">{domainFromUrl(project.url)}</span>
            )}
            {accessMode === "request" && (
              <span className="modal-topbar__domain">Private · request access</span>
            )}
          </div>

          <div className="modal-topbar__actions">
            {accessMode === "link" && project.url && (
              <a
                className="visit-project-btn"
                href={project.url}
                target="_blank"
                rel="noreferrer"
              >
                <span>Visit project</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M7 17L17 7M17 7H9M17 7v8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}

            {accessMode === "request" && (
              <button
                type="button"
                className="visit-project-btn visit-project-btn--request"
                onClick={() => {
                  setShowRequestForm((v) => !v);
                  setRequestStatus(null);
                }}
              >
                <span>Request access</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 6h16v12H4V6zm0 0l8 7 8-7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            <button
              type="button"
              className="modal-close modal-close--inline"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {accessMode === "request" && showRequestForm && (
          <form className="access-request-form" onSubmit={submitAccessRequest}>
            <div className="access-request-form__intro">
              <strong>Request access</strong>
              <p>Send your details and I’ll email you if I can share access.</p>
            </div>
            <div className="access-request-form__grid">
              <label>
                Full name
                <input name="name" required placeholder="Your name" />
              </label>
              <label>
                Email
                <input name="email" type="email" required placeholder="you@email.com" />
              </label>
            </div>
            <label>
              Why do you need access? (optional)
              <textarea name="message" rows={3} placeholder="A short note helps..." />
            </label>
            <div className="access-request-form__actions">
              <button className="btn-primary" type="submit" disabled={requestLoading}>
                {requestLoading ? "Sending..." : "Send request"}
              </button>
              <button
                type="button"
                className="admin-btn"
                onClick={() => setShowRequestForm(false)}
              >
                Cancel
              </button>
            </div>
            {requestStatus && <p className="form-status">{requestStatus}</p>}
          </form>
        )}

        <div className="modal-body modal-body--case">
          {hasRichContent ? (
            <div
              id="case-study-title"
              className="case-study-html"
              dangerouslySetInnerHTML={{ __html: project.content || "" }}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === "IMG") {
                  const img = target as HTMLImageElement;
                  setLightboxSrc(img.currentSrc || img.src);
                  setLightboxAlt(img.alt || project.title);
                }
              }}
            />
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="modal-hero"
                src={project.imageUrl || "/uploads/project-placeholder.svg"}
                alt={project.title}
              />
              <h2 id="case-study-title">{project.title}</h2>
              <p className="modal-summary">{project.description}</p>
              <p className="empty-state">
                Full case study details coming soon. You can add them in Admin → Case Studies.
              </p>
            </>
          )}
        </div>
      </div>

      {lightboxSrc && (
        <div
          className="image-lightbox"
          role="presentation"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxSrc(null);
          }}
        >
          <button
            type="button"
            className="modal-close"
            aria-label="Close image"
            onClick={() => setLightboxSrc(null)}
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightboxSrc} alt={lightboxAlt} onClick={(e) => e.stopPropagation()} />
          {lightboxAlt && <p className="image-lightbox__caption">{lightboxAlt}</p>}
        </div>
      )}
    </div>
  );
}
