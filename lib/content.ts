// Everything on this page is real. Dates & commit hashes come from `git log`,
// posts come from the old Notion-powered site.

export const BLOG_BORN = '2022-06-25T00:00:00+07:00'
export const LAST_POST = '2024-04-30T14:08:41+07:00'

export const ARCHIVE_URL =
  'https://toan-ho.notion.site/Toan-Ho-Blog-76e5a1b0ab35411487a6260d89ff4255'

export const socials = [
  { label: 'GitHub', href: 'https://github.com/toanbku' },
  { label: 'X', href: 'https://x.com/toanbku' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/toanhq' }
]

export const posts = [
  { title: 'How to use AbortController', date: 'Jan 03 2023' },
  { title: 'Closure', date: 'Jan 28 2023' },
  { title: 'New Journey, New …Me', date: 'Apr 30 2024' }
]

export const drafts = [
  'Hello World (draft #47)',
  'Why I moved to Astro',
  'Why I moved off Astro',
  'Notion as a CMS: a love story',
  '2023 goal: 52 posts',
  '2024 goal: 1 post',
  '2025 goal: see 2024',
  'Mai viết.',
  'untitled-final-v3-REAL.md',
  'How I built my blog (×5)',
  'TODO: think of a title',
  'Rewrite it in Rust?',
  'Tabs vs spaces, part 1 of 9',
  'My setup (it changed again)',
  'Lorem ipsum dolor sit amet',
  'RSC, finally explained',
  'Kubernetes for dummies (me)',
  'Đang viết dở…',
  'On consistency',
  'Thoughts on Web3 (2022)',
  'A post about posting',
  'Ship it! (I didn’t)',
  'Why I don’t blog',
  'Mastering git rebase',
  'Next.js 13 is here!',
  'Monday. Definitely Monday.',
  '10x engineer, 0.1x writer',
  'Hôm nay viết gì?',
  'Why my blog needs physics',
  'Is it done yet?',
  'Coming soon™',
  'Draft',
  'Dark mode: a 9-part saga',
  'What I learned in 2022',
  'What I learned in 2023',
  'Notes to self: write more'
]

export const excuses = [
  'Publish failed: author is rewriting the blog in a new framework.',
  'Error 418: author is a teapot.',
  'Scheduled for tomorrow™.',
  'Draft saved. As always.',
  'Mai viết. (Tomorrow. Promise.)',
  'Waiting for Notion to sync…',
  'Blocked on: choosing a font.',
  'Needs one more refactor first.'
]

type Entry = {
  date: string
  kind: 'build' | 'chore' | 'post'
  title: string
  note: string
  hash?: string
  msg?: string
}

export const changelog: Entry[] = [
  {
    date: '2022-06-25',
    kind: 'build',
    hash: 'd1297a3',
    msg: 'init commit',
    title: 'v1 — Astro starter',
    note: 'The blog is born. Ships with giscus, so readers can comment on posts that don’t exist yet.'
  },
  {
    date: '2022-06-26',
    kind: 'build',
    hash: '758aeab',
    msg: 'feat: integrate w Notion',
    title: 'v2 — Astro + Notion',
    note: 'Writing will be so much easier in Notion. That was the plan.'
  },
  {
    date: '2022-07-19',
    kind: 'chore',
    hash: '7ff5607',
    msg: 'feat: support tailwind',
    title: 'Adds Tailwind',
    note: 'The empty pages are now beautifully styled.'
  },
  {
    date: '2022-08-17',
    kind: 'chore',
    hash: 'e147d1b',
    msg: 'feat: upgrade astro version',
    title: 'Upgrades Astro',
    note: 'Zero posts to migrate. Smoothest migration in history.'
  },
  {
    date: '2023-01-02',
    kind: 'build',
    hash: '1ac83f3',
    msg: 'chore: change to astro',
    title: 'v3 — switches to Astro',
    note: 'It was already Astro.'
  },
  {
    date: '2023-01-02',
    kind: 'build',
    hash: '0b0cb20',
    msg: 'change tech stack',
    title: 'v4 — Next.js + Notion',
    note: 'v3 lived for 27 minutes.'
  },
  {
    date: '2023-01-03',
    kind: 'post',
    title: 'Post #1 — How to use AbortController',
    note: 'It happened. An actual post.'
  },
  {
    date: '2023-01-28',
    kind: 'post',
    title: 'Post #2 — Closure',
    note: 'Two posts in one month. Unstoppable.'
  },
  {
    date: '2023-03-11',
    kind: 'chore',
    hash: '90217eb',
    msg: 'feat: comment with utteranc',
    title: 'Comment system #2',
    note: 'Swaps giscus for utterances. Two posts, two comment systems.'
  },
  {
    date: '2024-04-30',
    kind: 'post',
    title: 'Post #3 — New Journey, New …Me',
    note: 'Same afternoon: “chore: remove sponsor”. Then, silence.'
  },
  {
    date: '2026-10-05',
    kind: 'build',
    msg: 'feat: posts are now 3D',
    title: 'v5 — Next.js 16 + Three.js + a physics engine',
    note: 'Asked an AI to build it. Posts are now 3D, can be thrown around. Still 3 of them.'
  }
]

export const stats = [
  { value: '5', label: 'versions of this blog' },
  { value: '3', label: 'posts published' },
  { value: '0.6', label: 'posts per rebuild' },
  { value: '2', label: 'comment systems installed' }
]
