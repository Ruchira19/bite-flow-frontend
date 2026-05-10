// Properties accepted by the reusable alert component.
interface AlertProps {
  
  // Determines the alert message style and color theme.
  type: "success" | "failed" | "info";

  // Alert message content displayed to the user.
  message: string;

  // Optional callback function triggered when closing the alert.
  onClose?: () => void;
}

// Reusable alert component for displaying feedback messages.
export const Alert = ({
  type,
  message,
  onClose,
}: AlertProps) => {
  
  // Select alert color palette based on alert type.
  const palette =
    type === "success"
      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
      : type === "info"
      ? "border-sky-300 bg-sky-50 text-sky-800"
      : "border-rose-300 bg-rose-50 text-rose-800";

  // Render alert message container.
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${palette}`}
    >
      <div className="flex items-start justify-between gap-4">
        
        {/* Alert message text */}
        <p>{message}</p>

        {/* Optional alert close button */}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-xs font-semibold uppercase tracking-wide"
          >
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
};