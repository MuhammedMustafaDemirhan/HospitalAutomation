import React, { useEffect, useState } from "react";
import Paging from "../../components/Paging";

export default function LabRequests() {
  const [requests, setRequests] = useState([]);
  const [labTests, setLabTests] = useState([]);
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
          reqRes,
          labTestRes,
          appRes,
          patRes,
          userRes,
        ] = await Promise.all([
          fetch("/mock-data/labrequests.json"),
          fetch("/mock-data/labtesttypes.json"),
          fetch("/mock-data/appointments.json"),
          fetch("/mock-data/patients.json"),
          fetch("/mock-data/users.json"),
        ]);

        const [
          reqData,
          labTestData,
          appData,
          patData,
          userData,
        ] = await Promise.all([
          reqRes.json(),
          labTestRes.json(),
          appRes.json(),
          patRes.json(),
          userRes.json(),
        ]);

        setRequests(reqData);
        setLabTests(labTestData);
        setAppointments(appData);
        setPatients(patData);
        setUsers(userData);
      } catch (err) {
        console.error("Veriler yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const getTestName = (testId) => {
    const found = labTests.find((t) => t.TestID === testId);
    return found ? found.TestName : "Bilinmiyor";
  };

  const getPatientNameByAppointmentID = (appointmentId) => {
    const appointment = appointments.find(
      (a) => a.AppointmentID === appointmentId
    );
    if (!appointment) return "Bilinmeyen Hasta";

    const patient = patients.find((p) => p.PatientID === appointment.PatientID);
    if (!patient) return "Bilinmeyen Hasta";

    const user = users.find((u) => u.UserID === patient.UserID);
    return user ? `${user.Name} ${user.Surname}` : "Bilinmeyen Hasta";
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu laboratuvar test isteğini silmek istiyor musunuz?"))
      return;

    const updated = requests.filter((req) => req.LabRequestID !== id);
    setRequests(updated);
  };

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRequests = requests.slice(indexOfFirst, indexOfLast);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="container mt-4">
      <h4>Laboratuvar Test İstekleri</h4>

      {requests.length === 0 ? (
        <p>Herhangi bir lab testi isteği bulunmamaktadır.</p>
      ) : (
        <>
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Hasta Adı</th>
                <th>Test Adı</th>
                <th>İstek Tarihi</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((req, index) => (
                <tr key={req.LabRequestID}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{getPatientNameByAppointmentID(req.AppointmentID)}</td>
                  <td>{getTestName(req.TestType)}</td>
                  <td>{new Date(req.RequestDate).toLocaleString("tr-TR")}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger w-50 mx-5"
                      style={{ width: "80px", padding: "6px" }}
                      onClick={() => handleDelete(req.LabRequestID)}
                    >
                      Sil
                    </button>
                  </td>
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
