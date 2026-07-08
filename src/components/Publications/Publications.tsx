import { TRANSLATIONS, type Language } from "../../constants/text";

export default function Publications({
  lang,
  openComingSoonModal,
  setOpenComingSoonModal,
}: {
  lang: Language;
  openComingSoonModal: boolean;

  setOpenComingSoonModal: (str: boolean) => void;
}) {
  const t = TRANSLATIONS[lang];

  return (
    <section className="section publications">
      {/* Publications */}
      <div className="container">
        <h2>{t.publicationsTitle}</h2>
        <div className="pub-grid">
          {t.publicationsRich.map((pub) => (
            <article
              key={pub.title}
              className="pub-card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  className="pub-image"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    background: "rgba(22, 140, 118, 0.1)",
                    borderRadius: "6px",
                    height: "120px",
                    marginBottom: "16px",
                  }}
                >
                  📄
                </div>
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "whitesmoke",
                  }}
                >
                  {pub.title}
                </h3>
                <p
                  className="pub-paper"
                  style={{
                    fontStyle: "italic",
                    fontSize: "0.95rem",
                    color: "var(--gold)",
                    marginBlock: "8px",
                  }}
                >
                  "{pub.paper}"
                </p>
                <p
                  className="pub-desc"
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--page-bg)",
                    lineHeight: "1.4",
                  }}
                >
                  {pub.description}
                </p>
              </div>
              <button
                onClick={() => setOpenComingSoonModal(!openComingSoonModal)}
                rel="noopener noreferrer"
                className="btn"
                style={{
                  backgroundColor: "transparent",
                  marginTop: "16px",
                  color: "mediumturquoise",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  textDecoration: "underline",
                  display: "inline-block",
                }}
              >
                {pub.linkText}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
