import React from "react";

export default function Paging({ currentPage, totalPages, onPrev, onNext }) {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <button
        className="btn btn-secondary"
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        Önceki
      </button>
      <span>
        Sayfa {currentPage} / {totalPages}
      </span>
      <button
        className="btn btn-secondary"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Sonraki
      </button>
    </div>
  );
}
