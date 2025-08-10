// DiagnosisForm.jsx örneği (benzer şekilde TestRequestForm ve LabTestRequestForm için de geçerli)

export default function DiagnosisForm({
  diagnoses,
  selectedDiagnosisId,
  onSelectDiagnosis,
  onConfirm,
}) {
  return (
    <div className="mb-3">
      <label>Tanı Seçiniz:</label>
      <select
        className="form-select"
        value={selectedDiagnosisId}
        onChange={(e) => onSelectDiagnosis(e.target.value)}
      >
        <option value="">-- Lütfen Seçin --</option> {/* Boş seçenek */}
        {diagnoses.map((diag) => (
          <option key={diag.DiagnosisID} value={diag.DiagnosisID.toString()}>
            {diag.DiagnosisText}
          </option>
        ))}
      </select>
      <button className="btn btn-primary mt-2" onClick={onConfirm}>
        Onayla
      </button>
    </div>
  );
}
