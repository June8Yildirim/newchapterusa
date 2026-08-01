import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

type ButtonVariant = "gold" | "blue";

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
      {children}
    </button>
  );
};
