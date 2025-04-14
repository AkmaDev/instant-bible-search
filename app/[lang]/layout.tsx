// app/[lang]/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"; // attention au chemin ici !

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 👇 NE PAS OUBLIER export async function generateStaticParams()
export async function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

// 👇 RENDRE RootLayout ASYNC ici
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>; // c’est une Promise !
}) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
