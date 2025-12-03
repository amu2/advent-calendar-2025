import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Adventskalender 2025 – An Exceptional Algebraic Walk Through Particle Physics',
  description: '100 years after Heisenberg\'s matrix mechanics: A journey through octonions, exceptional algebras, and the structure of particle physics',
  authors: [{ name: 'Andreas Müller, Kempten University of Applied Sciences' }],
  keywords: ['Advent calendar', 'theoretical physics', 'particle physics', 'octonions', 'exceptional algebras', 'quantum mechanics'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Adventskalender 2025 – Theoretical Physics',
    description: 'An exceptional algebraic walk through particle physics',
    images: ['/og-image.png'],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
