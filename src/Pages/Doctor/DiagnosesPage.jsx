import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Paging from "../../components/Paging";

export default function DiagnosesPage() {
  const { currentUser } = useContext(AuthContext);
  const [diagnoses, setDiagnoses] = useState([]);
  const [newDiagnosis, setNewDiagnosis] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const res = await fetch("/mock-data/diagnoses.json");
        const data = await res.json();
        setDiagnoses(data);
      } catch (err) {
        console.error("Tanılar yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, []);

  const handleAddDiagnosis = () => {
    if (!newDiagnosis.trim()) return;

    const newItem = {
      DiagnosisID: Date.now(),
      DiagnosisText: newDiagnosis,
      CreatedBy: currentUser.UserID,
      CreatedDate: new Date().toISOString(),
      IsApproved: true,
    };

    const updated = [...diagnoses, newItem];
    setDiagnoses(updated);
    setNewDiagnosis("");
  };

  const handleDelete = (id) => {
    const updated = diagnoses.filter((d) => d.DiagnosisID !== id);
    setDiagnoses(updated);
  };

  const myDiagnoses = diagnoses.filter(
    (d) => d.CreatedBy === currentUser?.UserID
  );

  const totalPages = Math.ceil(myDiagnoses.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentDiagnoses = myDiagnoses.slice(indexOfFirst, indexOfLast);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h4 className="mb-3">Tanılarım</h4>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Yeni tanı girin..."
          value={newDiagnosis}
          onChange={(e) => setNewDiagnosis(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleAddDiagnosis}>
          Ekle
        </button>
      </div>

      {myDiagnoses.length === 0 ? (
        <p>Hiç tanınız yok.</p>
      ) : (
        <>
          <ul className="list-group">
            {currentDiagnoses.map((d) => (
              <li
                key={d.DiagnosisID}
                className="list-group-item d-flex justify-content-between"
              >
                {d.DiagnosisText}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(d.DiagnosisID)}
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>

          <Paging
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
          />
        </>
      )}
    </div>
  );
}
