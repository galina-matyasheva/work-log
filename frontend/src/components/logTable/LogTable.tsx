import "./LogTable.css";

import { LogApi } from "api/LogApi";
import { Pagination } from "components/common/pagination/Pagination";
import { ConfirmDeleteModal } from "components/modals/confirmDeleteModal/ConfirmDeleteModal";
import { EditLogModal } from "components/modals/editLogModal/EditLogModal";
import { TEXTS } from "constants/texts";
import { useState } from "react";
import {
  FaEdit,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTrash,
} from "react-icons/fa";
import { LogItem } from "types/log";
import { Unit } from "types/unit";
import { Worker } from "types/worker";
import { formatDate } from "utils/formatDate";
import { formatVolume } from "utils/formatVolume";

type Props = {
  items: LogItem[];
  onDelete: (id: number) => Promise<void>;
  reload: () => void;
  resetFormErrors: () => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  workers: Worker[];
  units: Unit[];
};

export const LogTable = ({
  items,
  onDelete,
  reload,
  resetFormErrors,
  onError,
  onSuccess,
  workers,
  units,
}: Props) => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editItem, setEditItem] = useState<LogItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 14;
  const handleOpenDelete = (id: number) => () => {
    resetFormErrors();
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    try {
      await onDelete(deleteId);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }

    if (paginatedItems.length === 1 && currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  const handleOpenEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = Number(e.currentTarget.dataset.id);

    const item = items.find((i) => i.id === id);
    if (!item) return;
    resetFormErrors();
    setEditItem(item);
  };

  const handleSaveEdit = async (updated: Omit<LogItem, "date">) => {
    try {
      await LogApi.update(updated.id, updated);

      setEditItem(null);
      reload();
      onSuccess(TEXTS.notification.success.updated);
    } catch {
      onError(TEXTS.notification.error.update);
    }
  };

  const isEmpty = items.length === 0;

  const handleSortByDate = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  const sortedItems = [...items].sort((a, b) => {
    const parseDate = (s: string) => { const p = s.split("-"); return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])).getTime(); };
    const firstDate = parseDate(a.date);
    const secondDate = parseDate(b.date);

    return sortDirection === "asc"
      ? firstDate - secondDate
      : secondDate - firstDate;
  });

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;

  const paginatedItems = sortedItems.slice(startIndex, startIndex + pageSize);

  const getUnitLabel = (value: string) => {
    return units.find((u) => u.value === value)?.label ?? value;
  };

  const getWorkerLabel = (value: string) => {
    return workers.find((w) => w.value === value)?.label ?? value;
  };

  return (
    <>
      <div className="log-table-wrapper">
        <table border={1} cellPadding={8} className="log-table-container">
          <thead>
            <tr>
              <th className="log-table-sort-container">
                <button
                  className="log-table-sort-button"
                  onClick={handleSortByDate}
                >
                  {TEXTS.table.date}

                  {sortDirection === "asc" ? (
                    <FaSortAmountUp />
                  ) : (
                    <FaSortAmountDown />
                  )}
                </button>
              </th>
              <th>{TEXTS.table.work}</th>
              <th>{TEXTS.table.volume}</th>
              <th>{TEXTS.table.unit}</th>
              <th>{TEXTS.table.worker}</th>
              <th>{TEXTS.table.action}</th>
            </tr>
          </thead>

          {isEmpty && (
            <tbody>
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 24 }}>
                  {TEXTS.table.empty}
                </td>
              </tr>
            </tbody>
          )}
          <tbody>
            {!isEmpty && paginatedItems.map((item) => (
              <tr key={item.id}>
                <td>{formatDate(item.date)}</td>
                <td>{item.work_type}</td>
                <td>{formatVolume(item.volume)}</td>
                <td>{getUnitLabel(item.unit)}</td>
                <td>{getWorkerLabel(item.worker_name)}</td>
                <td>
                  <div className="log-table-icon-buttons">
                    <button
                      onClick={handleOpenDelete(item.id)}
                      title={TEXTS.table.title.delete}
                    >
                      <FaTrash />
                    </button>
                    <button
                      data-id={item.id}
                      onClick={handleOpenEdit}
                      title={TEXTS.table.title.edit}
                    >
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        open={deleteId !== null}
        text={TEXTS.modal.delete.text}
        disabled={isDeleting}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {editItem && (
        <EditLogModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleSaveEdit}
          workers={workers}
          units={units}
        />
      )}
      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};
