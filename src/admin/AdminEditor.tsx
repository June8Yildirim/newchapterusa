import { useState } from "react";
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
const TITLE_FIELDS = ["title", "pillar", "name", "eyebrow", "serviceHeading"];

/** The object's own title-ish field, if any. */
function titleOf(value: Json): string | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, Json>;
    for (const key of TITLE_FIELDS) {
      const v = obj[key];
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

export function AdminEditor() {
  const [data, setData] = useState<Json>(
    () => structuredClone(TRANSLATIONS) as Json,
  );
  const langs = Object.keys(data as Record<string, Json>);
  const [activeLang, setActiveLang] = useState(langs[0] ?? "en");
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
      const res = await fetch("/__admin/save-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setStatus({ ok: true, msg: "Saved to src/constants/text.ts" });
      } else {
        setStatus({ ok: false, msg: result.error || "Save failed" });
      }
    } catch (err) {
      setStatus({ ok: false, msg: String(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin">
      <header className="admin-header">
        <div>
          <h1>Content Editor</h1>
          <p>
            Edits <code>src/constants/text.ts</code> directly. Dev-only — commit
            &amp; redeploy to publish.
          </p>
        </div>
        <div className="admin-actions">
          <a className="admin-btn" href="/">
            ← Home
          </a>
          <button
            type="button"
            className="admin-btn"
            onClick={() => {
              setData(structuredClone(TRANSLATIONS) as Json);
              setStatus(null);
            }}
          >
            Reset
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save to text.ts"}
          </button>
        </div>
      </header>

      {status && (
        <p className={`admin-status ${status.ok ? "ok" : "err"}`}>
          {status.ok ? "✅ " : "❌ "}
          {status.msg}
        </p>
      )}

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
            {lng.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="admin-body">
        <Node
          value={(data as Record<string, Json>)[activeLang]}
          path={[activeLang]}
          onChange={setValue}
          onRemove={removeAt}
          onAdd={addItem}
        />
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
            <details className="admin-group" key={key} open={path.length < 1}>
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
