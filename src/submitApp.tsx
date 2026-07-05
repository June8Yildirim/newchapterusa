import { type ComponentProps } from "react";
import { LOREM_SHORT } from "./constants/text";

export function SubmitApplication({
  setOpenConfirm,
}: {
  openConfirm: boolean;
  setOpenConfirm: (tst: boolean) => void;
}) {
  const CONTACT_EMAIL = "hello@newchapter.example";
  function buildMailtoHref(data: FormData) {
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const stage = String(data.get("stage") ?? "");
    const barrier = String(data.get("barrier") ?? "");
    const support = String(data.get("support") ?? "");
    const consent = data.get("consent") ? "Yes" : "No";

    const subject = `New Chapter application${name ? ` — ${name}` : ""}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Current Professional Transition Stage: ${stage}`,
      `Top Career Barrier: ${barrier}`,
      `Requested Support Type: ${support}`,
      `Consent to be contacted: ${consent}`,
    ].join("\n");

    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }
  const handleSubmit: ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    const href = buildMailtoHref(new FormData(e.currentTarget));
    setOpenConfirm(true);
    window.location.href = href;
  };

  return (
    <section className="section update">
      <div className="container">
        <form className="update-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" required />
          <input type="email" name="email" placeholder="Email" required />
          <input
            type="text"
            name="stage"
            placeholder="Current Professional Transition Stage"
          />
          <input type="text" name="barrier" placeholder="Top Career Barrier" />
          <input
            type="text"
            name="support"
            placeholder="Requested Support Type"
          />
          <label className="checkbox-row">
            <input type="checkbox" name="consent" />
            <span>{LOREM_SHORT}</span>
          </label>
          <button className="btn btn-gold btn-block" type="submit">
            Submit Application
          </button>
        </form>
      </div>
    </section>
  );
}
