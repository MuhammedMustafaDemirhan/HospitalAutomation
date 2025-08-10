import React from "react";

export default function AppointmentList({ appointments, onSelect }) {
  if (appointments.length === 0)
    return <p>Aktif randevunuz bulunmamaktadır.</p>;

  return (
    <div>
      <h4>Randevu Listesi</h4>
      <ul className="list-group">
        {appointments.map((appt) => (
          <li
            key={appt.AppointmentID}
            className="list-group-item list-group-item-action"
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(appt)}
          >
            <strong>Hasta:</strong> {appt.patientName} <br />
            <strong>Tarih / Saat:</strong>{" "}
            {new Date(appt.AppointmentDate).toLocaleString("tr-TR")} <br />
            <strong>Durum:</strong> {appt.Status} <br />
            <strong>Not:</strong> {appt.Notes}
          </li>
        ))}
      </ul>
    </div>
  );
}
