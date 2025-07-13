import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Air Quality',
  description: 'Air Quality of Nairobi',
  // generator: 'blakbox23',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
