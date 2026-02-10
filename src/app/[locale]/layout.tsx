import {Providers} from "@/components/Providers";
import {getMessages} from "next-intl/server";
import {Inter} from "next/font/google";
import "../../global.css";

const inter = Inter({subsets: ["latin"]});

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string;}>;
}) {
  const {locale} = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className} suppressHydrationWarning>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
