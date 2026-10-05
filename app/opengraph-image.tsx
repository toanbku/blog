import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Toan Ho — Built it five times. Wrote three posts.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const cards = [
  { x: 640, y: 380, r: -8, bg: '#F6F0E3', ink: '#1B1814', t: 'Mai viết.' },
  { x: 820, y: 300, r: 14, bg: '#2F5BFF', ink: '#F2F4FF', t: 'Why I moved off Astro' },
  { x: 700, y: 470, r: 5, bg: '#FF5A1F', ink: '#FFF4E8', t: 'Hello World (draft #47)' },
  { x: 900, y: 440, r: -16, bg: '#E9B949', ink: '#1B1814', t: 'Closure' },
  { x: 560, y: 500, r: 18, bg: '#1B1814', ink: '#F6F0E3', t: 'Coming soon™' }
]

export default async function Image() {
  const [serif, serifItalic, sans] = await Promise.all([
    readFile(join(process.cwd(), 'assets/instrument-serif.ttf')),
    readFile(join(process.cwd(), 'assets/instrument-serif-italic.ttf')),
    readFile(join(process.cwd(), 'public/fonts/geist-600.ttf'))
  ])

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: '#EFE9DD',
        backgroundImage: 'radial-gradient(rgba(27,24,20,0.14) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
        padding: 72,
        fontFamily: 'Geist'
      }}
    >
      {cards.map((c) => (
        <div
          key={c.t}
          style={{
            position: 'absolute',
            left: c.x,
            top: c.y,
            width: 300,
            height: 150,
            display: 'flex',
            alignItems: 'flex-end',
            padding: 20,
            borderRadius: 14,
            background: c.bg,
            color: c.ink,
            fontSize: 26,
            transform: `rotate(${c.r}deg)`,
            boxShadow: '0 18px 30px -12px rgba(27,24,20,0.45)'
          }}
        >
          {c.t}
        </div>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', color: '#1B1814' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: '#FF5A1F',
              transform: 'rotate(-12deg)',
              boxShadow: '5px 4px 0 #1B1814'
            }}
          />
          Toan Ho
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 56,
            fontFamily: 'Instrument Serif',
            fontSize: 112,
            lineHeight: 0.92,
            letterSpacing: -3
          }}
        >
          <div style={{ display: 'flex' }}>
            Built it&nbsp;<span style={{ fontStyle: 'italic', color: '#FF5A1F' }}>five</span>
            &nbsp;times.
          </div>
          <div style={{ display: 'flex' }}>
            Wrote&nbsp;<span style={{ fontStyle: 'italic', color: '#FF5A1F' }}>three</span>
            &nbsp;posts.
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Instrument Serif', data: serif, style: 'normal', weight: 400 },
        { name: 'Instrument Serif', data: serifItalic, style: 'italic', weight: 400 },
        { name: 'Geist', data: sans, style: 'normal', weight: 600 }
      ]
    }
  )
}
