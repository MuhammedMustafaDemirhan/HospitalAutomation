import React from "react";

export default function PrescriptionItem({ detail, onDelete }) {
  return (
    <li className="d-flex justify-content-between align-items-start">
      <div>
        <strong>{detail.MedicineName}</strong> – {detail.Dosage} –{" "}
        <em>{detail.UsageDetails}</em>
      </div>
      <button
        className="btn btn-sm btn-outline-danger ms-2"
        onClick={() => onDelete(detail.DetailID)}
      >
        Sil
      </button>
    </li>
  );
}
