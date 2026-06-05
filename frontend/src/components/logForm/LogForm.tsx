import "./LogForm.css";

import { FormField } from "components/common/formField/FormField";
import { TEXTS } from "constants/texts";
import { useEffect, useState } from "react";
import { logSchema } from "schemas/LogSchema";
import { LogFormData } from "types/log";
import { Unit } from "types/unit";
import { Worker } from "types/worker";

type Props = {
  onAdd: (data: LogFormData) => Promise<void>;
  resetErrorsKey: number;
  workers: Worker[];
  units: Unit[];
};

export const LogForm = ({ onAdd, resetErrorsKey, workers, units }: Props) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof LogFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<LogFormData>({
    date: "",
    work_type: "",
    volume: "",
    unit: "",
    worker_name: "",
  });

  useEffect(() => {
    setErrors({});
  }, [resetErrorsKey]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const result = logSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LogFormData, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LogFormData;

        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);

      return;
    }

    setErrors({});

    setIsSubmitting(true);

    try {
      await onAdd(form);

      setForm({
        date: "",
        work_type: "",
        volume: "",
        unit: "",
        worker_name: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="log-form">
      <FormField error={errors.date}>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          max={today}
          data-testid="date-input"
        />
      </FormField>

      <FormField error={errors.work_type}>
        <input
          name="work_type"
          placeholder={TEXTS.form.placeholder.work}
          value={form.work_type}
          onChange={handleChange}
        />
      </FormField>

      <FormField error={errors.volume}>
        <input
          name="volume"
          placeholder={TEXTS.form.placeholder.volume}
          value={form.volume}
          onChange={handleChange}
        />
      </FormField>

      <FormField error={errors.unit}>
        <select name="unit" value={form.unit} onChange={handleChange}>
          <option value="">{TEXTS.form.select.unit.value}</option>
          {units.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField error={errors.worker_name}>
        <select
          name="worker_name"
          value={form.worker_name}
          onChange={handleChange}
        >
          <option value="">{TEXTS.form.select.worker.value}</option>
          {workers.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </select>
      </FormField>

      <button onClick={handleSubmit} disabled={isSubmitting}>{TEXTS.form.addButton}</button>
    </div>
  );
};
