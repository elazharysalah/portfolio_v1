import type { PortfolioPayload } from "@/lib/types";

export function Gallery({
  settings,
  gallery,
}: {
  settings: PortfolioPayload["settings"];
  gallery: PortfolioPayload["gallery"];
}) {
  return (
    <section>
      <h2 className="section-title with-rule">{settings.galleryTitle}</h2>
      {gallery.length === 0 ? (
        <p className="empty-state">No gallery images yet.</p>
      ) : (
        <ul className="gallery-grid">
          {gallery.map((item) => (
            <li key={item.id}>
              <figure>
                <img src={item.imageUrl} alt={item.caption || "Gallery image"} />
                {item.caption && <figcaption>{item.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
