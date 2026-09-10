import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import HomePage from '@/pages/home';
import BlogIndexPage from '@/pages/blog/blog-index';
import BlogPostPage from '@/pages/blog/blog-post';
import AdminLoginPage from '@/pages/admin/admin-login';
import AdminDashboardPage from '@/pages/admin/admin-dashboard';
import PostEditorPage from '@/pages/admin/post-editor';
import { RequireAdmin } from '@/components/admin/require-admin';
import {
  ADMIN_LOGIN_PATH,
  ADMIN_DASHBOARD_PATH,
  ADMIN_POST_EDIT_PATH,
} from '@/lib/admin-config';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/blog" component={BlogIndexPage} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path={ADMIN_LOGIN_PATH} component={AdminLoginPage} />
        <Route path={ADMIN_DASHBOARD_PATH}>
          <RequireAdmin>
            <AdminDashboardPage />
          </RequireAdmin>
        </Route>
        <Route path={ADMIN_POST_EDIT_PATH}>
          <RequireAdmin>
            <PostEditorPage />
          </RequireAdmin>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;