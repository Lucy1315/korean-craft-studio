export type CraftCategory = '도자기' | '나전칠기' | '보자기' | '목공예'

export interface ImageCredit {
  author: string
  license: string
  sourceUrl: string
}

// credit이 없으면 자체 제작 플레이스홀더이다.
export interface CraftImage {
  src: string
  alt: string
  credit?: ImageCredit
}

export interface Craft {
  id: string
  name: string
  category: CraftCategory
  description: string
  price: number
  image: CraftImage
}

export interface CraftClass {
  id: string
  name: string
  description: string
  price: number
  durationMinutes: number
  capacity: number
  remainingSeats: number // 0 = 마감
}

export interface OrderInquiryInput {
  craftId: string
  name: string
  phone: string
  quantity: number
  memo?: string
}

export interface ClassApplicationInput {
  classId: string
  name: string
  phone: string
  preferredDate: string // 'YYYY-MM-DD'
  headcount: number
  memo?: string
}

// 폼 입력 상태(모두 문자열). 검증을 통과한 뒤 *Input으로 변환한다.
export interface OrderInquiryValues {
  name: string
  phone: string
  quantity: string
  memo: string
}

export interface ClassApplicationValues {
  name: string
  phone: string
  preferredDate: string
  headcount: string
  memo: string
}

export type MockResult =
  | { ok: true; receiptNo: string; message: string }
  | { ok: false; code: 'MOCK_ERROR'; message: string }

export interface MockApiOptions {
  delayMs?: number
  now?: Date
}

export type SubmitFn<TInput> = (input: TInput) => Promise<MockResult>

export type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'
export type FieldErrors<T> = Partial<Record<keyof T, string>>
