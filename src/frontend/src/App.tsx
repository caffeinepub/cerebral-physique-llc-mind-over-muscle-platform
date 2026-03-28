import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";
import AboutPage from "./pages/AboutPage";
import AffiliateStorePage from "./pages/AffiliateStorePage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";
import CreatorDashboardPage from "./pages/CreatorDashboardPage";
import DomainSetupPage from "./pages/DomainSetupPage";
import HomePage from "./pages/HomePage";
import NutritionArticlePage from "./pages/NutritionArticlePage";
import NutritionPage from "./pages/NutritionPage";
import PaymentFailurePage from "./pages/PaymentFailurePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ProgramsPage from "./pages/ProgramsPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import WorkoutLibraryPage from "./pages/WorkoutLibraryPage";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const workoutLibraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workout-library",
  component: WorkoutLibraryPage,
});

const programsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/programs",
  component: ProgramsPage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogPage,
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$id",
  component: BlogPostPage,
});

const nutritionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nutrition",
  component: NutritionPage,
});

const nutritionArticleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nutrition/$id",
  component: NutritionArticlePage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const userDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: UserDashboardPage,
});

const affiliateStoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store",
  component: AffiliateStorePage,
});

const creatorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator",
  component: CreatorDashboardPage,
});

// Keep old route alias for backward compatibility
const creatorDashboardOldRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creator-dashboard",
  component: CreatorDashboardPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailurePage,
});

const domainSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/domain-setup",
  component: DomainSetupPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  workoutLibraryRoute,
  programsRoute,
  blogRoute,
  blogPostRoute,
  nutritionRoute,
  nutritionArticleRoute,
  contactRoute,
  userDashboardRoute,
  affiliateStoreRoute,
  creatorDashboardRoute,
  creatorDashboardOldRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  domainSetupRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
