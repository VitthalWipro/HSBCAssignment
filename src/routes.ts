import { Route, RootRoute, Router } from '@tanstack/react-router';
import App from './App';
import CharacterDetail from './pages/CharacterDetail';
import CharacterList from './pages/CharacterList';

const rootRoute = new RootRoute({
  component: App,
});

const characterListRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CharacterList,
});

const characterDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/character/$id',
  component: CharacterDetail,
});

export const routeTree = rootRoute.addChildren([
  characterListRoute,
  characterDetailRoute,
]);

export const router = new Router({
  routeTree,
});
