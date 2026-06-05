import "./ConfirmDeleteModal.css";

import { TEXTS } from "constants/texts";

type Props = {
  open: boolean;
  text?: string;
  disabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDeleteModal = ({
  open,
  text = TEXTS.modal.delete.text,
  disabled,
  onConfirm,
  onCancel,
}: Props) => {
  if (!open) return null;

  return (
    <div className="confirm-delete-modal-container">
      <div className="confirm-delete-modal">
        <p>{text}</p>

        <div className="confirm-delete-modal-buttons-container">
          <button
            className="confirm-delete-modal-cancel-button"
            onClick={onCancel}
          >
            {TEXTS.modal.delete.cancel}
          </button>
          <button
            onClick={onConfirm}
            disabled={disabled}
            className="confirm-delete-modal-confirm-button"
          >
            {TEXTS.modal.delete.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};
