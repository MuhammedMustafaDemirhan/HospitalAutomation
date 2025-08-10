import React, { useEffect, useState } from "react";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const departmentsPerPage = 8;

  useEffect(() => {
    fetch("/mock-data/departments.json")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch(() => setDepartments([]));
  }, []);

  const handleAdd = () => {
    if (!newName.trim()) return;

    const newDept = {
      DepartmentID:
        departments.length > 0
          ? Math.max(...departments.map((d) => d.DepartmentID)) + 1
          : 1,
      Name: newName.trim(),
    };

    setDepartments([...departments, newDept]);
    setNewName("");
  };

  const handleDelete = (id) => {
    const updated = departments.filter((d) => d.DepartmentID !== id);
    setDepartments(updated);
  };

  const startEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdate = (id) => {
    if (!editingName.trim()) return;

    const updated = departments.map((d) =>
      d.DepartmentID === id ? { ...d, Name: editingName.trim() } : d
    );

    setDepartments(updated);
    setEditingId(null);
    setEditingName("");
  };

  const totalPages = Math.ceil(departments.length / departmentsPerPage);
  const paginatedDepartments = departments.slice(
    (currentPage - 1) * departmentsPerPage,
    currentPage * departmentsPerPage
  );

  return (
    <div className="container mt-4">
      <h3>Departman Yönetimi</h3>

      <div className="input-group mb-3" style={{ maxWidth: 400 }}>
        <input
          className="form-control"
          placeholder="Bölüm adı girin..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          Ekle
        </button>
      </div>

      {departments.length === 0 ? (
        <p>Hiç bölüm bulunamadı.</p>
      ) : (
        <>
          <ul className="list-group">
            {paginatedDepartments.map((dept) => (
              <li
                key={dept.DepartmentID}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {editingId === dept.DepartmentID ? (
                  <>
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="form-control me-2"
                      style={{ maxWidth: 300 }}
                    />
                    <div className="btn-group">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleUpdate(dept.DepartmentID)}
                      >
                        Kaydet
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                        }}
                      >
                        Vazgeç
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{dept.Name}</span>
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => startEdit(dept.DepartmentID, dept.Name)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(dept.DepartmentID)}
                      >
                        Sil
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          <nav className="mt-3">
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
