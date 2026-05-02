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
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-outfit">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
