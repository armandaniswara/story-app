// src/scripts/pages/favorites/favorites-page.js

import { StoryDbFavorites } from "../../utils/db-helper";
import { generateStoriesItemTemplate } from "../../templates/template-creators";

class FavoritesPage {
  // (BARU) Simpan cerita di properti class agar mudah difilter
  #stories = [];

  async render() {
    return `
      <section class="container">
        <h1 style="text-align: center; margin-bottom: 1.5rem;">Cerita Favorit Anda</h1>
        
        <div class="form-group" style="max-width: 600px; margin: 1rem auto;">
          <label for="search-favorite">Cari Cerita Favorit:</label>
          <input type_="text" id="search-favorite" class="form-control" placeholder="Ketik nama atau deskripsi...">
        </div>

        <div class="stories-list__container">
          <div id="favorite-stories-list">
            <p>Memuat cerita favorit...</p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const favoriteListContainer = document.getElementById(
      "favorite-stories-list"
    );
    const searchInput = document.getElementById("search-favorite");

    try {
      // (1) Ambil semua data dari IndexedDB (hanya sekali)
      this.#stories = await StoryDbFavorites.getAllFavorites();

      // (2) Render daftar lengkap pertama kali
      this._renderFavoritesList(this.#stories, favoriteListContainer);

      // (3) Tambahkan event listener untuk memfilter
      searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredStories = this.#stories.filter(
          (story) =>
            story.name.toLowerCase().includes(searchTerm) ||
            story.description.toLowerCase().includes(searchTerm)
        );
        this._renderFavoritesList(filteredStories, favoriteListContainer);
      });
    } catch (error) {
      favoriteListContainer.innerHTML =
        '<p class="stories-list__empty">Gagal memuat favorit.</p>';
    }
  }

  /**
   * (BARU) Fungsi terpisah untuk me-render daftar
   * Ini akan dipanggil setiap kali (load awal dan saat mencari)
   */
  _renderFavoritesList(stories, container) {
    if (stories.length === 0) {
      container.innerHTML =
        '<p class="stories-list__empty">Tidak ada cerita favorit yang ditemukan.</p>';
      return;
    }

    // Tampilkan data
    let html = "";
    stories.forEach((story) => {
      html += generateStoriesItemTemplate(story);
    });
    container.innerHTML = `<div class="stories-list">${html}</div>`;

    // (PENTING) Pasang listener HANYA pada tombol yang ditampilkan
    container.querySelectorAll(".unfavorite-button").forEach((button) => {
      const storyId = button.dataset.id;

      // Sembunyikan tombol 'favorite' (karena ini sudah favorit)
      const favBtn = container.querySelector(
        `.favorite-button[data-id="${storyId}"]`
      );
      if (favBtn) favBtn.style.display = "none";
      button.style.display = "block"; // Tampilkan tombol unfavorite

      button.addEventListener("click", async (event) => {
        const storyId = event.currentTarget.dataset.id;
        await StoryDbFavorites.deleteFavorite(storyId);
        alert("Cerita dihapus dari Favorit!");

        // (PERBAIKAN) Render ulang dari awal setelah menghapus
        this.afterRender();
      });
    });
  }
}

export default FavoritesPage;
