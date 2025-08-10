import React from "react";

export default function TestRequestForm({
  tests,
  selectedTestId,
  onSelectTest,
  onRequest,
}) {
  return (
    <div className="mb-3">
      <label className="form-label">Test / Tahlil Seçiniz:</label>
      <select
        className="form-select"
        value={selectedTestId}
        onChange={(e) => onSelectTest(e.target.value)}
      >
        <option value="">-- Test Seçiniz --</option>
        {tests.map((test) => (
          <option key={test.TestID} value={test.TestID.toString()}>
            {test.TestName}
          </option>
        ))}
      </select>
      <button className="btn btn-success mt-2" onClick={onRequest}>
        Test / Tahlil İste
      </button>
    </div>
  );
}
