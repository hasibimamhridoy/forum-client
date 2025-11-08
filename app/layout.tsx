import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthOptions } from "./lib/utils";
import Provider from "./provider/provider";

const geist = Geist({ subsets: ["latin"] });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forum Hub",
  description: "Forum Hub",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(AuthOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} ${geistMono.className}`}>
        <Provider session={session}>{children}</Provider>
      </body>
    </html>
  );
}
