"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {usePathname, useRouter} from "@/i18n/routing";
import {useLocale} from "next-intl";
import {useEffect, useState} from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function onLocaleChange(nextLocale: string) {
    router.replace(pathname, {locale: nextLocale});
  }

  if (!mounted) {
    return (
      <div className="w-[70px] h-8 bg-muted/20 animate-pulse rounded-md" />
    );
  }

  return (
    <Select value={locale} onValueChange={onLocaleChange}>
      <SelectTrigger className="w-[70px] h-8 text-xs font-bold border-border bg-background">
        <SelectValue placeholder="Lang" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">EN</SelectItem>
        <SelectItem value="pt">PT</SelectItem>
      </SelectContent>
    </Select>
  );
}
