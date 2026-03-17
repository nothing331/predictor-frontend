import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "predictKaro - Predict Future for Fun",
  description: "Join the future of betting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-display">
        {children}
      </body>
    </html>
  );
}
