export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email boş olamaz.";
  if (!regex.test(email)) return "Geçerli bir email giriniz.";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Şifre boş olamaz.";
  if (password.length <= 3) return "Şifre en az 4 karakter olmalı.";
  return null;
}
