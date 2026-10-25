import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Million Dice Roll Statistics Simulator",
  description:
    "Simulate one million dice rolls and compare sum frequencies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
