import React, { useEffect, useState } from "react";
import Paging from "../../Components/Paging";

export default function Diagnoses() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editIsApproved, setEditIsApproved] = useState(false);
  const [editDate, setEditDate] = useState("");

  const [newText, setNewText] = useState("");
  const [newIsApproved, setNewIsApproved] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    async function fetchDiagnoses() {
      try {
        const res = await fetch("/mock-data/diagnoses.json");
        const data = await res.json();
        setDiagnoses(data);
      } catch (err) {
        console.error("Tanılar yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDiagnoses();
  }, []);

  const startEdit = (diagnosis) => {
    setEditId(diagnosis.DiagnosisID);
    setEditText(diagnosis.DiagnosisText);
    setEditIsApproved(diagnosis.IsApproved);
    setEditDate(diagnosis.CreatedDate.slice(0, 10));
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const saveEdit = () => {
    if (!editText.trim() || !editDate) {
      alert("Tanı metni ve tarih boş olamaz.");
      return;
    }
    setDiagnoses((prev) =>
      prev.map((d) =>
        d.DiagnosisID === editId
          ? {
              ...d,
              DiagnosisText: editText,
              IsApproved: editIsApproved,
              CreatedDate: editDate,
            }
          : d
      )
    );
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu tanıyı silmek istediğinize emin misiniz?")) {
      const updated = diagnoses.filter((d) => d.DiagnosisID !== id);
      setDiagnoses(updated);
      const totalPages = Math.ceil(updated.length / itemsPerPage);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages > 0 ? totalPages : 1);
      }
    }
  };

  const handleAddDiagnosis = () => {
    if (!newText.trim() || !newDate) {
      alert("Tanı metni ve tarih boş olamaz.");
      return;
    }
    const newId =
      diagnoses.length > 0
        ? Math.max(...diagnoses.map((d) => d.DiagnosisID)) + 1
        : 1;

    const newDiagnosis = {
      DiagnosisID: newId,
      DiagnosisText: newText,
      CreatedBy: 4,
      CreatedDate: newDate,
      IsApproved: newIsApproved,
    };

    const updated = [...diagnoses, newDiagnosis];
    setDiagnoses(updated);

    setCurrentPage(Math.ceil(updated.length / itemsPerPage));

    setNewText("");
    setNewIsApproved(false);
    setNewDate("");
    setShowNewForm(false);
  };

  const totalPages = Math.ceil(diagnoses.length / itemsPerPage);

  const paginatedDiagnoses = diagnoses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Tanılar yükleniyor...</p>;

  return (
    <div>
      <h3>Tanılar Yönetimi</h3>

      {!showNewForm && (
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowNewForm(true)}
        >
          Yeni Tanı Ekle
        </button>
      )}

      {showNewForm && (
        <div className="mb-4 p-3 border rounded bg-light">
          <h5>Yeni Tanı Ekle</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Tanı metni"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <div className="form-check mb-2">
            <input
              id="newApprovedCheck"
              type="checkbox"
              className="form-check-input"
              checked={newIsApproved}
              onChange={(e) => setNewIsApproved(e.target.checked)}
            />
            <label htmlFor="newApprovedCheck" className="form-check-label">
              Onaylı mı?
            </label>
          </div>
          <input
            type="date"
            className="form-control mb-2 w-auto"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <button className="btn btn-success me-2" onClick={handleAddDiagnosis}>
            Ekle
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowNewForm(false)}
          >
            İptal
          </button>
        </div>
      )}

      <ul className="list-group">
        {paginatedDiagnoses.map((d) => (
          <li key={d.DiagnosisID} className="list-group-item">
            {editId === d.DiagnosisID ? (
              <div>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="form-check mb-2">
                  <input
                    id="approvedCheck"
                    type="checkbox"
                    className="form-check-input"
                    checked={editIsApproved}
                    onChange={(e) => setEditIsApproved(e.target.checked)}
                  />
                  <label htmlFor="approvedCheck" className="form-check-label">
                    Onaylı mı?
                  </label>
                </div>
                <input
                  type="date"
                  className="form-control mb-2 w-auto"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={saveEdit}
                >
                  Kaydet
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={cancelEdit}
                >
                  İptal
                </button>
              </div>
            ) : (
              <div>
                <strong>{d.DiagnosisText}</strong> <br />
                <small>
                  Oluşturan ID: {d.CreatedBy} |{" "}
                  {new Date(d.CreatedDate).toLocaleDateString("tr-TR")} | Durum:{" "}
                  {d.IsApproved ? "Onaylı" : "Onaysız"}
                </small>
                <div className="mt-2">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => startEdit(d)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(d.DiagnosisID)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Paging
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          onNext={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        />
      )}
    </div>
  );
}
