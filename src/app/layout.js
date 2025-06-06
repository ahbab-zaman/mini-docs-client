import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextProviders from "./Providers/NextProviders";
import { UserProvider } from "../app/utils/UserContext";
import ConditionalNavbar from "./components/ConditionalNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mini Docs",
  description: "A mini web app where user can share and view their docs",
  icons: "./logo.png",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextProviders>
          <UserProvider>
            <ConditionalNavbar />
            {children}
          </UserProvider>
        </NextProviders>
      </body>
    </html>
  );
}
