import { TRANSLATIONS, type Language } from "../../constants/text";
import { Button } from "../Button/Button";

export default function SixPillars({
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
    <section className="section pillars">
      {/* 6 Pillars */}
      <div className="container">
        <h2>{t.pillarsTitle}</h2>
        <div className="pillar-grid">
          {t.pillars.map((p) => (
            <article key={p.pillar} className="pillar-card">
              <h3>{p.pillar}</h3>
              <p>{p.pillarDesc}</p>
              {/* <Button */}
              {/*   variant="gold" */}
              {/*   block */}
              {/*   onClick={() => setOpenComingSoonModal(!openComingSoonModal)} */}
              {/* > */}
              {/*   {t.watchSampleWebinar} */}
              {/* </Button> */}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
