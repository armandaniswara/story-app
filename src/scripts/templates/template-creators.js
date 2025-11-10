// src/scripts/templates/template-creators.js

/**
 * Menghasilkan template untuk satu item cerita di daftar.
 * (Diambil dari kode home-page.js Anda sebelumnya)
 */
export const generateStoriesItemTemplate = (story) => `
  <article class="story-item">
    <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" class="story-image">
    <div class="story-info">
      <h3 class="story-name">${story.name}</h3>
      <p class="story-date">Dibuat: ${new Date(story.createdAt).toLocaleDateString()}</p>
      <p class="story-description">${story.description.substring(0, 100)}...</p>
    </div>
  </article>
`;

/**
 * Template untuk pesan error
 */
export const generateStoriesListErrorTemplate = (message) => `
  <p class="stories-list__empty" style="color: red;">
    Gagal memuat cerita: ${message}.
    <br>
    (Pastikan Anda sudah login)
  </p>
`;

/**
 * Template untuk daftar kosong
 */
export const generateStoriesListEmptyTemplate = () => `
  <p class="stories-list__empty">
    Belum ada cerita untuk ditampilkan.
  </p>
`;

/**
 * Template untuk indikator loading
 */
export const generateLoaderAbsoluteTemplate = () => `
  <div class="loader-container">
    <div class="loader"></div>
  </div>
`;