import "./Footer.css";
import { TRANSLATIONS, type Language } from "../../constants/text";
import { Button } from "../Button/Button";
export const Footer = ({
  lang,
  onContact,
}: {
  lang: Language;
  onContact: () => void;
}) => {
  const t = TRANSLATIONS[lang];
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand-section">
          <span className="footer-brand">{t.brand}</span>
          <span
            className="footer-coach-credentials"
            style={{
              fontSize: "0.95rem",
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            Dr. Mehtap Akay, PhD — {t.brand}
          </span>
          <p className="footer-desc" style={{ marginTop: "4px" }}>
            {t.footerDesc}
          </p>
          <Button variant="transparent" onClick={onContact}>
            {t.contactTitle}
          </Button>
        </div>
        <div className="footer-links">
          <a
            href="https://www.linkedin.com/in/mehtap-akay-phd-4395a122"
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-link"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ verticalAlign: "middle" }}
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>{t.footerConnect}</span>
          </a>
          <span className="footer-cert">🏅 {t.footerCert}</span>
          <p className="footer-entity">{t.footerEntity}</p>
          <p className="footer-copyright">{t.footerCopyright}</p>
        </div>
      </div>

      <div className="footer-legal">
        <p className="footer-dev">
          {t.developedBy}
          {import.meta.env.DEV && (
            <>
              {" · "}
              <a className="footer-admin-link" href="/admin">
                ✏️ Edit Content
              </a>
            </>
          )}
        </p>
      </div>
    </footer>
  );
};
