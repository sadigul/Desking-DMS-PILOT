import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: "AutoFinance Pro",
  description: "Enterprise Desking & Finance Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} antialiased overflow-x-hidden`} suppressHydrationWarning>
      <body className="font-sans overflow-x-hidden bg-slate-50 dark:bg-[hsl(222,47%,6%)] text-slate-900 dark:text-slate-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
