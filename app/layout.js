import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GraphVista",
  description: "Website for creating and editing graphs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <Header/>
        {children}
      </body>
    </html>
  );
}
