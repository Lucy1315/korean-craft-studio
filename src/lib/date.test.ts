import { describe, expect, it } from 'vitest'
import { toLocalDateString } from './date'

describe('toLocalDateString', () => {
  it('로컬 날짜를 YYYY-MM-DD로 만든다', () => {
    expect(toLocalDateString(new Date(2026, 8, 30))).toBe('2026-09-30')
    expect(toLocalDateString(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
  })
})
