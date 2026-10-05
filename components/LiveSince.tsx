'use client'

import { pad2, since, useNow } from './useNow'

export default function LiveSince({ from, label }: { from: string; label: string }) {
  const now = useNow()
  const t = now ? since(from, now) : null

  return (
    <div className='clock'>
      <span className='clock-value mono'>
        {t ? (
          <>
            {t.d}
            <small>d</small> {pad2(t.h)}
            <small>h</small> {pad2(t.m)}
            <small>m</small> {pad2(t.s)}
            <small>s</small>
          </>
        ) : (
          '——'
        )}
      </span>
      <span className='clock-label'>{label}</span>
    </div>
  )
}

export function DayCount({ from }: { from: string }) {
  const now = useNow()
  return <b className='mono'>{now ? `day ${since(from, now).d + 1}` : 'day —'}</b>
}
