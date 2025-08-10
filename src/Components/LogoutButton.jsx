import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Çıkış yapmak istediğinize emin misiniz?");
    if (confirmed) {
      logout();
      navigate("/");
    }
  };

  return (
    <button
      className="btn btn-light text-primary fs-6 w-100"
      onClick={handleLogout}
    >
      Çıkış Yap
    </button>
  );
}
