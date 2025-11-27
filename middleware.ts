import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "./convex/_generated/api";

const isPublicPage = createRouteMatcher([
  "/signin",
  "/setup-admin",
  "/setup-staff",
  "/register",
]);
const isProtectedRoute = createRouteMatcher(["/"]);
// Pages that STAFF can access
const isStaffAllowedPage = createRouteMatcher(["/registered-user", "/spin"]);
// Pages that only ADMIN can access
const isAdminOnlyPage = createRouteMatcher([
  "/",
  "/participants",
  "/prizes",
  "/winners",
  "/export",
  "/register-qr",
  "/dummy-spin",
  "/server",
]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();
  const pathname = request.nextUrl.pathname;

  // Redirect authenticated users away from signin page
  if (pathname === "/signin" && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/");
  }

  // Allow access to public pages
  if (isPublicPage(request)) {
    return;
  }

  // Redirect unauthenticated users to signin page
  if (!isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/signin");
  }

  // For authenticated users, check role-based permissions
  try {
    const userRole = await fetchQuery(
      api.userRoles.getCurrentUserRole,
      {},
      { token: await convexAuth.fetchAccessToken() },
    );

    // If user has no role assigned, redirect to signin
    if (!userRole) {
      return nextjsMiddlewareRedirect(request, "/signin");
    }

    // STAFF role restrictions
    if (userRole === "STAFF") {
      // STAFF can only access /registered-user and /spin
      if (!isStaffAllowedPage(request)) {
        // Redirect STAFF to /registered-user if trying to access admin pages
        return nextjsMiddlewareRedirect(request, "/registered-user");
      }
    }

    // ADMIN can access all pages (no restrictions)
    // Continue with the request
  } catch (error) {
    console.error("Error checking user role:", error);
    // On error, redirect to signin for safety
    return nextjsMiddlewareRedirect(request, "/signin");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
