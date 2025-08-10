import React, { useContext } from "react";
import Announcements from "../../Components/Announcements";
import { AuthContext } from "../../Context/AuthContext";

export default function DoctorAnnouncements() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser || currentUser.RoleID !== 2) return null;

  return <Announcements roleID={2} />;
}
