import React, { useEffect, useState } from "react";
import Paging from "../../Components/Paging";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Surname: "",
    Email: "",
    RoleID: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9;
  const totalPages = Math.ceil(users.length / usersPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          fetch("/mock-data/users.json"),
          fetch("/mock-data/roles.json"),
        ]);
        const usersData = await usersRes.json();
        const rolesData = await rolesRes.json();
        setUsers(usersData);
        setRoles(rolesData);
      } catch (err) {
        console.error("Veri yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoleName = (roleID) => {
    const role = roles.find((r) => Number(r.RoleID) === Number(roleID));
    return role ? role.RoleName : "Bilinmiyor";
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setFormData({
      Name: user.Name,
      Surname: user.Surname,
      Email: user.Email,
      RoleID: String(user.RoleID),
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = () => {
    if (!selectedUser) return;

    const updated = users.map((u) =>
      u.UserID === selectedUser.UserID
        ? {
            ...u,
            ...formData,
            RoleID: Number(formData.RoleID),
          }
        : u
    );
    setUsers(updated);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    const filtered = users.filter((u) => u.UserID !== selectedUser.UserID);
    setUsers(filtered);
    resetForm();
  };

  const handleAdd = () => {
    if (
      !formData.Name ||
      !formData.Surname ||
      !formData.Email ||
      !formData.RoleID
    )
      return;

    const newUser = {
      UserID: Math.max(0, ...users.map((u) => u.UserID)) + 1,
      ...formData,
      RoleID: Number(formData.RoleID),
    };
    setUsers((prev) => [...prev, newUser]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ Name: "", Surname: "", Email: "", RoleID: "" });
    setIsEditing(false);
    setSelectedUser(null);
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="container mt-4 row">
      <div className="col-md-5">
        <h5>Kullanıcılar</h5>
        <ul className="list-group">
          {paginatedUsers.map((user) => (
            <li
              key={user.UserID}
              className={`list-group-item ${
                selectedUser?.UserID === user.UserID ? "active text-white" : ""
              }`}
              onClick={() => handleUserClick(user)}
              style={{ cursor: "pointer" }}
            >
              {user.Name} {user.Surname} - ({getRoleName(user.RoleID)})
            </li>
          ))}
        </ul>

        <Paging
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          onNext={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        />
      </div>

      <div className="col-md-7">
        <h5>{isEditing ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}</h5>
        <div className="card p-3 shadow">
          <div className="mb-2">
            <label className="form-label">Ad</label>
            <input
              className="form-control"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Soyad</label>
            <input
              className="form-control"
              name="Surname"
              value={formData.Surname}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Rol</label>
            <select
              className="form-select"
              name="RoleID"
              value={formData.RoleID}
              onChange={handleChange}
            >
              <option value="">Rol seçiniz</option>
              {roles.map((role) => (
                <option key={role.RoleID} value={role.RoleID}>
                  {role.RoleName}
                </option>
              ))}
            </select>
          </div>

          {isEditing ? (
            <div className="d-flex gap-2">
              <button className="btn btn-success w-100" onClick={handleUpdate}>
                Güncelle
              </button>
              <button className="btn btn-danger w-100" onClick={handleDelete}>
                Sil
              </button>
              <button className="btn btn-secondary w-100" onClick={resetForm}>
                Vazgeç
              </button>
            </div>
          ) : (
            <button className="btn btn-primary w-100" onClick={handleAdd}>
              Ekle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
