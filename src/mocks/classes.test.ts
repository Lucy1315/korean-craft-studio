import { describe, expect, it } from 'vitest'
import { craftClasses } from './classes'

describe('craftClasses', () => {
  it('클래스 4개이고 id가 서로 다르다', () => {
    expect(craftClasses).toHaveLength(4)
    expect(new Set(craftClasses.map((c) => c.id)).size).toBe(4)
  })

  it('마감 클래스가 정확히 1개이다', () => {
    expect(craftClasses.filter((c) => c.remainingSeats === 0)).toHaveLength(1)
  })

  it('잔여석은 정원 이하이고 가격·시간은 양의 정수이다', () => {
    for (const c of craftClasses) {
      expect(c.remainingSeats).toBeGreaterThanOrEqual(0)
      expect(c.remainingSeats).toBeLessThanOrEqual(c.capacity)
      expect(Number.isInteger(c.price) && c.price > 0).toBe(true)
      expect(Number.isInteger(c.durationMinutes) && c.durationMinutes > 0).toBe(true)
    }
  })
})
