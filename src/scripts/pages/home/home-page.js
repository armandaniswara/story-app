// src/scripts/pages/home/home-page.js

import {
  generateLoaderAbsoluteTemplate,
  generateStoriesItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from '../../templates/template-creators'; // <-- Path disesuaikan
import HomePresenter from './home-presenter';
import Map from '../../utils/map';
import * as SytheraAPI from '../../data/api'; // <-- Ini adalah model kita

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    // Ini adalah HTML dari kode yang Anda berikan
    return `
      <section>
        <div class="stories-list__map__container">
          <div id="map" class="stories-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title" style="margin-top: 20px;">Daftar Cerita</h1>

        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Inisialisasi Presenter
    this.#presenter = new HomePresenter({
      view: this,
      model: SytheraAPI,
    });
    
    // Serahkan semua logika ke Presenter
    await this.#presenter.initialGalleryAndMap();
  }

  // ===========================================
  // Metode-metode View (dipanggil oleh Presenter)
  // ===========================================

  populateStoriesList(message, stories) {
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }
    
    // Filter cerita yang tidak punya lokasi
    const validStories = stories.filter(story => story.lat != null && story.lon != null);

    if (validStories.length <= 0) {
      this.populateStoriesListEmpty(); // Tampilkan empty jika semua cerita tidak punya lokasi
      return;
    }

    const html = validStories.reduce((accumulator, story) => {
      const coordinate = [story.lat, story.lon];
      // Tambahkan marker ke peta
      this.#map.addMarker(coordinate, { alt: story.name }, { content: story.name });
      
      // Buat template HTML
      return accumulator.concat(
        generateStoriesItemTemplate(story), // Cukup kirim story
      );
    }, '');
      
    document.getElementById("stories-list").innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }
  
  populateStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  async initialMap() {
    // map initilization
    this.#map = await Map.build('#map', {
      zoom: 5, // Zoom out sedikit agar Indonesia terlihat
      locate: false, // Jangan auto-locate di halaman utama
    });
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }
}