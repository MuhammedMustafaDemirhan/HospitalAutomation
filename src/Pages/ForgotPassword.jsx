import React, { useState, useEffect } from "react";
import { validateEmail } from "../utils/validation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/mock-data/users.json")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setUsers([]));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const user = users.find((u) => u.Email === email);

    if (!user) {
      setError("Bu e-posta ile eşleşen bir kullanıcı bulunamadı.");
      return;
    }

    setMessage("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    setEmail("");
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h4 className="text-center mb-3">Şifremi Unuttum</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">E-posta Adresi</label>
            <input
              type="email"
              className="form-control"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sıfırlama Bağlantısı Gönder
          </button>
        </form>
      </div>
    </div>
  );
}
