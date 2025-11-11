import { StoryDbFavorites } from "../../utils/db-helper";
import { generateStoriesItemTemplate } from "../../templates/template-creators";

class FavoritesPage {
  async render() {
    return `
      <section class="container">
        <h1 style="text-align: center; margin-bottom: 1.5rem;">Cerita Favorit Anda</h1>
        
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

    // (READ) Ambil semua data dari IndexedDB
    const stories = await StoryDbFavorites.getAllFavorites();

    if (stories.length === 0) {
      favoriteListContainer.innerHTML =
        '<p class="stories-list__empty">Anda belum punya cerita favorit.</p>';
      return;
    }

    // Tampilkan data
    let html = "";
    stories.forEach((story) => {
      html += generateStoriesItemTemplate(story);
    });
    favoriteListContainer.innerHTML = `<div class="stories-list">${html}</div>`;

    // (DELETE) Tambahkan listener untuk tombol unfavorite di halaman ini
    favoriteListContainer
      .querySelectorAll(".unfavorite-button")
      .forEach((button) => {
        // Sembunyikan tombol 'favorite' (karena ini sudah favorit)
        const storyId = button.dataset.id;
        const favBtn = favoriteListContainer.querySelector(
          `.favorite-button[data-id="${storyId}"]`
        );
        if (favBtn) favBtn.style.display = "none";
        button.style.display = "block"; // Tampilkan tombol unfavorite

        button.addEventListener("click", async (event) => {
          const storyId = event.currentTarget.dataset.id;
          await StoryDbFavorites.deleteFavorite(storyId);
          alert("Cerita dihapus dari Favorit!");

          // Render ulang halaman
          this.afterRender();
        });
      });
  }
}

export default FavoritesPage;
