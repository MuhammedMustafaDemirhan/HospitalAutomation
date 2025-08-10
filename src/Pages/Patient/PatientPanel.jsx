import React, { useEffect, useState } from "react";
import PanelLayout from "../../Layouts/PanelLayout";
import Appointments from "./Appointments";
import Feedback from "./Feedback";
import LabTests from "./LabTests";
import Prescriptions from "./Prescriptions";
import Profile from "./Profile";
import Radiology from "./Radiology";
import PatientAnnouncements from "./PatientAnnouncements";

export default function PatientPanel() {
  const [activeMenu, setActiveMenu] = useState("appointments");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);
  }, []);

  const menuItems = [
    {
      key: "appointments",
      label: "Randevu İşlemleri",
      active: activeMenu === "appointments",
      onClick: () => setActiveMenu("appointments"),
    },
    {
      key: "prescriptions",
      label: "Reçeteler",
      active: activeMenu === "prescriptions",
      onClick: () => setActiveMenu("prescriptions"),
    },
    {
      key: "labTests",
      label: "Tahliller",
      active: activeMenu === "labTests",
      onClick: () => setActiveMenu("labTests"),
    },
    {
      key: "radiology",
      label: "Radyolojik Görüntüleme",
      active: activeMenu === "radiology",
      onClick: () => setActiveMenu("radiology"),
    },
    {
      key: "announcements",
      label: "Duyurular",
      active: activeMenu === "announcements",
      onClick: () => setActiveMenu("announcements"),
    },
    {
      key: "feedback",
      label: "Şikayet / Geri Bildirim",
      active: activeMenu === "feedback",
      onClick: () => setActiveMenu("feedback"),
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
      case "prescriptions":
        return <Prescriptions />;
      case "labTests":
        return <LabTests />;
      case "radiology":
        return <Radiology />;
      case "announcements":
        return <PatientAnnouncements />;
      case "feedback":
        return <Feedback />;
      case "profile":
        return <Profile />;
      default:
        return <Appointments />;
    }
  };

  return (
    <PanelLayout
      currentUser={currentUser}
      role="Hasta"
      menuItems={menuItems}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
    >
      {renderContent()}
    </PanelLayout>
  );
}
