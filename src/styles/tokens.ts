// 색 토큰의 단일 정의. 대비 계산이 가능하도록 hex(#RRGGBB)만 쓴다.
// globals.css의 @theme --color-* 값과 같아야 하며, contrast.test.ts가 일치 여부를 검사한다.
export const colorTokens = {
  paper: '#F7F3EA',
  'paper-deep': '#EFE8D8',
  ink: '#22201C',
  'ink-muted': '#5C564C',
  jjok: '#1F4E79',
  'on-jjok': '#FFFFFF',
  line: '#D9D2C2',
  danger: '#A32A1E',
  'focus-ring': '#1F4E79',
} as const

export type ColorToken = keyof typeof colorTokens
