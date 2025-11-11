// src/scripts/utils/db-helper.js

import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const DB_VERSION = 3; 

// (2) NAMA-NAMA STORE
const CACHE_STORE_NAME = 'stories';
const FAVORITE_STORE_NAME = 'favorites';
const OUTBOX_STORE_NAME = 'story_outbox'; // (BARU)

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
      db.createObjectStore(CACHE_STORE_NAME, { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains(FAVORITE_STORE_NAME)) {
      db.createObjectStore(FAVORITE_STORE_NAME, { keyPath: 'id' });
    }
    
    // (3) BUAT OBJECT STORE BARU UNTUK OUTBOX
    if (!db.objectStoreNames.contains(OUTBOX_STORE_NAME)) {
      // Kita gunakan timestamp sebagai key
      db.createObjectStore(OUTBOX_STORE_NAME, { keyPath: 'timestamp' });
    }
  },
});

// ===========================================
// FUNGSI UNTUK CACHE (Kriteria 3)
// ===========================================
export const StoryDbCache = {
  // ... (fungsi getAllStories, putAllStories, clearStories Anda tetap sama) ...
  async getAllStories() {
    return (await dbPromise).getAll(CACHE_STORE_NAME);
  },
  async putAllStories(stories) {
    if (!stories || stories.length === 0) return;
    const tx = (await dbPromise).transaction(CACHE_STORE_NAME, 'readwrite');
    await Promise.all(stories.map(story => tx.store.put(story)));
    await tx.done;
  },
  async clearStories() {
    const tx = (await dbPromise).transaction(CACHE_STORE_NAME, 'readwrite');
    await tx.store.clear();
    await tx.done;
  }
};

// ===========================================
// FUNGSI UNTUK FAVORIT (Kriteria 4 Basic/Skilled)
// ===========================================
export const StoryDbFavorites = {
  // ... (fungsi addFavorite, getAllFavorites, deleteFavorite Anda tetap sama) ...
  async addFavorite(story) {
    return (await dbPromise).put(FAVORITE_STORE_NAME, story);
  },
  async getAllFavorites() {
    return (await dbPromise).getAll(FAVORITE_STORE_NAME);
  },
  async getFavorite(id) {
    return (await dbPromise).get(FAVORITE_STORE_NAME, id);
  },
  async deleteFavorite(id) {
    return (await dbPromise).delete(FAVORITE_STORE_NAME, id);
  },
};

// ===========================================
// (BARU) FUNGSI UNTUK OUTBOX (Kriteria 4 Advanced)
// ===========================================
export const StoryDbOutbox = {
  async addStory(story) {
    // Tambahkan timestamp sebagai key unik
    story.timestamp = Date.now();
    return (await dbPromise).put(OUTBOX_STORE_NAME, story);
  },
  async getAllStories() {
    return (await dbPromise).getAll(OUTBOX_STORE_NAME);
  },
  async deleteStory(timestamp) {
    return (await dbPromise).delete(OUTBOX_STORE_NAME, timestamp);
  },
};