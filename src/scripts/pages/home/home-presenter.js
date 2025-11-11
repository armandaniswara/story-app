// src/scripts/pages/home/home-presenter.js
import { StoryDbCache } from "../../utils/db-helper";
/**
 * HomePresenter
 * Mengatur logika untuk halaman utama (View) dan API (Model)
 */
export default class HomePresenter {
  #view = null;
  #model = null;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  /**
   * Inisialisasi galeri cerita dan peta
   */
  async initialGalleryAndMap() {
    this.#view.showLoading();
    this.#view.showMapLoading();

    try {
      // 1. Inisialisasi Peta
      await this.#view.initialMap();

      // 2. Ambil data cerita
      const response = await this.#model.getAllStories();
      if (!response.ok) {
        throw new Error(response.message);
      }

      // 3. Tampilkan data ke View
      const stories = response.listStory || [];

      await StoryDbCache.clearStories();
      await StoryDbCache.putAllStories(stories);

      this.#view.populateStoriesList(response.message, stories);
    } catch (error) {
      console.warn(
        "API Gagal, mencoba mengambil dari IndexedDB:",
        error.message
      );

      // 4. Tampilkan error jika gagal
      const stories = await StoryDbCache.getAllStories();

      if (stories && stories.length > 0) {
        this.#view.populateStoriesList("Data dimuat offline.", stories);
      } else {
        // Gagal total (offline dan DB kosong)
        this.#view.populateStoriesListError(error.message);
      }
    } finally {
      this.#view.hideLoading();
      this.#view.hideMapLoading();
    }
  }
}
