import type { Metadata } from "next";
import { Funnel_Display, Gwendolyn } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FloatingReviews from "@/components/FloatingReviews";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
});

const gwendolyn = Gwendolyn({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gwendolyn",
});

export const metadata: Metadata = {
  title: "Saleem Butt Jewellers",
  description: "Premium Jewellery crafted with excellence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${funnelDisplay.variable} ${gwendolyn.variable} font-sans antialiased`}
      >
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <CartDrawer />
          <FloatingReviews />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
