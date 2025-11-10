// CSS imports
import 'leaflet/dist/leaflet.css';
import '../styles/styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// =======================================================
// TAMBAHKAN KODE FIX LEAFLET DI BAWAH INI
// =======================================================
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
});
// =======================================================
// AKHIR DARI KODE FIX
// =======================================================

import App from './pages/app';
import { Workbox } from 'workbox-window';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js'); 
    try {
      await wb.register();
      console.log('Service Worker berhasil diregistrasi.');
    } catch (error) {
      console.error('Registrasi Service Worker gagal:', error);
    }
  }

});
