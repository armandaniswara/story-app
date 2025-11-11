// src/scripts/templates/template-creators.js

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


/**
 * Template untuk favorit 
 */
export const generateStoriesItemTemplate = (story) => `
  <article class="story-item">
    <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" class="story-image">
    <div class="story-info">
      <h3 class="story-name">${story.name}</h3>
      <p class="story-date">Dibuat: ${new Date(story.createdAt).toLocaleDateString()}</p>
      <p class="story-description">${story.description.substring(0, 100)}...</p>
    </div>
    
    <button 
      class="favorite-button" 
      data-id="${story.id}" 
      aria-label="Tambahkan ke favorit"
    >
      <i class="fa-regular fa-heart"></i> </button>

    <button 
      class="unfavorite-button" 
      data-id="${story.id}" 
      aria-label="Hapus dari favorit"
      style="display: none; color: red;"
    >
      <i class="fa-solid fa-heart"></i> </button>
  </article>
`;