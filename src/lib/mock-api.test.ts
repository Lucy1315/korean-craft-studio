import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitClassApplication, submitOrderInquiry } from './mock-api'

const order = { craftId: 'craft-1', name: '홍길동', phone: '010-1234-5678', quantity: 1 }
const application = {
  classId: 'class-1',
  name: '홍길동',
  phone: '010-1234-5678',
  preferredDate: '2026-10-10',
  headcount: 2,
}
const now = new Date(2026, 8, 30)

afterEach(() => {
  vi.useRealTimers()
})

describe('mock-api 지연', () => {
  it('기본 700ms가 지나기 전에는 해결되지 않고, 지나면 해결된다', async () => {
    vi.useFakeTimers()
    let settled = false
    void submitOrderInquiry(order).then(() => {
      settled = true
    })
    await vi.advanceTimersByTimeAsync(699)
    expect(settled).toBe(false)
    await vi.advanceTimersByTimeAsync(1)
    expect(settled).toBe(true)
  })

  it('delayMs: 0이면 곧바로 해결된다', async () => {
    const start = performance.now()
    await submitOrderInquiry(order, { delayMs: 0 })
    expect(performance.now() - start).toBeLessThan(50)
  })
})

describe('mock-api 성공', () => {
  it('주문 문의는 ORD 접수번호를 돌려준다', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.04215)
    const result = await submitOrderInquiry(order, { delayMs: 0, now })
    expect(result).toMatchObject({ ok: true, receiptNo: 'ORD-20260930-0421' })
    expect(result.message).not.toBe('')
  })

  it('클래스 신청은 CLS 접수번호를 돌려준다', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.04215)
    const result = await submitClassApplication(application, { delayMs: 0, now })
    expect(result).toMatchObject({ ok: true, receiptNo: 'CLS-20260930-0421' })
  })

  it('실패 번호와 비슷한 번호는 성공한다', async () => {
    const result = await submitOrderInquiry({ ...order, phone: '010-0000-0001' }, { delayMs: 0 })
    expect(result.ok).toBe(true)
  })
})

describe('mock-api 실패', () => {
  it.each(['010-0000-0000', '01000000000'])('%s는 Mock 오류를 돌려준다', async (phone) => {
    const orderResult = await submitOrderInquiry({ ...order, phone }, { delayMs: 0 })
    expect(orderResult).toMatchObject({ ok: false, code: 'MOCK_ERROR' })
    const classResult = await submitClassApplication({ ...application, phone }, { delayMs: 0 })
    expect(classResult).toMatchObject({ ok: false, code: 'MOCK_ERROR' })
  })
})

describe('mock-api 부수 효과 없음', () => {
  it('네트워크 요청과 저장을 하지 않는다', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    await submitOrderInquiry(order, { delayMs: 0 })
    await submitClassApplication(application, { delayMs: 0 })
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(setItemSpy).not.toHaveBeenCalled()
  })
})
