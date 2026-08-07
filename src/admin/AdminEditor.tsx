import { useState, useMemo } from "react";
import { TRANSLATIONS } from "../constants/text";
import "./admin.css";

type Path = (string | number)[];
type Json =
  | string
  | number
  | boolean
  | Json[]
  | { [key: string]: Json };

/** Turn a camelCase / snake_case key into a readable Title Case label. */
function humanize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

// Fields to prefer as a human label when a node/array-item has one.
const TITLE_FIELDS = [
  "title",
  "pillar",
  "name",
  "eyebrow",
  "serviceHeading",
  "quote",
  "citation",
  "date",
  "body",
];

/** The object's own title-ish field, if any. */
function titleOf(value: Json): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, Json>;
    for (const key of TITLE_FIELDS) {
      const v = obj[key];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    for (const v of Object.values(obj)) {
      if (typeof v === "string" && v.trim()) return v.trim();
    }
  }
  return null;
}

/** Label for a collapsible group: the object's title, else the humanized key. */
function branchLabel(key: string, value: Json): string {
  return titleOf(value) ?? humanize(key);
}

/** Build an "empty" value that mirrors the shape of a sample (for adding list items). */
function emptyLike(sample: Json): Json {
  if (typeof sample === "string") return "";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  if (Array.isArray(sample)) return [];
  const out: { [key: string]: Json } = {};
  for (const key of Object.keys(sample)) out[key] = emptyLike(sample[key]);
  return out;
}

function getAt(root: Json, path: Path): Json {
  let node: Json = root;
  for (const p of path) node = (node as never)[p];
  return node;
}

interface SectionDef {
  id: string;
  label: string;
  keys: string[];
  desc: string;
}

const SECTIONS: SectionDef[] = [
  {
    id: "hero",
    label: "👤 1. Hero / Meet Coach",
    keys: ["summary"],
    desc: "Hero photo, position title, quote, bio text, and primary call-to-actions",
  },
  {
    id: "research",
    label: "📚 2. Research & Publications",
    keys: ["publicationsTitle", "publicationsSubTitle", "publicationsRich"],
    desc: "Research section heading, intro text, and academic publication cards",
  },
  {
    id: "pillars",
    label: "🏛️ 3. 6 Pillars of Growth & Leadership",
    keys: ["pillarsTitle", "pillarsSubtitle", "pillars", "explorePillars"],
    desc: "6 Pillars section title, subtitle, and individual pillar cards",
  },
  {
    id: "network",
    label: "🤝 4. A Growing Sisterhood & Network",
    keys: ["network"],
    desc: "Community network heading, paragraphs, and waitlist button labels",
  },
  {
    id: "howWeWork",
    label: "⚙️ 5. How We Work Together",
    keys: ["howWeWork"],
    desc: "Service offerings, coaching areas, and methodology details",
  },
  {
    id: "discovery",
    label: "🚀 6. Next Steps & Discovery",
    keys: [
      "nextStepsTitle",
      "discoveryTitle",
      "discoveryDesc",
      "discoveryBtn",
      "submitApplicationBtn",
      "applyCohort",
    ],
    desc: "Discovery call callouts, application forms, and next steps buttons",
  },
  {
    id: "events",
    label: "📅 7. Happening Soon & Events",
    keys: [
      "happeningSoonTitle",
      "announcementsSubTitle",
      "upcomingEvents",
      "nextUpLabel",
      "reserveSpot",
    ],
    desc: "Upcoming events carousel, event dates, descriptions, and registration links",
  },
  {
    id: "testimonials",
    label: "💬 8. What Our Community Says (Testimonials)",
    keys: ["testimonials"],
    desc: "Testimonial quotes and feedback from community members",
  },
  {
    id: "nav_footer",
    label: "🌐 9. Navigation & Footer",
    keys: [
      "brand",
      "nav",
      "contactTitle",
      "footerDesc",
      "footerCert",
      "footerEntity",
      "footerCopyright",
      "footerConnect",
      "developedBy",
    ],
    desc: "Header brand logo, navigation menu items, and footer credentials",
  },
  {
    id: "all",
    label: "📦 10. All Content Fields",
    keys: [],
    desc: "View and edit every raw translation key in the system",
  },
];

