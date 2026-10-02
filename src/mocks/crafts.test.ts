import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import type { CraftCategory } from '@/types'
import { crafts } from './crafts'

const categories: CraftCategory[] = ['도자기', '나전칠기', '보자기', '목공예']

describe('crafts mock data', () => {
  it('상품이 8개이다', () => {
    expect(crafts).toHaveLength(8)
  })

  it('id가 모두 다르다', () => {
    expect(new Set(crafts.map((craft) => craft.id)).size).toBe(crafts.length)
  })

  it('종류마다 2개씩이다', () => {
    for (const category of categories) {
      expect(crafts.filter((craft) => craft.category === category)).toHaveLength(2)
    }
  })

  it('가격은 양의 정수(원)이다', () => {
    for (const craft of crafts) {
      expect(Number.isInteger(craft.price) && craft.price > 0).toBe(true)
    }
  })

  it('모든 이미지에 비어 있지 않은 alt가 있다', () => {
    for (const craft of crafts) {
      expect(craft.image.alt.trim().length).toBeGreaterThan(0)
    }
  })

  it('모든 이미지 파일이 public 아래에 있다', () => {
    for (const craft of crafts) {
      expect(craft.image.src.startsWith('/images/crafts/')).toBe(true)
      expect(existsSync(path.join(process.cwd(), 'public', craft.image.src))).toBe(true)
    }
  })

  it('플레이스홀더가 아닌 이미지는 출처 정보가 완전하다', () => {
    for (const craft of crafts) {
      if (craft.image.src.includes('placeholder-')) {
        expect(craft.image.credit).toBeUndefined()
        continue
      }
      const { credit } = craft.image
      expect(credit).toBeDefined()
      expect(credit?.author.trim()).not.toBe('')
      expect(credit?.license.trim()).not.toBe('')
      expect(credit?.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
    }
  })
})
