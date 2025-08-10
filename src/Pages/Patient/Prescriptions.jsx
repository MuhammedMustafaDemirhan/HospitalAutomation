import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Paging from "../../Components/Paging";

export default function Prescriptions() {
  const { currentUser } = useContext(AuthContext);

  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionDetails, setPrescriptionDetails] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const prescriptionsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          prescriptionsRes,
          prescriptionDetailsRes,
          appointmentsRes,
          patientsRes,
          doctorsRes,
          usersRes,
        ] = await Promise.all([
          fetch("/mock-data/prescriptions.json"),
          fetch("/mock-data/prescriptionDetails.json"),
          fetch("/mock-data/appointments.json"),
          fetch("/mock-data/patients.json"),
          fetch("/mock-data/doctors.json"),
          fetch("/mock-data/users.json"),
        ]);

        const prescriptionsData = await prescriptionsRes.json();
        const prescriptionDetailsData = await prescriptionDetailsRes.json();
        const appointmentsData = await appointmentsRes.json();
        const patientsData = await patientsRes.json();
        const doctorsData = await doctorsRes.json();
        const usersData = await usersRes.json();

        setPrescriptionDetails(prescriptionDetailsData);
        setAppointments(appointmentsData);
        setPatients(patientsData);
        setDoctors(doctorsData);
        setUsers(usersData);

        const patient = patientsData.find(
          (p) => p.UserID === currentUser?.UserID
        );
        if (!patient) {
          setPrescriptions([]);
          setLoading(false);
          return;
        }

        const userAppointments = appointmentsData.filter(
          (appt) => appt.PatientID === patient.PatientID
        );

        const userAppointmentIDs = userAppointments.map((a) => a.AppointmentID);

        const userPrescriptions = prescriptionsData.filter((presc) =>
          userAppointmentIDs.includes(presc.AppointmentID)
        );

        setPrescriptions(userPrescriptions);
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

  const totalPages = Math.ceil(prescriptions.length / prescriptionsPerPage);
  const indexOfLast = currentPage * prescriptionsPerPage;
  const indexOfFirst = indexOfLast - prescriptionsPerPage;
  const currentPrescriptions = prescriptions.slice(indexOfFirst, indexOfLast);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (!currentUser) return <p>Lütfen giriş yapınız.</p>;

  return (
    <div>
      <h3>Reçetelerim</h3>
      {prescriptions.length === 0 ? (
        <p>Henüz reçeteniz yok.</p>
      ) : (
        <>
          {currentPrescriptions.map((presc) => {
            const appointment = appointments.find(
              (appt) => appt.AppointmentID === presc.AppointmentID
            );

            const doctor = doctors.find(
              (doc) => doc.DoctorID === appointment?.DoctorID
            );

            const doctorUser = users.find((u) => u.UserID === doctor?.UserID);

            const doctorName = doctorUser
              ? `${doctorUser.Name} ${doctorUser.Surname}`
              : "Bilinmiyor";

            return (
              <div
                key={presc.PrescriptionID}
                className="border rounded p-3 mb-3 bg-light"
                style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
              >
                <p>
                  <strong>Oluşturulma Tarihi:</strong>{" "}
                  {new Date(presc.CreatedDate).toLocaleString("tr-TR")}
                </p>
                <p>
                  <strong>Doktor:</strong> {doctorName}
                </p>
                <strong>İlaçlar:</strong>
                <ul>
                  {prescriptionDetails
                    .filter((d) => d.PrescriptionID === presc.PrescriptionID)
                    .map((detail) => (
                      <li key={detail.DetailID}>
                        <strong>{detail.MedicineName}</strong> - {detail.Dosage}
                        <br />
                        <em>{detail.UsageDetails}</em>
                      </li>
                    ))}
                </ul>
              </div>
            );
          })}

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
