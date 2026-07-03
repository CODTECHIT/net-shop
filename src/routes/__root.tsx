import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, useLocation } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-navy">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-[#0C1A2E] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-[#0C1A2E] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen pb-20 md:pb-0">
        {!isAdminPath && <Navbar />}
        <main className={isAdminPath ? "" : "flex-1"}>
          <Outlet />
        </main>
        {!isAdminPath && <Footer />}
        {!isAdminPath && <FloatingWhatsApp />}
      </div>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
