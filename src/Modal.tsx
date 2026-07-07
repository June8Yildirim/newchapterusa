import { useEffect, type ReactNode, type CSSProperties } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  style,
  overlayClassName,
  overlayStyle,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`modal-overlay ${overlayClassName || ""}`}
      style={overlayStyle}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={`modal ${className || ""}`}
        style={style}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        {title && (
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
