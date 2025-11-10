// src/scripts/data/api.js

import { getAccessToken } from "../utils/auth";
import { BASE_URL } from "../config";

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
  MY_USER_INFO: `${BASE_URL}/users/me`,

  // Story
  STORIES_LIST: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  STORE_NEW_STORY: `${BASE_URL}/stories`,

  NOTIFICATION_SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  NOTIFICATION_UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
};

export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getMyUserInfo() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.MY_USER_INFO, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getAllStories() {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.STORIES_LIST, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getStoryById(id) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function storeNewStory({
  description,
  evidenceImages, // Nama ini harus cocok dengan add-story-page.js
  lat,
  lon,
}) {
  const accessToken = getAccessToken();

  const formData = new FormData();
  formData.set("description", description);
  formData.set("lat", lat);
  formData.set("lon", lon);

  // Pastikan evidenceImages adalah array
  if (evidenceImages && evidenceImages.length > 0) {
    formData.append("photo", evidenceImages[0]); // API hanya menerima 1 foto
  }

  const fetchResponse = await fetch(ENDPOINTS.STORE_NEW_STORY, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function subscribePushNotification({ token, endpoint, keys }) {
  const accessToken = getAccessToken(); // Pastikan token didapat dari auth helper

  // API Dicoding mengharapkan format JSON yang spesifik
  const requestBody = {
    endpoint: endpoint,
    keys: {
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
  };

  const fetchResponse = await fetch(ENDPOINTS.NOTIFICATION_SUBSCRIBE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestBody),
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

/**
 * Memberi tahu server API untuk berhenti berlangganan.
 */
export async function unsubscribePushNotification({ token, endpoint }) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.NOTIFICATION_UNSUBSCRIBE, {
    method: "DELETE", // Method DELETE
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ endpoint: endpoint }),
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
