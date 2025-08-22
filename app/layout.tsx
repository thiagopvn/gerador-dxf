import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'DXF Generator | Remarcação de Chassi',
  description: 'Plataforma profissional de geração de arquivos DXF',
  keywords: 'dxf, remarcação, chassi, automóveis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} font-sans`}>
      <body className="min-h-screen bg-background text-foreground">
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  )
}