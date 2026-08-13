import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FoodVal - Eat Better",
  description: "Scan packaged food to reveal its true health score.",
};

export default function RootLayout({ children }) {
  const adSensePubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {adSensePubId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSensePubId}`}
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