export function AdminEditor() {
  const [data, setData] = useState<Json>(
    () => structuredClone(TRANSLATIONS) as Json,
  );
  const langs = Object.keys(data as Record<string, Json>);
  const [activeLang, setActiveLang] = useState(langs[0] ?? "en");
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [search, setSearch] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );

  const mutate = (fn: (draft: Json) => void) => {
    setData((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
    setStatus(null);
  };

  const setValue = (path: Path, value: Json) =>
    mutate((draft) => {
      let node = draft as never;
      for (let i = 0; i < path.length - 1; i++) node = node[path[i]] as never;
      (node as Record<string | number, Json>)[path[path.length - 1]] = value;
    });

  const removeAt = (path: Path) =>
    mutate((draft) => {
      let node = draft as never;
      for (let i = 0; i < path.length - 1; i++) node = node[path[i]] as never;
      const key = path[path.length - 1];
      if (Array.isArray(node)) (node as Json[]).splice(key as number, 1);
      else delete (node as Record<string, Json>)[key as string];
    });

  const addItem = (path: Path, template: Json) =>
    mutate((draft) => {
      const arr = getAt(draft, path) as Json[];
      arr.push(structuredClone(template));
    });

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      // Dev writes src/constants/text.ts via the Vite plugin; production persists
      // to Netlify Blobs via the serverless function (see netlify/functions/content.mts).
      const isDev = import.meta.env.DEV;
      const res = await fetch(
        isDev ? "/__admin/save-content" : "/.netlify/functions/content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password":
              sessionStorage.getItem("ncwen_admin_password") ?? "",
          },
          body: JSON.stringify(data),
        },
      );
      const result = await res.json();
      if (result.success) {
        setStatus({
          ok: true,
          msg: isDev
            ? "Saved to src/constants/text.ts"
            : "Saved. Reload the live site to see changes.",
        });
      } else {
        setStatus({ ok: false, msg: result.error || "Save failed" });
      }
    } catch (err) {
      setStatus({ ok: false, msg: String(err) });
    } finally {
      setSaving(false);
    }
  };

  const currentLangObj = (data as Record<string, Json>)[activeLang] as Record<
    string,
    Json
  >;

  const currentSection = useMemo(() => {
    return (
      SECTIONS.find((s) => s.id === activeSection) ??
      SECTIONS[SECTIONS.length - 1]
    );
  }, [activeSection]);

  const visibleKeys = useMemo(() => {
    if (!currentLangObj) return [];
    let keys = Object.keys(currentLangObj);

    if (currentSection.id !== "all") {
      keys = keys.filter((k) => currentSection.keys.includes(k));
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      keys = keys.filter((k) => {
        const valStr = JSON.stringify(currentLangObj[k]).toLowerCase();
        return k.toLowerCase().includes(query) || valStr.includes(query);
      });
    }

    return keys;
  }, [currentLangObj, currentSection, search]);

  return (
    <div className="admin">
      <header className="admin-header">
        <div>
          <h1>Content Management Dashboard</h1>
          <p>
            Organized content editor for <code>src/constants/text.ts</code>
          </p>
        </div>
        <div className="admin-actions">
          <a className="admin-btn" href="/">
            ← Back to Site
          </a>
          <button
            type="button"
            className="admin-btn"
            onClick={() => {
              setData(structuredClone(TRANSLATIONS) as Json);
              setStatus(null);
            }}
          >
            Reset Changes
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving…" : "💾 Save to text.ts"}
          </button>
        </div>
      </header>

      {status && (
        <p className={`admin-status ${status.ok ? "ok" : "err"}`}>
          {status.ok ? "✅ " : "❌ "}
          {status.msg}
        </p>
      )}

      {/* Top bar (Lang switch + Search) */}
      <div className="admin-top-bar">
        <div className="admin-tabs" role="tablist" aria-label="Language">
          {langs.map((lng) => (
            <button
              key={lng}
              type="button"
              role="tab"
              aria-selected={lng === activeLang}
              className={`admin-tab ${lng === activeLang ? "is-active" : ""}`}
              onClick={() => setActiveLang(lng)}
            >
              {lng === "en" ? "🇺🇸 English (EN)" : "🇹🇷 Türkçe (TR)"}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="admin-search-input"
          placeholder="🔍 Search text or field key..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Organized Section Layout */}
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <h3 className="admin-sidebar-title">Page Sections</h3>
          <ul className="admin-section-list">
            {SECTIONS.map((sec) => (
              <li key={sec.id}>
                <button
                  type="button"
                  className={`admin-section-btn ${
                    sec.id === activeSection ? "is-active" : ""
                  }`}
                  onClick={() => setActiveSection(sec.id)}
                >
                  <span className="admin-sec-label">{sec.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="admin-main">
          <div className="admin-section-header">
            <h2>{currentSection.label}</h2>
            <p className="admin-section-desc">{currentSection.desc}</p>
          </div>

          <div className="admin-fields-container">
            {visibleKeys.length === 0 ? (
              <div className="admin-empty-state">
                <p>No matching fields found in this section.</p>
              </div>
            ) : (
              visibleKeys.map((key) => (
                <div key={key} className="admin-card">
                  <div className="admin-card-head">
                    <h3 className="admin-card-title">{humanize(key)}</h3>
                    <code className="admin-card-key">{key}</code>
                  </div>
                  <Node
                    value={currentLangObj[key]}
                    path={[activeLang, key]}
                    onChange={setValue}
                    onRemove={removeAt}
                    onAdd={addItem}
                  />
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function Node({
  value,
  path,
  onChange,
  onRemove,
  onAdd,
}: {
  value: Json;
  path: Path;
  onChange: (path: Path, value: Json) => void;
  onRemove: (path: Path) => void;
  onAdd: (path: Path, template: Json) => void;
}) {
  // Leaf: string / number / boolean
  if (typeof value !== "object" || value === null) {
    const str = String(value);
    return (
      <textarea
        className="admin-input"
        value={str}
        rows={Math.min(6, Math.max(1, Math.ceil(str.length / 64)))}
        onChange={(e) => onChange(path, e.target.value)}
      />
    );
  }

  // Array
  if (Array.isArray(value)) {
    const template: Json = value.length ? emptyLike(value[0]) : "";
    return (
      <div className="admin-array">
        {value.map((item, i) => (
          <div className="admin-array-item" key={i}>
            <div className="admin-array-head">
              <span className="admin-index">{titleOf(item) ?? `#${i + 1}`}</span>
              <button
                type="button"
                className="admin-remove"
                onClick={() => onRemove([...path, i])}
              >
                Remove
              </button>
            </div>
            <Node
              value={item}
              path={[...path, i]}
              onChange={onChange}
              onRemove={onRemove}
              onAdd={onAdd}
            />
          </div>
        ))}
        <button
          type="button"
          className="admin-add"
          onClick={() => onAdd(path, template)}
        >
          + Add item
        </button>
      </div>
    );
  }

  // Object
  return (
    <div className="admin-object">
      {Object.entries(value).map(([key, child]) => {
        const isBranch = typeof child === "object" && child !== null;
        if (isBranch) {
          return (
            <details className="admin-group" key={key} open={path.length < 2}>
              <summary className="admin-group-label">
                {branchLabel(key, child)}
              </summary>
              <div className="admin-group-body">
                <Node
                  value={child}
                  path={[...path, key]}
                  onChange={onChange}
                  onRemove={onRemove}
                  onAdd={onAdd}
                />
              </div>
            </details>
          );
        }
        return (
          <label className="admin-field" key={key}>
            <span className="admin-key">{humanize(key)}</span>
            <Node
              value={child}
              path={[...path, key]}
              onChange={onChange}
              onRemove={onRemove}
              onAdd={onAdd}
            />
          </label>
        );
      })}
    </div>
  );
}
