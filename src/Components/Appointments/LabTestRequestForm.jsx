import React from "react";

export default function LabTestRequestForm({
  labTests,
  selectedLabTestId,
  onSelectLabTest,
  onRequestLabTest,
}) {
  return (
    <div className="mb-3">
      <label className="form-label">Lab Testi Seçiniz:</label>
      <select
        className="form-select"
        value={selectedLabTestId}
        onChange={(e) => onSelectLabTest(e.target.value)}
      >
        <option value="">-- Lab Testi Seçiniz --</option>
        {labTests.map((labTest) => (
          <option key={labTest.TestID} value={labTest.TestID.toString()}>
            {labTest.TestName}
          </option>
        ))}
      </select>
      <button className="btn btn-danger mt-2" onClick={onRequestLabTest}>
        Lab Testi İste
      </button>
    </div>
  );
}
