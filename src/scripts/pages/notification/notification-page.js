// src/scripts/pages/notification/notification-page.js

import NotificationPresenter from "./notification-presenter";

// (1) UBAH DARI 'const' MENJADI 'class'
class NotificationPage {
  async render() {
    return `
      <section class="notification-page container auth-form"> 
        <h1 style="text-align: center; margin-bottom: 1.5rem;">Kelola Notifikasi</h1>
        <p>Aktifkan notifikasi untuk mendapatkan update story terbaru.</p>
        <div class="notification-actions">
          <button id="subscribeButton" class="button-submit">Aktifkan Notifikasi</button>
          <button id="unsubscribeButton" class="button-submit" style="background-color: #dc3545; margin-top: 10px;">Nonaktifkan Notifikasi</button>
        </div>
        <p id="notificationStatus" class="status-message" style="margin-top: 1rem; text-align: center;"></p>
      </section>
    `;
  }

  async afterRender() {
    const subscribeBtn = document.getElementById("subscribeButton");
    const unsubscribeBtn = document.getElementById("unsubscribeButton");
    const statusEl = document.getElementById("notificationStatus");

    NotificationPresenter.init({
      subscribeBtn,
      unsubscribeBtn,
      statusEl,
    });
  }
} // (2) Tutup class

export default NotificationPage; // (3) Ekspor class
