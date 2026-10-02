import type { ClassApplicationValues, FieldErrors, OrderInquiryValues } from '@/types'

export const MAX_ORDER_QUANTITY = 10
export const MAX_NAME_LENGTH = 20
export const MAX_MEMO_LENGTH = 500

// 하이픈은 둘 다 있거나 둘 다 없어야 한다.
const PHONE_PATTERN = /^01[016789](-\d{3,4}-\d{4}|\d{7,8})$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const INTEGER_PATTERN = /^\d+$/

export function validateName(value: string): string | null {
  const name = value.trim()
  if (name.length === 0) return '이름을 입력해 주세요.'
  if (name.length > MAX_NAME_LENGTH) return `이름은 ${MAX_NAME_LENGTH}자 이하로 입력해 주세요.`
  return null
}

export function validatePhone(value: string): string | null {
  const phone = value.trim()
  if (phone.length === 0) return '연락처를 입력해 주세요.'
  if (!PHONE_PATTERN.test(phone)) return '연락처는 010-1234-5678 형식으로 입력해 주세요.'
  return null
}

function validateCount(value: string, max: number, label: string, unit: string): string | null {
  const text = value.trim()
  if (text.length === 0) return `${label}을 입력해 주세요.`
  if (!INTEGER_PATTERN.test(text)) return `${label}은 숫자로 입력해 주세요.`
  const count = Number(text)
  if (count < 1 || count > max) return `${label}은 1~${max}${unit} 사이로 입력해 주세요.`
  return null
}

export function validateQuantity(value: string, max: number = MAX_ORDER_QUANTITY): string | null {
  return validateCount(value, max, '수량', '개')
}

export function validateHeadcount(value: string, max: number): string | null {
  return validateCount(value, max, '인원', '명')
}

// today는 로컬 'YYYY-MM-DD'를 주입받는다. Date 파싱 없이 문자열로 비교한다(내일부터 허용).
export function validateDate(value: string, today: string): string | null {
  if (value.length === 0) return '희망 날짜를 선택해 주세요.'
  if (!DATE_PATTERN.test(value)) return '날짜 형식을 확인해 주세요.'
  if (value <= today) return '희망 날짜는 내일 이후로 선택해 주세요.'
  return null
}

export function validateMemo(value: string): string | null {
  if (value.length > MAX_MEMO_LENGTH) return `요청사항은 ${MAX_MEMO_LENGTH}자 이하로 입력해 주세요.`
  return null
}

function compact<T>(errors: { [K in keyof T]?: string | null }): FieldErrors<T> {
  const result: FieldErrors<T> = {}
  for (const key of Object.keys(errors) as Array<keyof T>) {
    const message = errors[key]
    if (message) result[key] = message
  }
  return result
}

export function validateOrderInquiry(values: OrderInquiryValues): FieldErrors<OrderInquiryValues> {
  return compact<OrderInquiryValues>({
    name: validateName(values.name),
    phone: validatePhone(values.phone),
    quantity: validateQuantity(values.quantity),
    memo: validateMemo(values.memo),
  })
}

export function validateClassApplication(
  values: ClassApplicationValues,
  options: { today: string; maxHeadcount: number },
): FieldErrors<ClassApplicationValues> {
  return compact<ClassApplicationValues>({
    name: validateName(values.name),
    phone: validatePhone(values.phone),
    preferredDate: validateDate(values.preferredDate, options.today),
    headcount: validateHeadcount(values.headcount, options.maxHeadcount),
    memo: validateMemo(values.memo),
  })
}
