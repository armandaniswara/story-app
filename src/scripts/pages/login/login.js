// src/scripts/pages/login/login-page.js

import { getLogin } from "../../data/api";
import { saveAccessToken, isUserLoggedIn } from "../../utils/auth";

export default class LoginPage {
  async render() {
    return `
      <section class="container">
        <div id="notification-container"></div>
        <form id="login-form" class="auth-form">
        <h1>Login</h1>
          <div class="form-group">
            <label for="login-email">Email:</label>
            <input type="email" id="login-email" required>
          </div>
          <div class="form-group">
            <label for="login-password">Password:</label>
            <input type="password" id="login-password" required>
          </div>
          <button type="submit" id="submit-button" data-text="Login" class="button-submit">
            Login
          </button>
          <p class="auth-switch">Belum punya akun? <a href="#/register">Register di sini</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    // Redirect jika sudah login
    if (isUserLoggedIn()) {
      window.location.hash = "#/";
      return;
    }

    const form = document.querySelector("#login-form");
    const submitButton = document.querySelector("#submit-button");
    const originalButtonText = submitButton.dataset.text;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      submitButton.disabled = true;
      submitButton.innerText = "Masuk...";

      try {
        const email = document.querySelector("#login-email").value;
        const password = document.querySelector("#login-password").value;

        // (MODIFIKASI) Panggil getLogin dan cek 'ok'
        const response = await getLogin({ email, password });

        if (!response.ok) {
          throw new Error(response.message);
        }

        // (MODIFIKASI) Simpan token menggunakan saveAccessToken
        saveAccessToken(response.loginResult.token);

        this._showNotification("Login berhasil!", "success");
        setTimeout(() => {
          window.location.hash = "#/";
          window.location.reload();
        }, 1500);
      } catch (error) {
        this._showNotification(error.message, "error");
        submitButton.disabled = false;
        submitButton.innerText = originalButtonText;
      }
    });
  }

  // (Fungsi _showNotification tetap sama)
  _showNotification(message, type) {
    const container = document.querySelector("#notification-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (container.contains(toast)) container.removeChild(toast);
      }, 300);
    }, 3000);
  }
}
