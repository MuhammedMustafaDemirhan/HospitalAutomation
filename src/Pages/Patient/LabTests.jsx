import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Paging from "../../Components/Paging";

export default function LabTests() {
  const { currentUser } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [testRequests, setTestRequests] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          appointmentsRes,
          testRequestsRes,
          testResultsRes,
          patientsRes,
          testsRes,
          doctorsRes,
          usersRes,
        ] = await Promise.all([
          fetch("/mock-data/appointments.json"),
          fetch("/mock-data/testrequests.json"),
          fetch("/mock-data/testresults.json"),
          fetch("/mock-data/patients.json"),
          fetch("/mock-data/tests.json"),
          fetch("/mock-data/doctors.json"),
          fetch("/mock-data/users.json"),
        ]);

        setAppointments(await appointmentsRes.json());
        setTestRequests(await testRequestsRes.json());
        setTestResults(await testResultsRes.json());
        setPatients(await patientsRes.json());
        setTests(await testsRes.json());
        setDoctors(await doctorsRes.json());
        setUsers(await usersRes.json());
      } catch (error) {
        console.error("Veri çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) return <p>Yükleniyor...</p>;
  if (!currentUser) return <p>Lütfen giriş yapınız.</p>;

  const patient = patients.find((p) => p.UserID === currentUser.UserID);
  if (!patient) return <p>Hasta bilgisi bulunamadı.</p>;

  const userAppointments = appointments.filter(
    (appt) => appt.PatientID === patient.PatientID
  );
  const userAppointmentIDs = userAppointments.map((a) => a.AppointmentID);

  const userTestRequests = testRequests.filter((tr) =>
    userAppointmentIDs.includes(tr.AppointmentID)
  );

  const totalPages = Math.ceil(userTestRequests.length / testsPerPage);
  const indexOfLast = currentPage * testsPerPage;
  const indexOfFirst = indexOfLast - testsPerPage;
  const currentTestRequests = userTestRequests.slice(indexOfFirst, indexOfLast);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleShowResult = (result) => {
    alert(
      `Test Sonucu:\n\n${result.Result}\n\nSonuç Tarihi: ${new Date(
        result.ResultDate
      ).toLocaleString("tr-TR")}`
    );
  };

  const getDoctorNameByDoctorID = (doctorID) => {
    const doctor = doctors.find((d) => d.DoctorID === doctorID);
    if (!doctor) return "Bilinmiyor";

    const user = users.find((u) => u.UserID === doctor.UserID);
    if (!user) return "Bilinmiyor";

    return `${user.Name} ${user.Surname}`;
  };

  return (
    <div>
      <h3>Tahliller</h3>
      {userTestRequests.length === 0 ? (
        <p>Henüz test talebiniz yok.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {currentTestRequests.map((testReq) => {
              const result = testResults.find(
                (res) => res.TestRequestID === testReq.TestRequestID
              );
              const testNameObj = tests.find(
                (t) => t.TestID === testReq.TestType
              );
              const testName = testNameObj
                ? testNameObj.TestName
                : "Bilinmeyen Test";

              const appointment = appointments.find(
                (a) => a.AppointmentID === testReq.AppointmentID
              );
              const doctorName = appointment
                ? getDoctorNameByDoctorID(appointment.DoctorID)
                : "Bilinmiyor";

              return (
                <li key={testReq.TestRequestID} className="list-group-item">
                  <p>
                    <strong>Test Talep Tarihi:</strong>{" "}
                    {new Date(testReq.RequestDate).toLocaleString("tr-TR")}
                  </p>
                  <p>
                    <strong>Test:</strong> {testName}
                  </p>
                  <p>
                    <strong>Doktor:</strong> {doctorName}
                  </p>
                  <p>
                    <strong>Test Sonucu: </strong>
                    {result ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleShowResult(result)}
                      >
                        Sonucu Göster
                      </button>
                    ) : (
                      <em>Sonuç bekleniyor...</em>
                    )}
                  </p>
                </li>
              );
            })}
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
