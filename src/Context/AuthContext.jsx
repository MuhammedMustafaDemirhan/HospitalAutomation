import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/mock-data/roles.json")
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch(() => setRoles([]));
  }, []);

  useEffect(() => {
    fetch("/mock-data/users.json")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setUsers([]));
  }, []);

  const login = async (email, password) => {
    if (users.length === 0 || roles.length === 0) {
      return null;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = users.find(
      (u) => u.Email === email && u.Password === password
    );
    if (!user) return null;

    const roleObj = roles.find((r) => r.RoleID === user.RoleID);
    const userWithRole = {
      ...user,
      roleName: roleObj ? roleObj.RoleName : "Bilinmeyen Rol",
    };

    setCurrentUser(userWithRole);
    localStorage.setItem("currentUser", JSON.stringify(userWithRole));

    return userWithRole;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) setCurrentUser(storedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
