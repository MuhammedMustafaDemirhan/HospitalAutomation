import React, { useEffect, useState } from "react";
import Paging from "../../components/Paging"; // Sayfalama bileşeni

export default function TestResults() {
  const [results, setResults] = useState([]);
  const [testRequests, setTestRequests] = useState([]);
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
          requestsRes,
          testsRes,
          appointmentsRes,
          patientsRes,
          usersRes,
        ] = await Promise.all([
          fetch("/mock-data/testresults.json"),
          fetch("/mock-data/testrequests.json"),
          fetch("/mock-data/tests.json"),
          fetch("/mock-data/appointments.json"),
          fetch("/mock-data/patients.json"),
          fetch("/mock-data/users.json"),
        ]);

        const [
          resultsData,
          requestsData,
          testsData,
          appointmentsData,
          patientsData,
          usersData,
        ] = await Promise.all([
          resultsRes.json(),
          requestsRes.json(),
          testsRes.json(),
          appointmentsRes.json(),
          patientsRes.json(),
          usersRes.json(),
        ]);

        setResults(resultsData);
        setTestRequests(requestsData);
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

  const getPatientName = (testRequestId) => {
    const req = testRequests.find((r) => r.TestRequestID === testRequestId);
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

  const getTestName = (testRequestId) => {
    const req = testRequests.find((r) => r.TestRequestID === testRequestId);
    if (!req) return "Bilinmeyen";

    const test = tests.find((t) => t.TestID === req.TestType);
    return test ? test.TestName : "Bilinmeyen";
  };

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentResults = results.slice(indexOfFirst, indexOfLast);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="container mt-4">
      <h4>Test Sonuçları</h4>

      {results.length === 0 ? (
        <p>Test sonucu bulunmamaktadır.</p>
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
                <tr key={res.TestResultID}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{getPatientName(res.TestRequestID)}</td>
                  <td>{getTestName(res.TestRequestID)}</td>
                  <td>{res.Result}</td>
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
