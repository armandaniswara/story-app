// src/scripts/routes/routes.js

import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import RegisterPage from '../pages/register/register';
import LoginPage from '../pages/login/login';
import NotificationPage from '../pages/notification/notification-page';
import FavoritesPage from '../pages/favorites/favorites-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/add-story': new AddStoryPage(),

  '/register': new RegisterPage(),
  '/login': new LoginPage(),
  '/notifications': new NotificationPage(),
  '/favorites': new FavoritesPage(),
};

export default routes;