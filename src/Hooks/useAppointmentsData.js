import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function useAppointmentsData() {
  const { currentUser } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diagnoses, setDiagnoses] = useState([]);
  const [tests, setTests] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionDetails, setPrescriptionDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          appointmentsRes,
          doctorsRes,
          patientsRes,
          usersRes,
          diagnosesRes,
          testsRes,
          labTestsRes,
          prescriptionsRes,
          prescriptionDetailsRes,
        ] = await Promise.all([
          fetch("/mock-data/appointments.json"),
          fetch("/mock-data/doctors.json"),
          fetch("/mock-data/patients.json"),
          fetch("/mock-data/users.json"),
          fetch("/mock-data/diagnoses.json"),
          fetch("/mock-data/tests.json"),
          fetch("/mock-data/labtesttypes.json"),
          fetch("/mock-data/prescriptions.json"),
          fetch("/mock-data/prescriptionDetails.json"),
        ]);

        const appointmentsData = await appointmentsRes.json();
        const doctorsData = await doctorsRes.json();
        const patientsData = await patientsRes.json();
        const usersData = await usersRes.json();
        const diagnosesData = await diagnosesRes.json();
        const testsData = await testsRes.json();
        const labTestsData = await labTestsRes.json();
        const prescriptionsData = await prescriptionsRes.json();
        const prescriptionDetailsData = await prescriptionDetailsRes.json();

        setDiagnoses(diagnosesData);
        setTests(testsData);
        setLabTests(labTestsData);
        setPrescriptions(prescriptionsData);
        setPrescriptionDetails(prescriptionDetailsData);

        const thisDoctor = doctorsData.find(
          (doc) => doc.UserID === currentUser?.UserID
        );
        if (!thisDoctor) {
          setAppointments([]);
          return;
        }

        const userAppointments = appointmentsData
          .filter((appt) => appt.DoctorID === thisDoctor.DoctorID)
          .map((appt) => {
            const patient = patientsData.find(
              (p) => p.PatientID === appt.PatientID
            );
            const user = usersData.find((u) => u.UserID === patient?.UserID);
            return {
              ...appt,
              patientName: user ? `${user.Name} ${user.Surname}` : "Bilinmiyor",
            };
          });

        setAppointments(userAppointments);
      } catch (err) {
        console.error("Veriler yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  return {
    appointments,
    setAppointments,
    loading,
    diagnoses,
    tests,
    labTests,
    prescriptions,
    setPrescriptions,
    prescriptionDetails,
    setPrescriptionDetails,
  };
}
