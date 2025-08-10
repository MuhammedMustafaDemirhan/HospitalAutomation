import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import LoginCard from "../Components/LoginCard";
import { validateEmail, validatePassword } from "../utils/validation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setError(emailError || passwordError);
      return;
    }

    setLoading(true);

    try {
      const user = await login(email, password);

      if (!user) {
        setError("Kullanıcı adı veya şifre hatalı.");
        setLoading(false);
        return;
      }

      switch (user.RoleID) {
        case 1:
          navigate("/patient");
          break;
        case 2:
          navigate("/doctor");
          break;
        case 3:
          navigate("/admin");
          break;
        default:
          setError("Tanımsız rol.");
          break;
      }
    } catch (err) {
      setError("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      {loading ? (
        <div
          style={{ textAlign: "center", marginTop: "2rem", color: "#007bff" }}
        >
          <p>Giriş yapılıyor, lütfen bekleyiniz...</p>
        </div>
      ) : (
        <LoginCard
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onSubmit={handleLogin}
          error={error}
        />
      )}
    </div>
  );
}
