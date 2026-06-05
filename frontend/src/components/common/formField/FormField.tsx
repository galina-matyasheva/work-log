import "./FormField.css";

export const FormField = ({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="form-field">
    {children}
    <span className="form-field-error" data-testid="form-field-error">{error || "\u00A0"}</span>
  </div>
);
