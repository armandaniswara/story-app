// src/scripts/pages/app.js

import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { isUserLoggedIn, removeAccessToken } from "../utils/auth";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #navList = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#navList = this.#navigationDrawer.querySelector("#nav-list");

    this._setupDrawer();
    this._updateAuthNav();
  }

  _setupDrawer() {
    // ... (kode _setupDrawer Anda tetap sama) ...
    this.#drawerButton.setAttribute("aria-expanded", "false");

    this.#drawerButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.#navigationDrawer.classList.toggle("open");
      const isExpanded = this.#navigationDrawer.classList.contains("open");
      this.#drawerButton.setAttribute("aria-expanded", isExpanded);
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
        this.#drawerButton.setAttribute("aria-expanded", "false");
      }
      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
          this.#drawerButton.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  _updateAuthNav() {
    // ... (kode _updateAuthNav Anda tetap sama) ...
    const authLinks = this.#navList.querySelectorAll(".auth-link");
    authLinks.forEach((link) => link.remove());

    if (isUserLoggedIn()) {
      this.#navList.innerHTML += `
        <li class="auth-link"><a href="#/add-story">Tambah Cerita</a></li>
        <li class="auth-link"><a href="#/notifications">Notifikasi</a></li>
        <li class="auth-link"><a href="#" id="logout-button">Logout</a></li>
      `;

      const logoutButton = this.#navList.querySelector("#logout-button");
      logoutButton.addEventListener("click", (event) => {
        event.preventDefault();
        removeAccessToken();
        window.location.hash = "#/login";
        window.location.reload();
      });
    } else {
      this.#navList.innerHTML += `
        <li class="auth-link"><a href="#/register">Register</a></li>
        <li class="auth-link"><a href="#/login">Login</a></li>
      `;
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    // =======================================================
    // ROUTE GUARD DENGAN ALERT
    // =======================================================
    if (url === "/add-story" && !isUserLoggedIn()) {
      // (1) TAMPILKAN ALERT
      alert("Anda harus login terlebih dahulu untuk mengakses halaman ini.");

      // (2) REDIRECT
      window.location.hash = "#/login";
      return;
    }

    if ((url === "/login" || url === "/register") && isUserLoggedIn()) {
      window.location.hash = "#/";
      return;
    }
    // =======================================================

    if (!page) {
      console.warn(
        `Rute tidak ditemukan untuk: ${url}. Mengalihkan ke Beranda.`
      );
      window.location.hash = "#/";
      return;
    }

    this._updateAuthNav();

    if (!document.startViewTransition) {
      // Fallback untuk browser lama (langsung ganti konten)
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      return;
    }

    // Jika didukung, jalankan transisi!
    const transition = document.startViewTransition(async () => {
      // (1) Perubahan DOM (mengganti konten)
      this.#content.innerHTML = await page.render();

      // (2) Panggil afterRender SETELAH konten baru ada
      await page.afterRender();
    });

    // (3) Tunggu transisi selesai (opsional, tapi praktik yang baik)
    await transition.finished;
  }
}

export default App;
