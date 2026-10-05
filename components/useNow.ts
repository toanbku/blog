'use client'

import { useSyncExternalStore } from 'react'

const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 1000)
  return () => clearInterval(t)
}
const getNow = () => Math.floor(Date.now() / 1000) * 1000
const getServerNow = () => null

/** Current time, ticking every second. `null` during SSR. */
export function useNow() {
  return useSyncExternalStore(subscribe, getNow, getServerNow)
}

export function since(from: string, now: number) {
  const s = Math.max(0, Math.floor((now - new Date(from).getTime()) / 1000))
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60
  }
}

export const pad2 = (n: number) => String(n).padStart(2, '0')
