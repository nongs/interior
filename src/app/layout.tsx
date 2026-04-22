import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interactive Interior Planner",
  description: "인테리어 도면 · 가구 배치",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-dvh bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  );
}
