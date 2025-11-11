// src/scripts/utils/db-helper.js

import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const DB_VERSION = 2; 

// (2) TAMBAHKAN NAMA STORE BARU
const CACHE_STORE_NAME = 'stories';
const FAVORITE_STORE_NAME = 'favorites';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    // (3) Buat store 'stories' (untuk cache)
    if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
      db.createObjectStore(CACHE_STORE_NAME, { keyPath: 'id' });
    }

    // (4) Buat store 'favorites' (untuk Kriteria 4)
    if (!db.objectStoreNames.contains(FAVORITE_STORE_NAME)) {
      db.createObjectStore(FAVORITE_STORE_NAME, { keyPath: 'id' });
    }
  },
});

// ===========================================
// FUNGSI UNTUK CACHE (Kriteria 3 Offline)
// ===========================================
export const StoryDbCache = {
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
// FUNGSI UNTUK FAVORIT (Kriteria 4 CRUD)
// ===========================================
export const StoryDbFavorites = {
  // (CREATE)
  async addFavorite(story) {
    return (await dbPromise).put(FAVORITE_STORE_NAME, story);
  },

  // (READ)
  async getAllFavorites() {
    return (await dbPromise).getAll(FAVORITE_STORE_NAME);
  },

  // (READ)
  async getFavorite(id) {
    return (await dbPromise).get(FAVORITE_STORE_NAME, id);
  },
  
  // (DELETE)
  async deleteFavorite(id) {
    return (await dbPromise).delete(FAVORITE_STORE_NAME, id);
  },
};