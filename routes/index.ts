export const publicRoutes = ['/'];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = ['/', '/signup', '/login'];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT_USER = '/';
export const DEFAULT_LOGIN_REDIRECT_ADMIN = '/dashboard';
export const DEFAULT_NO_PERMISSION = '/no-permission';
export const testRoute = '/test';

export const adminRoutes = [
  // '/Projects',
  '/dashboard/Rfp-Compliance',
  // '/led'
];

export const protectedRoutes = [
  '/dashboard',
  '/dashboard/connections',
  '/dashboard/Rfp-Compliance',
  '/dashboard/users',
];
