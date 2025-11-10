export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <h1>Tentang Aplikasi Ini</h1>
        <p>
          Aplikasi ini adalah submission untuk kelas "Menjadi Front-End Web Developer Expert" di Dicoding.
        </p>
        <p>
          Dibuat untuk mendemonstrasikan penerapan Single-Page Application (SPA),
          penggunaan Web API seperti Leaflet.js untuk pemetaan, View Transitions,
          dan Aksesibilitas (WCAG).
        </p>
      </section>
    `;
  }

  async afterRender() {
    console.log('AboutPage.afterRender() dipanggil');
    // Do your job here
  }
}
