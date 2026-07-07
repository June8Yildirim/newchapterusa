import { TRANSLATIONS, type Language } from "../../constants/text";

export default function Navigation({
  lang,
  setLang,
}: {
  setLang: (str: Language) => void;
  lang: Language;
}) {
  const t = TRANSLATIONS[lang];
  return (
    <header className="site-header">
      {/* Header */}
      <div className="header-nav">
        <button
          type="button"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <img width={80} height={80} src="/images/NCWENLogo.png" alt="logo" />
        </button>
        <span className="brand">{t.brand}</span>
      </div>

      <nav className="header-nav">
        <button className="btn btn-blue" type="button">
          {t.applyCohort}
        </button>
        <button className="btn btn-gold" type="button">
          {t.explorePillars}
        </button>
        <button
          className={`btn lang-btn ${lang === "en" ? "goldbtn" : "navybtn"}`}
          type="button"
          onClick={() => setLang("en")}
          style={{ opacity: lang === "en" ? 1 : 0.6 }}
        >
          EN
        </button>
        <button
          className={`btn lang-btn ${lang === "tr" ? "goldbtn" : "navybtn"}`}
          type="button"
          onClick={() => setLang("tr")}
          style={{ opacity: lang === "tr" ? 1 : 0.6 }}
        >
          TR
        </button>
      </nav>
    </header>
  );
}
