'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { ARCHIVE_URL, books, drafts, excuses, quotes, statusLabel } from '@/lib/content'
import type { BlockSpec, Bounds } from './Scene'

const Scene = dynamic(() => import('./Scene'), { ssr: false })

const PALETTE = [
  { color: '#F6F0E3', ink: '#1B1814' },
  { color: '#F6F0E3', ink: '#1B1814' },
  { color: '#FF5A1F', ink: '#FFF4E8' },
  { color: '#FFC93C', ink: '#1B1814' },
  { color: '#2F5BFF', ink: '#F2F4FF' },
  { color: '#1B1814', ink: '#F6F0E3' },
  { color: '#FF9EC0', ink: '#1B1814' },
  { color: '#93D9B5', ink: '#1B1814' },
  { color: '#C3B6FF', ink: '#1B1814' }
]

let uid = 0
let draftNo = 0
const rand = (a: number, b: number) => a + Math.random() * (b - a)
const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]
const pad3 = (n: number) => String(n).padStart(3, '0')

function shuffle<T>(xs: readonly T[]) {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function spawnPos(b: Bounds, y: number): [number, number, number] {
  return [rand(-b.w + 1.6, b.w - 1.6), y, rand(-b.d + 1, b.d - 1)]
}

function makeDraft(bounds: Bounds, y: number, title = pick(drafts)): BlockSpec {
  const year = 2022 + Math.floor(Math.random() * 5)
  return {
    id: uid++,
    kind: 'draft',
    title,
    tag: `DRAFT ${pad3(++draftNo)} · ${year}`,
    ...pick(PALETTE),
    size: [rand(2.0, 2.6), rand(0.26, 0.38), rand(1.15, 1.45)],
    position: spawnPos(bounds, y),
    rotation: [rand(-0.6, 0.6), rand(-Math.PI, Math.PI), rand(-0.6, 0.6)]
  }
}

function makeBook(bounds: Bounds, y: number, i: number): BlockSpec {
  const b = books[i]
  return {
    id: uid++,
    kind: 'book',
    title: b.title,
    author: b.author,
    tag: statusLabel[b.status].toUpperCase(),
    color: b.color,
    ink: b.ink,
    size: [1.5, rand(0.34, 0.5), 2.1],
    position: spawnPos(bounds, y),
    rotation: [rand(-0.4, 0.4), rand(-Math.PI, Math.PI), rand(-0.4, 0.4)]
  }
}

function measure(el: HTMLElement): Bounds {
  const r = el.getBoundingClientRect()
  const aspect = r.width / r.height
  const w = Math.min(7.4, Math.max(3.1, aspect * 3.6))
  return { w: Math.round(w * 2) / 2, d: aspect < 1 ? 3.6 : 2.7 }
}

// Drafts first, books dropped in over the second half so they land on top.
function initialPile(b: Bounds) {
  const count = Math.round(b.w * b.d * 1.15)
  const titles = shuffle(drafts)
  const total = count + books.length
  const bookSlots = books.map((_, i) => Math.round(total * (0.45 + (0.55 * i) / books.length)))
  const pile: BlockSpec[] = []
  for (let i = 0, k = 0, n = 0; i < total; i++) {
    const y = 7 + i * 0.75
    if (k < books.length && i >= bookSlots[k]) pile.push(makeBook(b, y, k++))
    else pile.push(makeDraft(b, y, titles[n++ % titles.length]))
  }
  return pile
}

// "plain *italic* plain" → nodes
function emphasize(text: string) {
  return text
    .split('*')
    .map((part, i) => (i % 2 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>))
}

type Toast = { key: number; text: string }

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const pubRef = useRef<HTMLButtonElement>(null)
  const [bounds, setBounds] = useState<Bounds | null>(null)
  const [blocks, setBlocks] = useState<BlockSpec[]>([])
  const [shake, setShake] = useState(0)
  const [active, setActive] = useState(true)
  const [toast, setToast] = useState<Toast | null>(null)
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [pubOffset, setPubOffset] = useState({ x: 0, y: 0 })
  const dodges = useRef(0)
  const excuseIdx = useRef(0)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const blocksRef = useRef(blocks)

  useEffect(() => {
    blocksRef.current = blocks
  }, [blocks])

  const say = useCallback((text: string) => {
    clearTimeout(toastTimer.current)
    setToast({ key: Date.now(), text })
    toastTimer.current = setTimeout(() => setToast(null), 3600)
  }, [])

  // Size the play area to the hero; build the first pile once we know it.
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const next = measure(el)
      setBounds((prev) => (prev && prev.w === next.w && prev.d === next.d ? prev : next))
      setBlocks((prev) => (prev.length ? prev : initialPile(next)))
    })
    ro.observe(el)
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0.02
    })
    io.observe(el)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  const addDraft = useCallback(
    (title?: string) => {
      if (!bounds) return
      const cap = Math.round(bounds.w * bounds.d * 3)
      setBlocks((prev) => {
        const next = [...prev, makeDraft(bounds, 11, title)]
        const extra = next.length - cap
        if (extra <= 0) return next
        let dropped = 0
        return next.filter((b) => b.kind === 'book' || dropped++ >= extra)
      })
    },
    [bounds]
  )

  const onBlockClick = useCallback(
    (id: number) => {
      const b = blocksRef.current.find((x) => x.id === id)
      if (!b || b.kind !== 'book') return
      const book = books.find((x) => x.title === b.title)
      if (!book) return
      say(`${statusLabel[book.status]}: “${book.title}”${book.author ? ` — ${book.author}` : ''}`)
    },
    [say]
  )

  const publish = () => {
    say(excuses[excuseIdx.current++ % excuses.length])
    addDraft('Draft saved. As always.')
    dodges.current = 0
    setPubOffset({ x: 0, y: 0 })
  }

  // The publish button would rather not.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const onMove = (e: PointerEvent) => {
      const btn = pubRef.current
      const hero = heroRef.current
      if (e.pointerType !== 'mouse' || !btn || !hero || dodges.current >= 6) return
      const r = btn.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const near = Math.max(r.width, r.height) / 2 + 28
      if (Math.hypot(e.clientX - cx, e.clientY - cy) > near) return

      const hr = hero.getBoundingClientRect()
      const baseX = cx - pubOffset.x
      const baseY = cy - pubOffset.y
      let nx = cx
      let ny = cy
      for (let i = 0; i < 12; i++) {
        nx = rand(hr.left + r.width, hr.right - r.width)
        ny = rand(hr.top + hr.height * 0.35, hr.bottom - r.height * 1.5)
        if (Math.hypot(nx - e.clientX, ny - e.clientY) > 260) break
      }
      dodges.current++
      setPubOffset({ x: nx - baseX, y: ny - baseY })
      if (dodges.current === 6) {
        setTimeout(() => {
          setPubOffset({ x: 0, y: 0 })
          say('Fine. You win. Go ahead, click it.')
        }, 650)
      }
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [pubOffset, say])

  const quote = quotes[quoteIdx]

  return (
    <section ref={heroRef} className='hero' aria-label='Intro'>
      <div
        className='hero-canvas'
        role='img'
        aria-label='A pile of unfinished blog drafts and the books I am reading'
      >
        {bounds && (
          <Scene
            blocks={blocks}
            bounds={bounds}
            shake={shake}
            active={active}
            onBlockClick={onBlockClick}
          />
        )}
      </div>

      <div className='hero-ui'>
        <header className='topbar'>
          <Link className='brand' href='/'>
            <span className='brand-mark' aria-hidden />
            Toan Ho
          </Link>
          <nav className='nav'>
            <a href='#books'>Books</a>
            <a href='#changelog'>Changelog</a>
            <a href={ARCHIVE_URL} target='_blank' rel='noreferrer'>
              Archive<sup>3</sup>
            </a>
          </nav>
        </header>

        <div className='hero-copy'>
          <figure className='quote' key={quoteIdx}>
            <blockquote>
              <p className={quote.text.length > 60 ? 'long' : ''}>
                <span className='mark' aria-hidden>
                  “
                </span>
                {emphasize(quote.text)}
              </p>
            </blockquote>
            <figcaption>
              <span className='dash' aria-hidden />
              <span>
                {quote.by}
                {quote.source && <cite>, {quote.source}</cite>}
              </span>
              <button
                type='button'
                className='next-quote'
                onClick={() => setQuoteIdx((i) => (i + 1) % quotes.length)}
              >
                ↻ Another one
              </button>
            </figcaption>
          </figure>
          <p className='sub'>
            Hi, I’m Toan. I’ve rebuilt this blog five times and written three posts — so I’m
            starting with the first half: reading a lot.
          </p>
        </div>

        <div className='hero-bottom'>
          <p className='hint'>Drag the drafts around. Tap a book to see what I’m reading.</p>
          <div className='dock' role='group' aria-label='Blog controls'>
            <button type='button' onClick={() => addDraft()}>
              <span aria-hidden>+</span> New draft
            </button>
            <button type='button' onClick={() => setShake((s) => s + 1)}>
              <span aria-hidden>≋</span> Procrastinate
            </button>
            <button
              ref={pubRef}
              type='button'
              className='publish'
              style={{ transform: `translate(${pubOffset.x}px, ${pubOffset.y}px)` }}
              onClick={publish}
            >
              Publish <span aria-hidden>↗</span>
            </button>
          </div>
        </div>
      </div>

      <div className='toast-slot' aria-live='polite'>
        {toast && (
          <div key={toast.key} className='toast'>
            <span>{toast.text}</span>
          </div>
        )}
      </div>
    </section>
  )
}
