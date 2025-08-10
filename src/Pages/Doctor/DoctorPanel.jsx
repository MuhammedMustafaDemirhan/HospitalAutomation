import React, { useState, useEffect } from "react";
import PanelLayout from "../../Layouts/PanelLayout";
import Appointments from "./Appointments";
import LabRequests from "./LabRequests";
import TestRequests from "./TestRequests";
import DoctorProfile from "./DoctorProfile";
import DiagnosesPage from "./DiagnosesPage";
import TestResult from "./TestResults";
import LabTestResult from "./LabTestResult";
import DoctorAnnouncements from "./DoctorAnnouncements";

export default function DoctorPanel() {
  const [activeMenu, setActiveMenu] = useState("appointments");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);
  const menuItems = [
    {
      key: "appointments",
      label: "Randevular",
      active: activeMenu === "appointments",
      onClick: () => setActiveMenu("appointments"),
    },
    {
      key: "diagnoses",
      label: "Tanılar",
      active: activeMenu === "diagnoses",
      onClick: () => setActiveMenu("diagnoses"),
    },
    {
      key: "testRequests",
      label: "Tahlil İstekleri",
      active: activeMenu === "testRequests",
      onClick: () => setActiveMenu("testRequests"),
    },
    {
      key: "labRequests",
      label: "LAB İstekleri",
      active: activeMenu === "labRequests",
      onClick: () => setActiveMenu("labRequests"),
    },
    {
      key: "testResults",
      label: "Test Sonuçları",
      active: activeMenu === "testResults",
      onClick: () => setActiveMenu("testResults"),
    },
    {
      key: "labResults",
      label: "Lab. Sonuçları",
      active: activeMenu === "labResults",
      onClick: () => setActiveMenu("labResults"),
    },
    {
      key: "announcements",
      label: "Duyurular",
      active: activeMenu === "announcements",
      onClick: () => setActiveMenu("announcements"),
    },
    {
      key: "profile",
      label: "Profil Güncelleme",
      active: activeMenu === "profile",
      onClick: () => setActiveMenu("profile"),
    },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "appointments":
        return <Appointments />;
      case "diagnoses":
        return <DiagnosesPage />;
      case "testRequests":
        return <TestRequests />;
      case "labRequests":
        return <LabRequests />;
      case "testResults":
        return <TestResult />;
      case "labResults":
        return <LabTestResult />;
      case "announcements":
        return <DoctorAnnouncements />;
      case "profile":
        return <DoctorProfile />;
      default:
        return <Appointments />;
    }
  };

  return (
    <PanelLayout
      currentUser={currentUser}
      role="Doktor"
      menuItems={menuItems}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
    >
      {renderContent()}
    </PanelLayout>
  );
}
