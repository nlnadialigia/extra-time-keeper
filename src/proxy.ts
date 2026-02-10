import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'pt'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Don't use a prefix for the default locale
  localePrefix: 'as-needed',

  // Disable locale detection to use defaultLocale
  localeDetection: false
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(pt|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
