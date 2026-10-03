import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier — Modern objects, enduring form",
  description:
    "Discover Atelier's latest collection of considered clothing and accessories, shaped by craft and made to last.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
