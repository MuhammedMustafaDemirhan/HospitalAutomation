import React, { useEffect, useState } from "react";
import Paging from "../../components/Paging"; // Paging bileşeni

export default function LabTestResults() {
  const [results, setResults] = useState([]);
  const [labRequests, setLabRequests] = useState([]);
  const [tests, setTests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          resultsRes,
          labReqRes,
          testsRes,
          appointmentsRes,
          patientsRes,
          usersRes,
        ] = await Promise.all([
          fetch("/mock-data/labtestresults.json"),
          fetch("/mock-data/labrequests.json"),
          fetch("/mock-data/labtesttypes.json"),
          fetch("/mock-data/appointments.json"),
          fetch("/mock-data/patients.json"),
          fetch("/mock-data/users.json"),
        ]);

        const [
          resultsData,
          labReqData,
          testsData,
          appointmentsData,
          patientsData,
          usersData,
        ] = await Promise.all([
          resultsRes.json(),
          labReqRes.json(),
          testsRes.json(),
          appointmentsRes.json(),
          patientsRes.json(),
          usersRes.json(),
        ]);

        setResults(resultsData);
        setLabRequests(labReqData);
        setTests(testsData);
        setAppointments(appointmentsData);
        setPatients(patientsData);
        setUsers(usersData);
      } catch (err) {
        console.error("Veriler yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const getPatientName = (labRequestId) => {
    const req = labRequests.find((r) => r.LabRequestID === labRequestId);
    if (!req) return "Bilinmeyen";

    const appointment = appointments.find(
      (a) => a.AppointmentID === req.AppointmentID
    );
    if (!appointment) return "Bilinmeyen";

    const patient = patients.find((p) => p.PatientID === appointment.PatientID);
    if (!patient) return "Bilinmeyen";

    const user = users.find((u) => u.UserID === patient.UserID);
    return user ? `${user.Name} ${user.Surname}` : "Bilinmeyen";
  };

  const getTestName = (labRequestId) => {
    const req = labRequests.find((r) => r.LabRequestID === labRequestId);
    if (!req) return "Bilinmeyen";

    const test = tests.find((t) => t.TestID === req.TestType);
    return test ? test.TestName || test.LabTestName : "Bilinmeyen";
  };

  // Sayfalama hesaplamaları
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentResults = results.slice(indexOfFirst, indexOfLast);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="container mt-4">
      <h4>Lab Test Sonuçları</h4>
      {results.length === 0 ? (
        <p>Herhangi bir lab sonucu bulunmamaktadır.</p>
      ) : (
        <>
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Hasta Adı</th>
                <th>Test Adı</th>
                <th>Sonuç</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((res, index) => (
                <tr key={res.LabResultID}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{getPatientName(res.LabRequestID)}</td>
                  <td>{getTestName(res.LabRequestID)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => alert(res.ResultDescription)}
                    >
                      Sonucu Gör
                    </button>
                  </td>
                  <td>{new Date(res.ResultDate).toLocaleString("tr-TR")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Paging
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          />
        </>
      )}
    </div>
  );
}
