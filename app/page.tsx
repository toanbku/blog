import Hero from '@/components/Hero'
import LiveSince, { DayCount } from '@/components/LiveSince'
import {
  ARCHIVE_URL,
  BLOG_BORN,
  LAST_POST,
  READING_SINCE,
  books,
  changelog,
  socials,
  stats,
  statusLabel
} from '@/lib/content'

// spine sizes for the shelf, in px
const SPINES = [
  { h: 300, w: 66 },
  { h: 268, w: 54 },
  { h: 318, w: 74 },
  { h: 286, w: 62 },
  { h: 248, w: 50 },
  { h: 304, w: 68 }
]

export default function Home() {
  return (
    <main>
      <Hero />

      <section id='books' className='books wrap' aria-labelledby='books-title'>
        <div className='books-grid'>
          <div>
            <div className='section-head'>
              <p className='eyebrow'>Bookshelf</p>
              <h2 id='books-title'>
                Read a lot, write a lot. <em>Starting with the first one.</em>
              </h2>
              <p className='habit'>
                <span className='dot' /> Reading habit · <DayCount from={READING_SINCE} />
              </p>
            </div>

            <div className='shelf' aria-hidden>
              <div className='shelf-row'>
                {books.map((b, i) => (
                  <div
                    key={b.title}
                    className={`spine ${b.status}`}
                    style={
                      {
                        '--c': b.color,
                        '--ink': b.ink,
                        '--h': `${SPINES[i % SPINES.length].h}px`,
                        '--w': `${SPINES[i % SPINES.length].w}px`
                      } as React.CSSProperties
                    }
                  >
                    <span className='spine-title'>{b.title}</span>
                    {b.author && (
                      <span className='spine-author'>
                        {b.author.split(' & ')[0].split(' ').pop()}
                      </span>
                    )}
                  </div>
                ))}
                <div className='bookend' />
              </div>
              <div className='shelf-board' />
            </div>
          </div>

          <ol className='book-list'>
            {books.map((b) => (
              <li key={b.title}>
                <span className='swatch' style={{ background: b.color }} aria-hidden />
                <div>
                  <h3>{b.title}</h3>
                  {b.author && <p className='author'>{b.author}</p>}
                  {b.blurb && <p className='blurb'>{b.blurb}</p>}
                </div>
                <span className={`status ${b.status}`}>{statusLabel[b.status]}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id='changelog' className='log wrap' aria-labelledby='log-title'>
        <div className='section-head'>
          <p className='eyebrow'>Changelog · straight from git log</p>
          <h2 id='log-title'>
            Four years of shipping <em>everything</em> except posts.
          </h2>
        </div>

        <ol className='timeline'>
          {changelog.map((e, i) => (
            <li key={i} className={`entry ${e.kind}`}>
              <time dateTime={e.date}>{e.date}</time>
              <span className='marker' aria-hidden />
              <div className='entry-body'>
                <span className='kind'>{e.kind}</span>
                <h3>{e.title}</h3>
                <p>{e.note}</p>
                {e.msg && (
                  <code>
                    {e.hash && <span className='hash'>{e.hash}</span>}
                    {e.msg}
                  </code>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className='numbers' aria-labelledby='numbers-title'>
        <div className='wrap'>
          <p className='eyebrow' id='numbers-title'>
            By the numbers
          </p>
          <dl className='stats'>
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className='clocks'>
            <LiveSince from={LAST_POST} label='since the last post' />
            <LiveSince from={BLOG_BORN} label='since the first commit' />
          </div>
        </div>
      </section>

      <footer className='footer wrap'>
        <p className='eyebrow'>What’s next</p>
        <p className='promise'>
          Next post: <em>soon</em>
          <sup>™</sup>
        </p>
        <div className='footer-links'>
          <a className='cta' href={ARCHIVE_URL} target='_blank' rel='noreferrer'>
            Read the 3 posts <span aria-hidden>↗</span>
          </a>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target='_blank' rel='noreferrer'>
              {s.label}
            </a>
          ))}
        </div>
        <p className='fineprint'>
          © 2022–2026 Toan Ho. Built with Next.js 16, three.js &amp; Rapier — version five, see
          above.
        </p>
      </footer>
    </main>
  )
}
