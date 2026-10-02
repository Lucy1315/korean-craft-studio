import type {
  ClassApplicationInput,
  MockApiOptions,
  MockResult,
  OrderInquiryInput,
} from '@/types'

// 실습용 Mock API이다. 네트워크 요청도 저장도 하지 않고, 지연 뒤 가짜 결과만 돌려준다.
const DEFAULT_DELAY_MS = 700
const FAILING_PHONE_DIGITS = '01000000000'

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function createReceiptNo(prefix: 'ORD' | 'CLS', now: Date): string {
  const yyyymmdd =
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')
  const serial = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `${prefix}-${yyyymmdd}-${serial}`
}

async function respond(
  prefix: 'ORD' | 'CLS',
  phone: string,
  successMessage: string,
  options: MockApiOptions = {},
): Promise<MockResult> {
  await wait(options.delayMs ?? DEFAULT_DELAY_MS)

  if (phone.replace(/\D/g, '') === FAILING_PHONE_DIGITS) {
    return {
      ok: false,
      code: 'MOCK_ERROR',
      message: '접수에 실패했습니다(Mock 오류). 연락처를 바꿔 다시 시도해 주세요.',
    }
  }

  return {
    ok: true,
    receiptNo: createReceiptNo(prefix, options.now ?? new Date()),
    message: successMessage,
  }
}

export function submitOrderInquiry(
  input: OrderInquiryInput,
  options?: MockApiOptions,
): Promise<MockResult> {
  return respond(
    'ORD',
    input.phone,
    '주문 문의가 접수되었습니다. 실습용 가상 접수이며 실제 주문은 이루어지지 않습니다.',
    options,
  )
}

export function submitClassApplication(
  input: ClassApplicationInput,
  options?: MockApiOptions,
): Promise<MockResult> {
  return respond(
    'CLS',
    input.phone,
    '클래스 신청이 접수되었습니다. 실습용 가상 접수이며 실제 예약은 이루어지지 않습니다.',
    options,
  )
}
