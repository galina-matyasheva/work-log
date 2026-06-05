import "./Pagination.css";

import { TEXTS } from "constants/texts";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: Props) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={handlePrevPage}>
        {TEXTS.pagination.buttonBack}
      </button>

      <span>
        {currentPage} / {totalPages}
      </span>

      <button disabled={currentPage === totalPages} onClick={handleNextPage}>
        {TEXTS.pagination.buttonForward}
      </button>
    </div>
  );
};
