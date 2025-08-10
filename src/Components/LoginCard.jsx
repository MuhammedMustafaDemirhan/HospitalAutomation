import LoginForm from "./LoginForm";

export default function LoginCard({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  error,
}) {
  return (
    <div
      className="card p-4 shadow"
      style={{
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "rgba(255,255,255,0.95)",
        zIndex: 2,
        position: "relative",
      }}
    >
      <h3 className="text-center mb-3">Hastane Otomasyonu</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <LoginForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={onSubmit}
      />

      <p className="text-center mt-3">
        <a
          href="/forgot-password"
          className="text-decoration-none text-primary"
        >
          Şifremi Unuttum?
        </a>
      </p>
    </div>
  );
}
