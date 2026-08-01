import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

type ButtonVariant = "gold" | "blue" | "transparent";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  block?: boolean;
}

export const Button = ({
  variant = "blue",
  block = false,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) => {
  const classes = [
    "btn",
    `btn-${variant}`,
    block ? "btn-block" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...rest}>
      <span className="btn-label">{children}</span>
    </button>
  );
};
