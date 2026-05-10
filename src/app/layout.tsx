import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Navbar } from "@/components/ui-custom/navigation/Navbar";
import { NavigationPersistence } from "@/components/ui-custom/navigation/NavigationPersistence";
import { RouteTransition } from "@/components/ui-custom/navigation/RouteTransition";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nihongo Trainer",
  description: "A modern, beautiful application to master Japanese vocabulary and kanji.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background-soft text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NavigationPersistence />
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-raspberry-light/10 via-background-soft to-background-soft" />
          <Navbar />
          <RouteTransition>{children}</RouteTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
