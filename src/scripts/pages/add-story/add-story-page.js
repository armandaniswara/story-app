// src/scripts/pages/add-story/add-story-page.js

import L from "leaflet";
import { storeNewStory } from "../../data/api";

export default class AddStoryPage {
  // Properti untuk menyimpan stream dan file
  #mediaStream = null;
  #capturedImageFile = null;

  // (1) Metode render() dari Langkah 1
  async render() {
    return `
      <div id="camera-container" class="camera-container hide">
        <video id="video-preview" autoplay playsinline></video>
        <canvas id="canvas-capture" style="display: none;"></canvas>
        <button id="capture-button" class="button-submit">
          <i class="fa-solid fa-camera"></i> Ambil Foto
        </button>
        <button id="close-camera-button" class="button-submit" style="background-color: #dc3545; margin-top: 10px;">
          Tutup
        </button>
      </div>

      <section class="container">
        <div id="notification-container"></div>
        <form id="add-story-form" class="auth-form">
          <h1 style="text-align: center; margin-bottom: 1.5rem;">Tambah Cerita Baru</h1>
          
          <div class="form-group" id="image-preview-container" style="display: none;">
            <label>Preview Gambar:</label>
            <img id="image-preview" alt="Preview gambar" style="width: 100%; border-radius: 8px;">
          </div>

          <div class="form-group">
            <label for="story-image">Upload Gambar (File):</label>
            <input type="file" id="story-image" name="photo" accept="image/*">
          </div>

          <div class="form-group">
            <label>ATAU Buka Kamera:</label>
            <button type="button" id="open-camera-button" class="button-submit" style="background-color: #007bff;">
              <i class="fa-solid fa-camera-retro"></i> Buka Kamera
            </button>
          </div>
          
          <div class="form-group">
            <label for="story-description">Deskripsi:</label>
            <textarea id="story-description" name="description" rows="5" required></textarea>
          </div>
          <div class="form-group">
            <label for="add-story-map"><i class="fa-solid fa-location-dot"></i> Pilih Lokasi (klik di peta):</label>
            <div id="add-story-map"></div>
          </div>
          <input type="hidden" id="story-lat" name="lat">
          <input type="hidden" id="story-lon" name="lon">
          
          <button type="submit" id="submit-button" data-text="Upload Cerita" class="button-submit">
            Upload Cerita
          </button>
        </form>
      </section>
    `;
  }

  // (2) Metode afterRender() yang sudah lengkap
  async afterRender() {
    // --- Setup Peta (Sudah Ada) ---
    const map = L.map("add-story-map").setView([-2.5489, 118.0149], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    let marker = null;
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      document.querySelector("#story-lat").value = lat;
      document.querySelector("#story-lon").value = lng;
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
    });

    // --- (BARU) Setup Event Listener Kamera ---
    const cameraContainer = document.querySelector("#camera-container");
    const videoElement = document.querySelector("#video-preview");
    const imagePreviewContainer = document.querySelector(
      "#image-preview-container"
    );
    const imagePreviewElement = document.querySelector("#image-preview");
    const fileInputElement = document.querySelector("#story-image");

    // Buka Kamera
    document
      .querySelector("#open-camera-button")
      .addEventListener("click", () => {
        this._initCamera(cameraContainer, videoElement);
      });

    // Ambil Foto
    document.querySelector("#capture-button").addEventListener("click", () => {
      this._takePicture(
        videoElement,
        imagePreviewContainer,
        imagePreviewElement,
        fileInputElement
      );
    });

    // Tutup Kamera
    document
      .querySelector("#close-camera-button")
      .addEventListener("click", () => {
        this._stopCameraStream(cameraContainer);
      });

    // Jika pengguna memilih file, reset hasil kamera
    fileInputElement.addEventListener("change", () => {
      if (fileInputElement.files && fileInputElement.files[0]) {
        this.#capturedImageFile = null; // Hapus file kamera
        imagePreviewContainer.style.display = "block";
        imagePreviewElement.src = URL.createObjectURL(
          fileInputElement.files[0]
        );
      }
    });

    // --- (MODIFIKASI) Event Submit Form ---
    const form = document.querySelector("#add-story-form");
    const submitButton = document.querySelector("#submit-button");
    const originalButtonText = submitButton.dataset.text;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      submitButton.disabled = true;
      submitButton.innerText = "Mengupload...";

      try {
        const descriptionInput = document.querySelector("#story-description");
        const latInput = document.querySelector("#story-lat");
        const lonInput = document.querySelector("#story-lon");

        // (MODIFIKASI) Cek file dari kamera ATAU dari input
        const evidenceImages = [];
        if (this.#capturedImageFile) {
          evidenceImages.push(this.#capturedImageFile);
        } else if (fileInputElement.files[0]) {
          evidenceImages.push(fileInputElement.files[0]);
        }

        // Validasi
        if (evidenceImages.length === 0)
          throw new Error("Gambar wajib diisi (dari file atau kamera).");
        if (!descriptionInput.value) throw new Error("Deskripsi wajib diisi.");
        if (!latInput.value || !lonInput.value)
          throw new Error("Lokasi di peta wajib dipilih.");

        const storyData = {
          description: descriptionInput.value,
          evidenceImages: evidenceImages,
          lat: parseFloat(latInput.value),
          lon: parseFloat(lonInput.value),
        };

        const response = await storeNewStory(storyData);

        if (!response.ok) throw new Error(response.message);

        this._showNotification("Cerita berhasil di-upload!", "success");
        form.reset();
        this.#capturedImageFile = null; // Reset file
        imagePreviewContainer.style.display = "none"; // Sembunyikan preview
        if (marker) map.removeLayer(marker);

        setTimeout(() => {
          window.location.hash = "#/";
        }, 2000);
      } catch (error) {
        this._showNotification(error.message, "error");
      } finally {
        submitButton.disabled = false;
        submitButton.innerText = originalButtonText;
      }
    });
  }

  // --- (BARU) Fungsi Helper Kamera ---

  async _initCamera(container, video) {
    try {
      this.#mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Prioritaskan kamera belakang
      });
      video.srcObject = this.#mediaStream;
      container.classList.replace("hide", "show");
    } catch (error) {
      console.error("Error mengakses kamera:", error);
      // Fallback ke kamera depan jika kamera belakang gagal
      try {
        this.#mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        video.srcObject = this.#mediaStream;
        container.classList.replace("hide", "show");
      } catch (fallbackError) {
        this._showNotification("Gagal mengakses kamera.", "error");
      }
    }
  }

  _takePicture(video, previewContainer, previewImg, fileInput) {
    const canvas = document.querySelector("#canvas-capture");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    // Konversi canvas ke File object
    canvas.toBlob((blob) => {
      this.#capturedImageFile = new File([blob], "camera-shot.jpg", {
        type: "image/jpeg",
      });

      // Tampilkan preview
      previewContainer.style.display = "block";
      previewImg.src = URL.createObjectURL(this.#capturedImageFile);

      // Kosongkan input file agar tidak bentrok
      fileInput.value = "";

      // Matikan kamera
      this._stopCameraStream(document.querySelector("#camera-container"));
    }, "image/jpeg");
  }

  _stopCameraStream(container) {
    if (this.#mediaStream) {
      this.#mediaStream.getTracks().forEach((track) => track.stop());
      this.#mediaStream = null;
    }
    container.classList.replace("show", "hide");
  }

  // --- Fungsi Notifikasi (Sudah Ada) ---
  _showNotification(message, type) {
    const container = document.querySelector("#notification-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
}
