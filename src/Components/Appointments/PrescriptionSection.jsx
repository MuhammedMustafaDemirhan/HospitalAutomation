import React from "react";
import PrescriptionItem from "./PrescriptionItem";

export default function PrescriptionSection({
  prescription,
  details,
  onDeletePrescription,
  onDeleteMedicine,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onAddMedicine,
  activePrescriptionId,
  editDate,
  setEditDate,
  newMedicineName,
  setNewMedicineName,
  newDosage,
  setNewDosage,
  newUsageDetails,
  setNewUsageDetails,
  setActivePrescriptionId,
}) {
  if (!prescription) return null; // Reçete yoksa boş render

  return (
    <div className="border rounded p-3 my-2 bg-light">
      <p>
        <strong>Reçete Tarihi:</strong>{" "}
        {prescription.PrescriptionID === activePrescriptionId ? (
          <>
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="form-control d-inline w-auto me-2"
            />
            <button
              className="btn btn-success btn-sm me-1"
              onClick={onSaveEdit}
            >
              Kaydet
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onCancelEdit}>
              İptal
            </button>
          </>
        ) : (
          <>
            {new Date(prescription.CreatedDate).toLocaleDateString("tr-TR")}
            <button
              className="btn btn-warning btn-sm ms-2 me-1"
              onClick={() => onStartEdit(prescription)}
            >
              Güncelle
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDeletePrescription(prescription.PrescriptionID)}
            >
              Sil
            </button>
          </>
        )}
      </p>

      <ul>
        {details.map((detail) => (
          <PrescriptionItem
            key={detail.DetailID}
            detail={detail}
            onDelete={onDeleteMedicine}
          />
        ))}
      </ul>

      {activePrescriptionId === prescription.PrescriptionID ? (
        <div className="mt-3">
          <h6>İlaç Ekle</h6>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="İlaç Adı"
            value={newMedicineName}
            onChange={(e) => setNewMedicineName(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Dozaj (ör: Günde 2 kez)"
            value={newDosage}
            onChange={(e) => setNewDosage(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Kullanım Detayı"
            value={newUsageDetails}
            onChange={(e) => setNewUsageDetails(e.target.value)}
          />
          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => onAddMedicine(prescription.PrescriptionID)}
          >
            Ekle
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActivePrescriptionId(null)}
          >
            İptal
          </button>
        </div>
      ) : (
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setActivePrescriptionId(prescription.PrescriptionID)}
        >
          İlaç Ekle
        </button>
      )}
    </div>
  );
}
