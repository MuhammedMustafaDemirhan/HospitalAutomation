import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import ProfileForm from "../../Components/ProfileForm";

export default function DoctorProfile() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <p>Yükleniyor...</p>;

  return <ProfileForm currentUser={currentUser} />;
}
