import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'

const sans = Geist({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif'
})

const description =
  'Rebuilt this blog five times, wrote three posts. A physics playground of unfinished drafts — and the books I’m reading.'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.toanbku.com'),
  title: 'Toan Ho — a blog, technically',
  description,
  openGraph: {
    title: 'Toan Ho — a blog, technically',
    description,
    url: '/',
    siteName: 'Toan Ho',
    type: 'website'
  },
  twitter: { card: 'summary_large_image', creator: '@toanbku' }
}

export const viewport: Viewport = {
  themeColor: '#EFE9DD',
  colorScheme: 'light'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
