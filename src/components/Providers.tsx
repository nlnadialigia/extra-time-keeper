"use client";

import {TooltipProvider} from "@/components/ui/tooltip";
import {SessionProvider} from "next-auth/react";
import {AbstractIntlMessages, NextIntlClientProvider} from "next-intl";
import {Toaster} from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}

export function Providers({children, messages, locale}: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      <SessionProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
