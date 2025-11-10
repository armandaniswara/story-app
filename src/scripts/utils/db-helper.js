import { openDB } from "idb";
import { BASE_URL } from "../config"; // Pastikan Anda punya file config ini

const DB_NAME = "story-app-db";
const DB_VERSION = 1;
const OBJECT_STORE_NAME = "stories";

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Buat object store 'stories' dengan 'id' sebagai key
    db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
  },
});

export const StoryDb = {
  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async getStory(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async putAllStories(stories) {
    if (!stories || stories.length === 0) return;

    const tx = (await dbPromise).transaction(OBJECT_STORE_NAME, "readwrite");
    await Promise.all(stories.map((story) => tx.store.put(story)));
    await tx.done;
  },

  async clearStories() {
    const tx = (await dbPromise).transaction(OBJECT_STORE_NAME, "readwrite");
    await tx.store.clear();
    await tx.done;
  },
};
