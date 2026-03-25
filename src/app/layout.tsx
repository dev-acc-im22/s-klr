import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { GhostModeEffect } from "@/components/providers/GhostModeEffect";
import { HydrationProvider } from "@/components/providers/HydrationProvider";
import { HydrationScript } from "@/components/scripts/HydrationScript";

export const metadata: Metadata = {
  title: "CreatorHub - Turn Your Content Into Income",
  description: "The all-in-one platform for creators to sell digital products, courses, and services. Build your creator business in minutes, not months.",
  keywords: ["creator platform", "digital products", "online courses", "sell online", "creator economy", "monetization", "link in bio"],
  authors: [{ name: "CreatorHub Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "CreatorHub - Turn Your Content Into Income",
    description: "The all-in-one platform for creators to sell digital products, courses, and services.",
    url: "https://creatorhub.io",
    siteName: "CreatorHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CreatorHub - Turn Your Content Into Income",
    description: "The all-in-one platform for creators to sell digital products, courses, and services.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="hydrating" style={{ visibility: 'hidden' }}>
      <body className="antialiased bg-background text-foreground font-sans">
        <HydrationScript />
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <HydrationProvider>
              <GhostModeEffect />
              <Navbar />
              {children}
              <Toaster />
            </HydrationProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
