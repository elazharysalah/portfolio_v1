import type { Metadata } from "next";
import "./globals.css";
import { GoogleAnalytics } from "@/components/site/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Salah Eddine El-Azhary - Portfolio",
  description:
    "Software engineer portfolio — backend, APIs, and scalable systems. Managed with an admin CMS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
