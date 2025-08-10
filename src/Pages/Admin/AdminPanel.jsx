import React, { useState, useEffect } from "react";
import PanelLayout from "../../Layouts/PanelLayout";
import UserManagement from "./UserManagement";
import DepartmentManagement from "./DepartmentManagement";
import AppointmentTracking from "./AppointmentTracking";
import Announcements from "./Announcements";
import Feedbacks from "./Feedbacks";
import Diagnoses from "./Diagnoses";
import AdminProfile from "./AdminProfile";

export default function AdminPanel() {
  const [activeMenu, setActiveMenu] = useState("userManagement");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case "userManagement":
        return <UserManagement />;
      case "departmentManagement":
        return <DepartmentManagement />;
      case "appointmentTracking":
        return <AppointmentTracking />;
      case "announcements":
        return <Announcements />;
      case "feedbacks":
        return <Feedbacks />;
      case "diagnoses":
        return <Diagnoses />;
      case "adminProfile":
        return <AdminProfile />;
      default:
        return <UserManagement />;
    }
  };

  const menuItems = [
    { key: "userManagement", label: "Kullanıcı Yönetimi" },
    { key: "departmentManagement", label: "Departman Yönetimi" },
    { key: "appointmentTracking", label: "Randevu Takibi" },
    { key: "announcements", label: "Duyuru / Mesaj Yayınlama" },
    { key: "feedbacks", label: "Şikayet / Geri Bildirim" },
    { key: "diagnoses", label: "Tanılar" },
    { key: "adminProfile", label: "Profil Güncelleme" },
  ];

  return (
    <PanelLayout
      role="Yönetici"
      currentUser={currentUser}
      menuItems={menuItems}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
    >
      {renderContent()}
    </PanelLayout>
  );
}
