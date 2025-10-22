import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Administrador - MonterPlace",
  description: "Panel de administración de MonterPlace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className="flex flex-col min-h-screen justify-center items-center"
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
