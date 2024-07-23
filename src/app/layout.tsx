import type { Metadata } from "next";
import { Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import FirebaseInit from "./FirebaseInit";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const inter = Montserrat_Alternates({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: ["roboto"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Hospital",
  description: "Hospital management with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`pb-10 ${inter.className}`}>
        <FirebaseInit>
          {children}
        </FirebaseInit>
        <ToastContainer
          position="bottom-center"
          hideProgressBar
          pauseOnFocusLoss={false}
          pauseOnHover={false}
        />
      </body>
    </html>
  );
}
