import React, { useState } from "react";
import { validateEmail, validatePassword } from "../utils/validation";

export default function ProfileForm({ currentUser, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    Name: currentUser?.Name || "",
    Surname: currentUser?.Surname || "",
    Email: currentUser?.Email || "",
    Password: currentUser?.Password || "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailErr = validateEmail(formData.Email);
    const passErr = validatePassword(formData.Password);

    if (emailErr) newErrors.Email = emailErr;
    if (passErr) newErrors.Password = passErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedUser = { ...currentUser, ...formData };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setMessage("Bilgiler başarıyla güncellendi.");
    setEditing(false);
    onUpdate && onUpdate(updatedUser);
  };

  return (
    <div
      className="card p-4 shadow-sm"
      style={{ maxWidth: "500px", margin: "0 auto" }}
    >
      <h4 className="mb-3 text-center">Profil Bilgilerim</h4>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="mb-3">
        <label className="form-label">Ad</label>
        <input
          className="form-control"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Soyad</label>
        <input
          className="form-control"
          name="Surname"
          value={formData.Surname}
          onChange={handleChange}
          disabled={!editing}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          className={`form-control ${errors.Email ? "is-invalid" : ""}`}
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          disabled={!editing}
        />
        {errors.Email && <div className="invalid-feedback">{errors.Email}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Şifre</label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            className={`form-control ${errors.Password ? "is-invalid" : ""}`}
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            disabled={!editing}
          />
          {editing && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? "Gizle" : "Göster"}
            </button>
          )}
        </div>
        {errors.Password && (
          <div className="invalid-feedback d-block">{errors.Password}</div>
        )}
      </div>

      {!editing ? (
        <button
          className="btn btn-primary w-100"
          onClick={() => setEditing(true)}
        >
          Bilgileri Düzenle
        </button>
      ) : (
        <div className="d-flex gap-2">
          <button className="btn btn-success w-100" onClick={handleSave}>
            Kaydet
          </button>
          <button
            className="btn btn-secondary w-100"
            onClick={() => setEditing(false)}
          >
            Vazgeç
          </button>
        </div>
      )}
    </div>
  );
}
