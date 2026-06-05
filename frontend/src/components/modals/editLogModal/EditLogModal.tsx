import "./EditLogModal.css";

import { FormField } from "components/common/formField/FormField";
import { TEXTS } from "constants/texts";
import { useState } from "react"
import { editLogSchema } from "schemas/LogSchema";
import { LogItem } from "types/log";
import { Unit } from "types/unit";
import { Worker } from "types/worker";


type Props = {
  item: LogItem;
  onClose: () => void;
  onSave: (data: Omit<LogItem, "date">) => Promise<void>;
  workers: Worker[];
  units: Unit[];
};

export const EditLogModal = ({ item, onClose, onSave, workers, units }: Props) => {
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    id: item.id,
    work_type: item.work_type ?? "",
    volume: String(Number(item.volume) || ""),
    unit: item.unit ?? "",
    worker_name: item.worker_name ?? "",
  });

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSave = async () => {
    if (isSubmitting) return;

    const result = editLogSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await onSave({
        id: form.id,
        work_type: form.work_type,
        volume: Number(form.volume),
        unit: form.unit,
        worker_name: form.worker_name,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal-container" onClick={handleModalClick}>
        <p>{TEXTS.modal.edit.text}</p>
        <FormField error={errors.work_type}>
          <input value={form.work_type} onChange={handleChange("work_type")} />
        </FormField>

        <FormField error={errors.volume}>
          <input
            value={form.volume}
            onChange={handleChange("volume")}
          />
        </FormField>

        <FormField error={errors.unit}>
          <select value={form.unit} onChange={handleChange("unit")}>
            <option value="">Выберите единицу</option>
            {units.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField error={errors.worker_name}>
          <select
            value={form.worker_name}
            onChange={handleChange("worker_name")}
          >
            <option value="">Выберите исполнителя</option>
            {workers.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </FormField>
        <div className="edit-modal-buttons">
          <button className="edit-log-modal-close-button" onClick={onClose} disabled={isSubmitting}>
            {TEXTS.modal.edit.close}
          </button>

          <button className="edit-log-modal-save-button" onClick={handleSave} disabled={isSubmitting}>
            {TEXTS.modal.edit.save}
          </button>
        </div>
      </div>
    </div>
  );
};
