import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Paging from "../../Components/Paging";

export default function Appointments() {
  const { currentUser } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apptRes = await fetch("/mock-data/appointments.json");
        const appts = await apptRes.json();

        const docRes = await fetch("/mock-data/doctors.json");
        const docs = await docRes.json();

        const userRes = await fetch("/mock-data/users.json");
        const users = await userRes.json();

        const deptRes = await fetch("/mock-data/departments.json");
        const depts = await deptRes.json();

        const doctorsWithDetails = docs.map((doc) => {
          const user = users.find((u) => u.UserID === doc.UserID);
          const dept = depts.find((d) => d.DepartmentID === doc.DepartmentID);
          return {
            ...doc,
            FirstName: user?.Name || "Bilinmiyor",
            LastName: user?.Surname || "",
            DepartmentName: dept?.Name || "Bilinmiyor",
          };
        });

        const userAppointments = appts.filter(
          (a) => a.PatientUserID === currentUser?.UserID
        );

        const appointmentsWithDetails = userAppointments.map((appt) => {
          const doctor = doctorsWithDetails.find(
            (doc) => doc.DoctorID === appt.DoctorID
          );
          return {
            ...appt,
            DoctorName: doctor
              ? `${doctor.FirstName} ${doctor.LastName}`
              : "Bilinmiyor",
            DepartmentName: doctor ? doctor.DepartmentName : "Bilinmiyor",
          };
        });

        setAppointments(appointmentsWithDetails);
        setDoctors(doctorsWithDetails);
        setDepartments(depts);
      } catch (error) {
        console.error("Veri çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchData();
  }, [currentUser]);

  const filteredDoctors = selectedDepartmentId
    ? doctors.filter(
        (doc) => doc.DepartmentID.toString() === selectedDepartmentId
      )
    : doctors;

  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [appointments.length, totalPages, currentPage]);

  const indexOfLast = currentPage * appointmentsPerPage;
  const indexOfFirst = indexOfLast - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirst, indexOfLast);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNewAppointment = () => {
    if (!newDate || !newTime || !selectedDoctorId) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }

    const appointmentDate = new Date(`${newDate}T${newTime}`);
    const now = new Date();

    if (appointmentDate < now) {
      alert("Geçmiş tarihten randevu alamazsınız.");
      return;
    }

    const newId =
      appointments.length > 0
        ? Math.max(...appointments.map((a) => a.AppointmentID)) + 1
        : 1;

    const doctor = doctors.find(
      (d) => d.DoctorID.toString() === selectedDoctorId
    );

    const newAppointment = {
      AppointmentID: newId,
      PatientUserID: currentUser.UserID,
      DoctorID: doctor.DoctorID,
      DoctorName: `${doctor.FirstName} ${doctor.LastName}`,
      DepartmentName: doctor.DepartmentName,
      AppointmentDate: appointmentDate.toISOString(),
      Status: "Beklemede",
      Notes: newNotes || "",
    };

    setAppointments((prev) => {
      const updated = [...prev, newAppointment];
      const newTotalPages = Math.ceil(updated.length / appointmentsPerPage);
      setCurrentPage(newTotalPages);
      return updated;
    });

    setNewDate("");
    setNewTime("");
    setSelectedDepartmentId("");
    setSelectedDoctorId("");
    setNewNotes("");
    setShowNewAppointmentForm(false);

    alert("Randevunuz başarıyla oluşturuldu!");
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h3>Randevularım</h3>

      {!selectedAppointment && (
        <>
          <button
            className="btn btn-success mb-3"
            onClick={() => setShowNewAppointmentForm(!showNewAppointmentForm)}
          >
            {showNewAppointmentForm ? "İptal" : "Yeni Randevu Al"}
          </button>

          {appointments.length === 0 ? (
            <p>Henüz randevunuz yok.</p>
          ) : (
            <>
              <ul className="list-group mb-4">
                {currentAppointments.map((appt) => (
                  <li
                    key={appt.AppointmentID}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedAppointment(appt)}
                  >
                    <strong>Tarih:</strong>{" "}
                    {new Date(appt.AppointmentDate).toLocaleString("tr-TR")}{" "}
                    <br />
                    <strong>Durum:</strong> {appt.Status} <br />
                    <strong>Doktor:</strong> {appt.DoctorName || "Bilinmiyor"}{" "}
                    <br />
                    <strong>Departman:</strong>{" "}
                    {appt.DepartmentName || "Bilinmiyor"}
                  </li>
                ))}
              </ul>

              <Paging
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
              />
            </>
          )}

          {showNewAppointmentForm && (
            <div className="card p-3 mt-2">
              <h4>Yeni Randevu Al</h4>

              <div className="mb-2">
                <label>Departman Seçiniz:</label>
                <select
                  className="form-select"
                  value={selectedDepartmentId}
                  onChange={(e) => {
                    setSelectedDepartmentId(e.target.value);
                    setSelectedDoctorId("");
                  }}
                >
                  <option value="">-- Departman Seçiniz --</option>
                  {departments.map((dept) => (
                    <option key={dept.DepartmentID} value={dept.DepartmentID}>
                      {dept.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label>Doktor Seçiniz:</label>
                <select
                  className="form-select"
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  disabled={!selectedDepartmentId}
                >
                  <option value="">-- Doktor Seçiniz --</option>
                  {filteredDoctors.map((doc) => (
                    <option key={doc.DoctorID} value={doc.DoctorID}>
                      {doc.FirstName} {doc.LastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <label>Tarih:</label>
                <input
                  type="date"
                  className="form-control"
                  value={newDate}
                  min={todayStr}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label>Saat:</label>
                <input
                  type="time"
                  className="form-control"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label>Notlar (opsiyonel):</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleNewAppointment}
              >
                Randevu Al
              </button>
            </div>
          )}
        </>
      )}

      {selectedAppointment && (
        <div className="card mt-3 p-3">
          <h4>Randevu Detayı</h4>
          <p>
            <strong>Tarih:</strong>{" "}
            {new Date(selectedAppointment.AppointmentDate).toLocaleString(
              "tr-TR"
            )}
          </p>
          <p>
            <strong>Durum:</strong> {selectedAppointment.Status}
          </p>
          <p>
            <strong>Doktor:</strong>{" "}
            {selectedAppointment.DoctorName || "Bilinmiyor"}
          </p>
          <p>
            <strong>Departman:</strong>{" "}
            {selectedAppointment.DepartmentName || "Bilinmiyor"}
          </p>
          <p>
            <strong>Notlar:</strong> {selectedAppointment.Notes || "Yok"}
          </p>

          {selectedAppointment.Status !== "İptal Edildi" && (
            <button
              className="btn btn-danger"
              onClick={() => {
                if (
                  window.confirm(
                    "Randevunuzu iptal etmek istediğinize emin misiniz?"
                  )
                ) {
                  setAppointments((prev) =>
                    prev.map((appt) =>
                      appt.AppointmentID === selectedAppointment.AppointmentID
                        ? { ...appt, Status: "İptal Edildi" }
                        : appt
                    )
                  );
                  setSelectedAppointment(null);
                }
              }}
            >
              Randevuyu İptal Et
            </button>
          )}

          <button
            className="btn btn-secondary mt-2"
            onClick={() => setSelectedAppointment(null)}
          >
            Geri Dön
          </button>
        </div>
      )}
    </div>
  );
}
