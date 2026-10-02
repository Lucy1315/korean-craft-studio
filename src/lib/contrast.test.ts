import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { colorTokens } from '@/styles/tokens'
import { contrastRatio } from './contrast'

describe('contrastRatio', () => {
  it('검정과 흰색은 21:1이다', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5)
  })
  it('같은 색은 1:1이다', () => {
    expect(contrastRatio('#1F4E79', '#1F4E79')).toBeCloseTo(1, 5)
  })
})

describe('색 토큰 대비', () => {
  const textPairs = [
    ['ink', 'paper'],
    ['ink-muted', 'paper'],
    ['on-jjok', 'jjok'],
    ['danger', 'paper'],
    ['jjok', 'paper'],
    ['ink', 'paper-deep'],
    ['ink-muted', 'paper-deep'],
    ['jjok', 'paper-deep'],
    ['on-jjok', 'ink'],
  ] as const

  it.each(textPairs)('%s / %s 는 4.5:1 이상이다', (fg, bg) => {
    expect(contrastRatio(colorTokens[fg], colorTokens[bg])).toBeGreaterThanOrEqual(4.5)
  })

  it('focus-ring / paper 는 3:1 이상이다', () => {
    expect(contrastRatio(colorTokens['focus-ring'], colorTokens.paper)).toBeGreaterThanOrEqual(3)
  })
})

describe('globals.css와 tokens.ts 일치', () => {
  it('@theme의 --color-* 값이 토큰과 같다', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8')
    const found: Record<string, string> = {}
    for (const match of css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
      found[match[1]] = match[2].toUpperCase()
    }
    const expected = Object.fromEntries(
      Object.entries(colorTokens).map(([name, hex]) => [name, hex.toUpperCase()]),
    )
    expect(found).toEqual(expected)
  })
})
