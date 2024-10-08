import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./prosemirror.css";
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js AI Lite App",
  description: "AI with Next and AI SDK",
};

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>
    <Toaster position="top-center" />
    <Providers
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
      </div>
    </Providers>
    </body>
    </html>
  );
}
