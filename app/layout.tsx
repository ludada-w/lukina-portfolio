import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lukina — AI Portfolio",
  description: "Lukina builds thoughtful AI products, workflows and intelligent systems.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
