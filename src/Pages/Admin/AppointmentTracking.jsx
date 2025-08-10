import React, { useState, useEffect } from "react";

export default function AppointmentTracking() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterDoctorId, setFilterDoctorId] = useState("");
  const [filterPatientId, setFilterPatientId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          appointmentsRes,
          doctorsRes,
          patientsRes,
          usersRes,
        ] = await Promise.all([
          fetch("/mock-data/appointments.json"),
          fetch("/mock-data/doctors.json"),
          fetch("/mock-data/patients.json"),
          fetch("/mock-data/users.json"),
        ]);
        const appointmentsData = await appointmentsRes.json();
        const doctorsData = await doctorsRes.json();
        const patientsData = await patientsRes.json();
        const usersData = await usersRes.json();

        setAppointments(appointmentsData);
        setDoctors(doctorsData);
        setPatients(patientsData);
        setUsers(usersData);
      } catch (err) {
        console.error("Veri yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getUserNameByPatientId = (patientId) => {
    const patient = patients.find((p) => p.PatientID === patientId);
    if (!patient) return "Bilinmiyor";
    const user = users.find((u) => u.UserID === patient.UserID);
    return user ? `${user.Name} ${user.Surname}` : "Bilinmiyor";
  };

  const getUserNameByDoctorId = (doctorId) => {
    const doctor = doctors.find((d) => d.DoctorID === doctorId);
    if (!doctor) return "Bilinmiyor";
    const user = users.find((u) => u.UserID === doctor.UserID);
    return user ? `${user.Name} ${user.Surname}` : "Bilinmiyor";
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (filterDoctorId && appt.DoctorID.toString() !== filterDoctorId)
      return false;
    if (filterPatientId && appt.PatientID.toString() !== filterPatientId)
      return false;
    if (filterStatus && appt.Status !== filterStatus) return false;
    if (searchText) {
      const patientName = getUserNameByPatientId(appt.PatientID).toLowerCase();
      const doctorName = getUserNameByDoctorId(appt.DoctorID).toLowerCase();
      if (
        !patientName.includes(searchText.toLowerCase()) &&
        !doctorName.includes(searchText.toLowerCase())
      )
        return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.AppointmentID === appointmentId
          ? { ...appt, Status: newStatus }
          : appt
      )
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterDoctorId, filterPatientId, filterStatus, searchText]);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h3>Randevu Takibi</h3>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        <select
          className="form-select"
          value={filterDoctorId}
          onChange={(e) => setFilterDoctorId(e.target.value)}
        >
          <option value="">Tüm Doktorlar</option>
          {doctors.map((doc) => (
            <option key={doc.DoctorID} value={doc.DoctorID}>
              {getUserNameByDoctorId(doc.DoctorID)}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={filterPatientId}
          onChange={(e) => setFilterPatientId(e.target.value)}
        >
          <option value="">Tüm Hastalar</option>
          {patients.map((p) => (
            <option key={p.PatientID} value={p.PatientID}>
              {getUserNameByPatientId(p.PatientID)}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tüm Durumlar</option>
          <option value="Beklemede">Beklemede</option>
          <option value="Tamamlandı">Tamamlandı</option>
          <option value="İptal">İptal</option>
        </select>

        <input
          type="text"
          className="form-control"
          placeholder="Hasta veya Doktor Ara"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: "300px" }}
        />
      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Hasta</th>
            <th>Doktor</th>
            <th>Tarih / Saat</th>
            <th>Durum</th>
            <th>Not</th>
            <th>Durum Güncelle</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAppointments.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                Filtreye uyan randevu bulunamadı.
              </td>
            </tr>
          ) : (
            paginatedAppointments.map((appt) => (
              <tr key={appt.AppointmentID}>
                <td>{getUserNameByPatientId(appt.PatientID)}</td>
                <td>{getUserNameByDoctorId(appt.DoctorID)}</td>
                <td>
                  {new Date(appt.AppointmentDate).toLocaleString("tr-TR")}
                </td>
                <td>{appt.Status}</td>
                <td>{appt.Notes}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={appt.Status}
                    onChange={(e) =>
                      handleStatusChange(appt.AppointmentID, e.target.value)
                    }
                  >
                    <option value="Beklemede">Beklemede</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                    <option value="İptal">İptal</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Paging
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          onNext={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        />
      )}
    </div>
  );
}
