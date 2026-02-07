import {Toaster as Sonner} from "@/components/ui/sonner";
import {Toaster} from "@/components/ui/toaster";
import {TooltipProvider} from "@/components/ui/tooltip";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "../index.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Extra Time Keeper",
  description: "Gerenciamento de horas extras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className} suppressHydrationWarning>
        <TooltipProvider>
          {children}
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </body>
    </html>
  );
}
