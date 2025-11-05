import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/signin", "/setup-admin"]);
const isProtectedRoute = createRouteMatcher(["/", "/server"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // Redirect authenticated users away from signin page
  if (
    request.nextUrl.pathname === "/signin" &&
    (await convexAuth.isAuthenticated())
  ) {
    return nextjsMiddlewareRedirect(request, "/");
  }
  // Redirect unauthenticated users to signin page
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }
  // Allow access to public pages (signin, setup-admin)
  if (isPublicPage(request)) {
    return;
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
