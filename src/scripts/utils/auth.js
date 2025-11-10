// src/scripts/utils/auth.js

const AUTH_TOKEN_KEY = 'STORY_APP_TOKEN';

export function getAccessToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveAccessToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isUserLoggedIn() {
  // Cek apakah token ada
  return !!getAccessToken();
}