// src/scripts/utils/sync-helper.js

import { StoryDbOutbox } from './db-helper';
import { storeNewStory } from '../data/api';

const SyncHelper = {
  async syncOfflineStories() {
    // Cek jika sedang online
    if (navigator.onLine) {
      console.log('Online. Memeriksa Outbox...');
      const stories = await StoryDbOutbox.getAllStories();
      
      if (stories.length === 0) {
        console.log('Outbox kosong. Tidak ada yang perlu di-sync.');
        return;
      }

      console.log(`Menemukan ${stories.length} cerita di Outbox. Memulai sinkronisasi...`);
      
      // Kirim setiap cerita di outbox ke API
      for (const story of stories) {
        try {
          // 'story' object berisi { description, evidenceImages, lat, lon, timestamp }
          // 'storeNewStory' mengharapkan format yang sama.
          // File/Blob gambar masih tersimpan di IndexedDB.
          
          const response = await storeNewStory(story);
          
          if (response.ok) {
            // Jika API sukses, hapus dari Outbox
            await StoryDbOutbox.deleteStory(story.timestamp);
            console.log(`Cerita (timestamp: ${story.timestamp}) berhasil di-sync dan dihapus dari Outbox.`);
            alert(`Cerita offline Anda (${story.description.substring(0, 20)}...) berhasil di-upload!`);
          } else {
            // Jika API gagal (misal: validasi error), lempar error
            throw new Error(response.message);
          }
        } catch (error) {
          console.error(`Gagal sync cerita (timestamp: ${story.timestamp}):`, error);
          // Biarkan di Outbox untuk dicoba lagi nanti
        }
      }
    } else {
      console.log('Offline. Sinkronisasi ditunda.');
    }
  }
};

export default SyncHelper;