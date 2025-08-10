import React from "react";

export default function AppointmentCard({ appointment, onClick }) {
  return (
    <li
      className="list-group-item list-group-item-action"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <strong>Hasta:</strong> {appointment.patientName} <br />
      <strong>Tarih / Saat:</strong>{" "}
      {new Date(appointment.AppointmentDate).toLocaleString("tr-TR")} <br />
      <strong>Durum:</strong> {appointment.Status} <br />
      <strong>Not:</strong> {appointment.Notes}
    </li>
  );
}
