import { describe, expect, it } from 'vitest'
import { formatDuration, formatPrice } from './format'

describe('formatPrice', () => {
  it('원 단위 정수를 천 단위 구분 기호와 함께 표시한다', () => {
    expect(formatPrice(180000)).toBe('180,000원')
    expect(formatPrice(0)).toBe('0원')
  })
})

describe('formatDuration', () => {
  it('분을 시간·분으로 표시한다', () => {
    expect(formatDuration(150)).toBe('2시간 30분')
    expect(formatDuration(120)).toBe('2시간')
    expect(formatDuration(45)).toBe('45분')
  })
})
