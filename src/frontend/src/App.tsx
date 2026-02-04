import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import WorkoutLibraryPage from './pages/WorkoutLibraryPage';
import ProgramsPage from './pages/ProgramsPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import CreatorDashboardPage from './pages/CreatorDashboardPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const workoutLibraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workout-library',
  component: WorkoutLibraryPage,
});

const programsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/programs',
  component: ProgramsPage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const creatorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/creator-dashboard',
  component: CreatorDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  workoutLibraryRoute,
  programsRoute,
  blogRoute,
  contactRoute,
  creatorDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
