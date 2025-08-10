import React, { useEffect, useState } from "react";
import Paging from "../../components/Paging";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newRoleId, setNewRoleId] = useState(1);

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editRoleId, setEditRoleId] = useState(1);

  const [filterRoleId, setFilterRoleId] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Yeni form göster/gizle durumu
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [annRes, roleRes] = await Promise.all([
          fetch("/mock-data/announcements.json"),
          fetch("/mock-data/roles.json"),
        ]);
        const annData = await annRes.json();
        const roleData = await roleRes.json();

        setAnnouncements(annData);
        setRoles(roleData.filter((r) => r.RoleID !== 3));
        setNewRoleId(roleData.find((r) => r.RoleID !== 3)?.RoleID || 1);
      } catch (err) {
        console.error("Veriler yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddAnnouncement = () => {
    if (!newTitle || !newContent || !newDate) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const newId =
      announcements.length > 0
        ? Math.max(...announcements.map((a) => a.AnnouncementID)) + 1
        : 1;

    const newAnnouncement = {
      AnnouncementID: newId,
      Title: newTitle,
      Content: newContent,
      CreatedDate: newDate,
      TargetRoleID: newRoleId,
    };

    const updated = [...announcements, newAnnouncement];
    setAnnouncements(updated);
    setCurrentPage(Math.ceil(updated.length / itemsPerPage));

    // Form kapat ve alanları temizle
    setShowAddForm(false);
    setNewTitle("");
    setNewContent("");
    setNewDate("");
    setNewRoleId(roles.find((r) => r.RoleID !== 3)?.RoleID || 1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu duyuruyu silmek istiyor musunuz?")) {
      const updated = announcements.filter((a) => a.AnnouncementID !== id);
      setAnnouncements(updated);
      const newTotalPages = Math.ceil(updated.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
      }
    }
  };

  const startEdit = (a) => {
    setEditId(a.AnnouncementID);
    setEditTitle(a.Title);
    setEditContent(a.Content);
    setEditDate(a.CreatedDate.slice(0, 10));
    setEditRoleId(a.TargetRoleID);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  const saveEdit = () => {
    if (!editTitle || !editContent || !editDate) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const updated = announcements.map((a) =>
      a.AnnouncementID === editId
        ? {
            ...a,
            Title: editTitle,
            Content: editContent,
            CreatedDate: editDate,
            TargetRoleID: editRoleId,
          }
        : a
    );

    setAnnouncements(updated);
    setEditId(null);
  };

  const filteredAnnouncements =
    filterRoleId === 0
      ? announcements
      : announcements.filter((a) => a.TargetRoleID === filterRoleId);

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);

  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Duyurular yükleniyor...</p>;

  return (
    <div>
      <h3>Admin Duyurular Yönetimi</h3>

      {/* Yeni Duyuru Ekle Butonu */}
      {!showAddForm && (
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowAddForm(true)}
        >
          Yeni Duyuru Ekle
        </button>
      )}

      {/* Yeni Duyuru Formu */}
      {showAddForm && (
        <div className="mb-4 p-3 border rounded bg-light">
          <h5>Yeni Duyuru Ekle</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Başlık"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            placeholder="İçerik"
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <input
            type="date"
            className="form-control mb-2 w-auto"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <select
            className="form-select w-auto"
            value={newRoleId}
            onChange={(e) => setNewRoleId(Number(e.target.value))}
          >
            {roles.map((role) => (
              <option key={role.RoleID} value={role.RoleID}>
                {role.RoleName}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <button
              className="btn btn-primary me-2"
              onClick={handleAddAnnouncement}
            >
              Ekle
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowAddForm(false)}
            >
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Filtrele:</label>
        <select
          className="form-select w-auto d-inline-block ms-2"
          value={filterRoleId}
          onChange={(e) => {
            setFilterRoleId(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={0}>Tüm Roller</option>
          {roles.map((role) => (
            <option key={role.RoleID} value={role.RoleID}>
              {role.RoleName}
            </option>
          ))}
        </select>
      </div>

      <h5>Mevcut Duyurular</h5>
      {filteredAnnouncements.length === 0 && <p>Duyuru bulunmamaktadır.</p>}

      <ul className="list-group">
        {paginatedAnnouncements.map((a) => (
          <li key={a.AnnouncementID} className="list-group-item">
            {editId === a.AnnouncementID ? (
              <div>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="form-control mb-2"
                  rows={3}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <input
                  type="date"
                  className="form-control mb-2 w-auto"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
                <select
                  className="form-select w-auto mb-2"
                  value={editRoleId}
                  onChange={(e) => setEditRoleId(Number(e.target.value))}
                >
                  {roles.map((role) => (
                    <option key={role.RoleID} value={role.RoleID}>
                      {role.RoleName}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={saveEdit}
                >
                  Kaydet
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={cancelEdit}
                >
                  İptal
                </button>
              </div>
            ) : (
              <div>
                <strong>{a.Title}</strong> <br />
                <small>
                  {new Date(a.CreatedDate).toLocaleDateString("tr-TR")}
                </small>{" "}
                <br />
                <em>{a.Content}</em> <br />
                <small>
                  Hedef Rol:{" "}
                  {roles.find((r) => r.RoleID === a.TargetRoleID)?.RoleName}
                </small>
                <div className="mt-2">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => startEdit(a)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(a.AnnouncementID)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Paging
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          onNext={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        />
      )}
    </div>
  );
}
