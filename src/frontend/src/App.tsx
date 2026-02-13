import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import WorkoutLibraryPage from './pages/WorkoutLibraryPage';
import ProgramsPage from './pages/ProgramsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import CreatorDashboardPage from './pages/CreatorDashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AffiliateStorePage from './pages/AffiliateStorePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import DomainSetupPage from './pages/DomainSetupPage';

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

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$id',
  component: BlogPostPage,
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

const userDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: UserDashboardPage,
});

// NOTE: The existing /store route provides the Shop/Affiliate page functionality.
// This add-on task preserves the existing Store page unchanged. No new /shop route is added,
// no checkout flow is introduced, and no Amazon affiliate links are added as part of this task.
const affiliateStoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/store',
  component: AffiliateStorePage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const domainSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/domain-setup',
  component: DomainSetupPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  workoutLibraryRoute,
  programsRoute,
  blogRoute,
  blogPostRoute,
  contactRoute,
  creatorDashboardRoute,
  userDashboardRoute,
  affiliateStoreRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  domainSetupRoute,
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
