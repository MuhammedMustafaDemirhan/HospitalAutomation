import React from "react";

export default function AppointmentActions({
  appointmentId,
  onComplete,
  onCancel,
  onBack,
}) {
  return (
    <div className="d-flex gap-2 flex-wrap mb-3">
      <button
        className="btn btn-success"
        onClick={() => onComplete(appointmentId)}
      >
        Randevuyu Tamamla
      </button>
      <button
        className="btn btn-danger"
        onClick={() => onCancel(appointmentId)}
      >
        Randevuyu İptal Et
      </button>
      <button className="btn btn-secondary" onClick={onBack}>
        Geri Dön
      </button>
    </div>
  );
}
