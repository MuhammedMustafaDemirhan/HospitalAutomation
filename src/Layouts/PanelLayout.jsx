import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import LogoutButton from "../Components/LogoutButton";

export default function PanelLayout({
  children,
  menuItems,
  activeMenu,
  setActiveMenu,
}) {
  const { currentUser } = useContext(AuthContext);

  const roleName = currentUser?.roleName || "Yetki Yok";

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div
        className="d-flex flex-column justify-content-between"
        style={{
          width: "280px",
          backgroundColor: "#007bff",
          color: "white",
          padding: "1.25rem",
        }}
      >
        <div
          className="d-flex align-items-center gap-3 mb-3 p-2 rounded"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            minHeight: "50px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff33",
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              color: "#fff",
              fontSize: "1.1rem",
            }}
          >
            {currentUser?.Name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "0.95rem",
                color: "white",
              }}
            >
              {currentUser
                ? `${currentUser.Name} ${currentUser.Surname}`
                : "Yükleniyor..."}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#ddd" }}>{roleName}</div>
          </div>
        </div>

        <ul className="nav flex-column" style={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={`nav-link py-2 px-2 rounded ${
                activeMenu === item.key
                  ? "fw-bold text-white bg-white bg-opacity-25"
                  : "text-white-50"
              }`}
              style={{
                cursor: "pointer",
                marginBottom: "4px",
                transition: "all 0.2s",
              }}
              onClick={() => setActiveMenu(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <div className="mt-3 w-100">
          <LogoutButton />
        </div>
      </div>

      <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}
