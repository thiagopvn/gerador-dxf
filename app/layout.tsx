import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Remarcação de Chassi - DXF Generator",
  description: "Plataforma de geração de arquivos DXF para remarcação de chassi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
