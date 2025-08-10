import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import useAppointmentsData from "../../hooks/useAppointmentsData";

import DiagnosisForm from "../../Components/Appointments/DiagnosisForm";
import TestRequestForm from "../../Components/Appointments/TestRequestForm";
import LabTestRequestForm from "../../Components/Appointments/LabTestRequestForm";
import PrescriptionSection from "../../Components/Appointments/PrescriptionSection";
import AppointmentCard from "../../Components/Appointments/AppointmentCard";
import AppointmentActions from "../../Components/Appointments/AppointmentActions";

export default function Appointments() {
  const { currentUser } = useContext(AuthContext);
  const {
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
  } = useAppointmentsData(currentUser);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState("");
  const [selectedTestId, setSelectedTestId] = useState("");
  const [selectedLabTestId, setSelectedLabTestId] = useState("");

  const [activePrescriptionId, setActivePrescriptionId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [newMedicineName, setNewMedicineName] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [newUsageDetails, setNewUsageDetails] = useState("");
  const [newPrescriptionDate, setNewPrescriptionDate] = useState("");

  const getPrescriptionsForAppointment = (appointmentId) =>
    prescriptions.filter((p) => p.AppointmentID === appointmentId);

  const handleAppointmentClick = (appt) => {
    setSelectedAppointment(appt);
    setSelectedDiagnosisId("");
    setSelectedTestId("");
    setSelectedLabTestId("");
  };

  const handleBack = () => setSelectedAppointment(null);

  const handleCompleteAppointment = (appointmentId) => {
    const updated = appointments.map((appt) =>
      appt.AppointmentID === appointmentId
        ? { ...appt, Status: "Tamamlandı" }
        : appt
    );
    setAppointments(updated);
    setSelectedAppointment(null);
  };

  const handleCancelAppointment = (appointmentId) => {
    if (!window.confirm("Randevuyu iptal etmek istiyor musunuz?")) return;
    const updated = appointments.map((appt) =>
      appt.AppointmentID === appointmentId ? { ...appt, Status: "İptal" } : appt
    );
    setAppointments(updated);
    setSelectedAppointment(null);
  };

  const handleDiagnosisConfirm = () => {
    if (!selectedDiagnosisId) return alert("Tanı seçiniz.");
    const diagnosis = diagnoses.find(
      (d) => d.DiagnosisID.toString() === selectedDiagnosisId
    );
    alert(`Tanı onaylandı: ${diagnosis?.DiagnosisText}`);
  };

  const handleTestRequest = () => {
    if (!selectedTestId) return alert("Test seçiniz.");
    const test = tests.find((t) => t.TestID.toString() === selectedTestId);
    alert(`Test isteği: ${test?.TestName}`);
  };

  const handleLabTestRequest = () => {
    if (!selectedLabTestId) return alert("Lab testi seçiniz.");
    const labTest = labTests.find(
      (l) => l.TestID.toString() === selectedLabTestId
    );
    alert(`Lab testi isteği: ${labTest?.TestName}`);
  };

  const handleAddPrescription = (appointmentId, date) => {
    if (!date) return alert("Tarih seçiniz.");
    const newId =
      prescriptions.length > 0
        ? Math.max(...prescriptions.map((p) => p.PrescriptionID)) + 1
        : 1;
    const newPrescription = {
      PrescriptionID: newId,
      AppointmentID: appointmentId,
      CreatedDate: date,
    };
    setPrescriptions((prev) => [...prev, newPrescription]);
  };

  const handleAddMedicineToPrescription = (
    prescriptionId,
    medicineName,
    dosage,
    usageDetails
  ) => {
    const newDetailId =
      prescriptionDetails.length > 0
        ? Math.max(...prescriptionDetails.map((d) => d.DetailID)) + 1
        : 1;
    const newDetail = {
      DetailID: newDetailId,
      PrescriptionID: prescriptionId,
      MedicineName: medicineName,
      Dosage: dosage,
      UsageDetails: usageDetails,
    };
    setPrescriptionDetails((prev) => [...prev, newDetail]);
  };

  const handleDeletePrescription = (id) => {
    if (!window.confirm("Reçeteyi silmek istiyor musunuz?")) return;
    setPrescriptions((prev) => prev.filter((p) => p.PrescriptionID !== id));
    setPrescriptionDetails((prev) =>
      prev.filter((d) => d.PrescriptionID !== id)
    );
  };

  const handleDeleteMedicine = (detailId) => {
    if (!window.confirm("İlacı silmek istiyor musunuz?")) return;
    setPrescriptionDetails((prev) =>
      prev.filter((detail) => detail.DetailID !== detailId)
    );
  };

  const handleSaveEditPrescription = (id, newDate) => {
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.PrescriptionID === id ? { ...p, CreatedDate: newDate } : p
      )
    );
  };

  const handleStartEdit = (prescription) => {
    setActivePrescriptionId(prescription.PrescriptionID);
    setEditDate(prescription.CreatedDate.substring(0, 10));
  };

  const handleCancelEdit = () => {
    setActivePrescriptionId(null);
    setEditDate("");
  };

  const handleSaveEdit = () => {
    handleSaveEditPrescription(activePrescriptionId, editDate);
    setActivePrescriptionId(null);
    setEditDate("");
  };

  const handleAddMedicine = (prescriptionId) => {
    if (!newMedicineName || !newDosage) {
      alert("İlaç adı ve dozaj giriniz.");
      return;
    }
    handleAddMedicineToPrescription(
      prescriptionId,
      newMedicineName,
      newDosage,
      newUsageDetails
    );
    setNewMedicineName("");
    setNewDosage("");
    setNewUsageDetails("");
  };

  const activeAppointments = appointments.filter(
    (appt) => appt.Status !== "Tamamlandı" && appt.Status !== "İptal"
  );

  if (loading) return <p>Yükleniyor...</p>;
  if (activeAppointments.length === 0)
    return <p>Aktif randevunuz bulunmamaktadır.</p>;

  return (
    <div>
      <h4>Randevu Listesi</h4>

      {!selectedAppointment && (
        <ul className="list-group">
          {activeAppointments.map((appt) => (
            <AppointmentCard
              key={appt.AppointmentID}
              appointment={appt}
              onClick={() => handleAppointmentClick(appt)}
            />
          ))}
        </ul>
      )}

      {selectedAppointment && (
        <div className="card mt-4 p-3">
          <h5>Randevu Detayı</h5>
          <p>
            <strong>Hasta:</strong> {selectedAppointment.patientName}
          </p>
          <p>
            <strong>Tarih:</strong>{" "}
            {new Date(selectedAppointment.AppointmentDate).toLocaleString(
              "tr-TR"
            )}
          </p>
          <p>
            <strong>Durum:</strong> {selectedAppointment.Status}
          </p>
          <AppointmentActions
            appointmentId={selectedAppointment.AppointmentID}
            onComplete={handleCompleteAppointment}
            onCancel={handleCancelAppointment}
            onBack={handleBack}
          />

          <hr />
          <h5>İşlemler</h5>
          <DiagnosisForm
            diagnoses={diagnoses}
            selectedDiagnosisId={selectedDiagnosisId}
            onSelectDiagnosis={setSelectedDiagnosisId}
            onConfirm={handleDiagnosisConfirm}
          />
          <TestRequestForm
            tests={tests}
            selectedTestId={selectedTestId}
            onSelectTest={setSelectedTestId}
            onRequest={handleTestRequest}
          />
          <LabTestRequestForm
            labTests={labTests}
            selectedLabTestId={selectedLabTestId}
            onSelectLabTest={setSelectedLabTestId}
            onRequestLabTest={handleLabTestRequest}
          />

          <hr />
          <h5>Reçeteler</h5>

          <div className="mb-3 d-flex align-items-center gap-2">
            <input
              type="date"
              className="form-control w-auto"
              value={newPrescriptionDate}
              onChange={(e) => setNewPrescriptionDate(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!newPrescriptionDate) return alert("Tarih girin");
                handleAddPrescription(
                  selectedAppointment.AppointmentID,
                  newPrescriptionDate
                );
                setNewPrescriptionDate("");
              }}
            >
              Yeni Reçete Oluştur
            </button>
          </div>

          {getPrescriptionsForAppointment(
            selectedAppointment.AppointmentID
          ).map((prescription) => (
            <PrescriptionSection
              key={prescription.PrescriptionID}
              prescription={prescription}
              details={prescriptionDetails.filter(
                (d) => d.PrescriptionID === prescription.PrescriptionID
              )}
              onDeletePrescription={handleDeletePrescription}
              onDeleteMedicine={handleDeleteMedicine}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onAddMedicine={handleAddMedicine}
              activePrescriptionId={activePrescriptionId}
              editDate={editDate}
              setEditDate={setEditDate}
              newMedicineName={newMedicineName}
              setNewMedicineName={setNewMedicineName}
              newDosage={newDosage}
              setNewDosage={setNewDosage}
              newUsageDetails={newUsageDetails}
              setNewUsageDetails={setNewUsageDetails}
              setActivePrescriptionId={setActivePrescriptionId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
