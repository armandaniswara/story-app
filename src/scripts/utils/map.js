// src/scripts/utils/map.js

import L from 'leaflet';

/**
 * Kelas Map untuk membungkus logika Leaflet
 */
class Map {
  /**
   * @param {L.Map} leafletMap Instance dari Leaflet Map
   */
  constructor(leafletMap) {
    this.#map = leafletMap;
  }

  #map = null;

  /**
   * Menambahkan marker ke peta
   * @param {number[]} coordinate [lat, lon]
   * @param {object} options Opsi untuk marker (misal: alt)
   * @param {object} popupOptions Opsi untuk popup (misal: content)
   */
  addMarker(coordinate, options = {}, popupOptions = {}) {
    const marker = L.marker(coordinate, options).addTo(this.#map);

    if (popupOptions.content) {
      marker.bindPopup(popupOptions.content);
    }
  }

  /**
   * Metode static untuk membangun peta
   * @param {string} selector ID dari elemen map container (misal: '#map')
   * @param {object} options Opsi untuk build (zoom, locate)
   * @returns {Promise<Map>} Instance dari kelas Map
   */
  static async build(selector, options = {}) {
    const { zoom = 10, locate = false } = options;
    const indonesiaCenter = [-2.5489, 118.0149]; // Center di Indonesia

    const leafletMap = L.map(selector.replace('#', '')).setView(indonesiaCenter, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);

    if (locate) {
      leafletMap.locate({ setView: true, maxZoom: zoom });
    }

    return new Map(leafletMap);
  }
}

export default Map;