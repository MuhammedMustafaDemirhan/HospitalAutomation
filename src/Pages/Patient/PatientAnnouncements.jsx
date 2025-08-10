import React, { useContext } from "react";
import Announcements from "../../Components/Announcements";
import { AuthContext } from "../../Context/AuthContext";

export default function PatientAnnouncements() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser || currentUser.RoleID !== 1) return null;

  return <Announcements roleID={1} />;
}
