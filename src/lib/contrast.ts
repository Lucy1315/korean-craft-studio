// WCAG 2.x 상대 휘도와 대비 비율 계산.
function channel(value: number): number {
  const s = value / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance(hex: string): number {
  const match = /^#([0-9a-fA-F]{6})$/.exec(hex)
  if (!match) throw new Error(`hex 색이 아닙니다: ${hex}`)
  const value = parseInt(match[1], 16)
  const r = channel((value >> 16) & 0xff)
  const g = channel((value >> 8) & 0xff)
  const b = channel(value & 0xff)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}
