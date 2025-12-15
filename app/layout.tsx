import { Outfit } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Organic Bazzar | Fresh Organic Groceries Delivered",
  description: "Shop the freshest organic fruits, vegetables, and daily essentials at Organic Bazzar. Fast delivery, premium quality, and great prices.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
