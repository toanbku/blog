import Hero from '@/components/Hero'
import LiveSince from '@/components/LiveSince'
import { ARCHIVE_URL, BLOG_BORN, LAST_POST, changelog, socials, stats } from '@/lib/content'

export default function Home() {
  return (
    <main>
      <Hero />

      <section className='log wrap' aria-labelledby='log-title'>
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
