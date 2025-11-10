// src/scripts/pages/register/register-page.js

import { getRegistered } from '../../data/api';
import { isUserLoggedIn } from '../../utils/auth';

export default class RegisterPage {
  async render() {
    return `
      <section class="container">
        <div id="notification-container"></div>
        <form id="register-form" class="auth-form">
          <h1>Registrasi</h1>
          <div class="form-group">
            <label for="register-name">Nama:</label>
            <input type="text" id="register-name" required>
          </div>
          <div class="form-group">
            <label for="register-email">Email:</label>
            <input type="email" id="register-email" required>
          </div>
          <div class="form-group">
            <label for="register-password">Password:</label>
            <input type="password" id="register-password" minlength="8" required>
          </div>
          <button type="submit" id="submit-button" data-text="Register" class="button-submit">
            Register
          </button>
          <p class="auth-switch">Sudah punya akun? <a href="#/login">Login di sini</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    // Redirect jika sudah login
    if (isUserLoggedIn()) {
      window.location.hash = '#/';
      return;
    }

    const form = document.querySelector('#register-form');
    const submitButton = document.querySelector('#submit-button');
    const originalButtonText = submitButton.dataset.text;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      submitButton.disabled = true;
      submitButton.innerText = 'Mendaftar...';

      try {
        const name = document.querySelector('#register-name').value;
        const email = document.querySelector('#register-email').value;
        const password = document.querySelector('#register-password').value;

        // (MODIFIKASI) Panggil getRegistered dan cek 'ok'
        const response = await getRegistered({ name, email, password });

        if (!response.ok) {
          throw new Error(response.message);
        }

        this._showNotification('Registrasi berhasil! Silakan login.', 'success');
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 2000);

      } catch (error) {
        this._showNotification(error.message, 'error');
        submitButton.disabled = false;
        submitButton.innerText = originalButtonText;
      }
    });
  }
  
  // (Fungsi _showNotification tetap sama)
  _showNotification(message, type) {
    // ... (kode sama seperti di login-page.js) ...
    const container = document.querySelector('#notification-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (container.contains(toast)) container.removeChild(toast);
      }, 300);
    }, 3000);
  }
}