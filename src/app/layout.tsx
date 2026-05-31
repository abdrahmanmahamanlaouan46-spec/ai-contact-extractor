import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Contact Extractor - Extract Emails & Phone Numbers Instantly",
  description:
    "AI-powered contact extraction tool. Extract email addresses and phone numbers from any raw text using intelligent parsing and regex automation. Supports international formats.",
  keywords: [
    "contact extractor",
    "email extractor",
    "phone number extractor",
    "regex",
    "AI",
    "text parsing",
    "data extraction",
  ],
  authors: [{ name: "AI Contact Extractor" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "AI Contact Extractor",
    description: "Extract emails and phone numbers instantly from raw text",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Contact Extractor",
    description: "Extract emails and phone numbers instantly from raw text",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
