import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Paging from "../../Components/Paging";

export default function Radiology() {
  const { currentUser } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [labRequests, setLabRequests] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [labTestTypes, setLabTestTypes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          appointmentsRes,
          labRequestsRes,
          labResultsRes,
          labTestTypesRes,
          patientsRes,
          doctorsRes,
          usersRes,
        ] = await Promise.all([
          fetch("/mock-data/appointments.json"),
          fetch("/mock-data/labrequests.json"),
          fetch("/mock-data/labtestresults.json"),
          fetch("/mock-data/labtesttypes.json"),
          fetch("/mock-data/patients.json"),
          fetch("/mock-data/doctors.json"),
          fetch("/mock-data/users.json"),
        ]);

        setAppointments(await appointmentsRes.json());
        setLabRequests(await labRequestsRes.json());
        setLabResults(await labResultsRes.json());
        setLabTestTypes(await labTestTypesRes.json());
        setPatients(await patientsRes.json());
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

  const userLabRequests = labRequests.filter((lr) =>
    userAppointmentIDs.includes(lr.AppointmentID)
  );

  const totalPages = Math.ceil(userLabRequests.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentLabRequests = userLabRequests.slice(indexOfFirst, indexOfLast);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleShowResult = (labRequestID) => {
    const result = labResults.find((r) => r.LabRequestID === labRequestID);
    if (result) {
      alert(
        `Test Sonucu:\n\n${
          result.ResultDescription
        }\n\nSonuç Tarihi: ${new Date(result.ResultDate).toLocaleString(
          "tr-TR"
        )}`
      );
    } else {
      alert("Test sonucu henüz gelmedi.");
    }
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
      <h3>Radyoloji Testleri</h3>
      {userLabRequests.length === 0 ? (
        <p>Henüz radyoloji testi talebiniz bulunmamaktadır.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {currentLabRequests.map((labReq) => {
              const testType = labTestTypes.find(
                (t) => t.TestID === labReq.TestType
              );
              const testName = testType ? testType.TestName : "Bilinmeyen Test";

              const appointment = appointments.find(
                (a) => a.AppointmentID === labReq.AppointmentID
              );
              const doctorName = appointment
                ? getDoctorNameByDoctorID(appointment.DoctorID)
                : "Bilinmiyor";

              return (
                <li key={labReq.LabRequestID} className="list-group-item">
                  <p>
                    <strong>Test Talep Tarihi:</strong>{" "}
                    {new Date(labReq.RequestDate).toLocaleString("tr-TR")}
                  </p>
                  <p>
                    <strong>Test:</strong> {testName}
                  </p>
                  <p>
                    <strong>Doktor:</strong> {doctorName}
                  </p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleShowResult(labReq.LabRequestID)}
                  >
                    Test Sonucu
                  </button>
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
