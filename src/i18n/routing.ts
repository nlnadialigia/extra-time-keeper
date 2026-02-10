import {createNavigation} from 'next-intl/navigation';

export const locales = ['en', 'pt'];
export const localePrefix = 'as-needed'; // Default

export const {Link, redirect, usePathname, useRouter} =
  createNavigation({locales, localePrefix, defaultLocale: 'en'});
