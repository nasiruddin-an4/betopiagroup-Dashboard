import Providers from "./providers";
import "./globals.css";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata = {
  title: "Betopia Admin Panel",
  description: "Administrative panel for Betopia Group",
  icons: {
    icon: "/bLogo.png",
    shortcut: "/bLogo.png",
    apple: "/bLogo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="font-outfit" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
