import { Stars } from "../../Stars";
import "./testimonal.css";

export default function TestimonialItem({
  name,
  job,
  post,
  significant,
  onClick,
}: {
  name: string;
  job: string;
  post?: string;
  significant?: string;
  onClick?: () => void;
}) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className="testimonial-card"
      type={onClick ? "button" : undefined}
      style={{ textAlign: "left", width: "100%", border: "none" }}
    >
      <Stars />
      <p className="quote" style={{ whiteSpace: "pre-line" }}>
        {significant}
      </p>
      <p className="quote" style={{ whiteSpace: "pre-line" }}>
        {post}
      </p>
      <div className="person">
        <span className="avatar" />
        <div className="person-meta">
          <strong>{name}</strong>
          <span className="role">{job}</span>
        </div>
      </div>
    </Component>
  );
}
