import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { MockResult } from '@/types'
import { useSubmission } from './useSubmission'

const success: MockResult = { ok: true, receiptNo: 'ORD-20260930-0001', message: '접수되었습니다.' }
const failure: MockResult = { ok: false, code: 'MOCK_ERROR', message: 'Mock 오류입니다.' }

describe('useSubmission', () => {
  it('처음에는 idle이다', () => {
    const { result } = renderHook(() => useSubmission(vi.fn()))
    expect(result.current.status).toBe('idle')
    expect(result.current.result).toBeNull()
  })

  it('성공하면 submitting을 거쳐 success가 된다', async () => {
    let resolve: (value: MockResult) => void = () => {}
    const submit = vi.fn(() => new Promise<MockResult>((r) => (resolve = r)))
    const { result } = renderHook(() => useSubmission(submit))

    let pending: Promise<void> = Promise.resolve()
    act(() => {
      pending = result.current.submit('입력')
    })
    expect(result.current.status).toBe('submitting')

    await act(async () => {
      resolve(success)
      await pending
    })
    expect(result.current.status).toBe('success')
    expect(result.current.result).toEqual(success)
  })

  it('실패 결과면 error가 된다', async () => {
    const { result } = renderHook(() => useSubmission(vi.fn().mockResolvedValue(failure)))
    await act(async () => {
      await result.current.submit('입력')
    })
    expect(result.current.status).toBe('error')
    expect(result.current.result).toEqual(failure)
  })

  it('제출 함수가 예외를 던져도 error 상태로 복구한다', async () => {
    const { result } = renderHook(() => useSubmission(vi.fn().mockRejectedValue(new Error('boom'))))
    await act(async () => {
      await result.current.submit('입력')
    })
    expect(result.current.status).toBe('error')
    expect(result.current.result).toMatchObject({ ok: false, code: 'MOCK_ERROR' })
  })

  it('제출 중 다시 제출하면 무시한다', async () => {
    let resolve: (value: MockResult) => void = () => {}
    const submit = vi.fn(() => new Promise<MockResult>((r) => (resolve = r)))
    const { result } = renderHook(() => useSubmission(submit))

    let pending: Promise<void> = Promise.resolve()
    act(() => {
      pending = result.current.submit('첫 번째')
      void result.current.submit('두 번째')
    })
    expect(submit).toHaveBeenCalledTimes(1)
    await act(async () => {
      resolve(success)
      await pending
    })
  })

  it('reset하면 idle로 돌아간다', async () => {
    const { result } = renderHook(() => useSubmission(vi.fn().mockResolvedValue(failure)))
    await act(async () => {
      await result.current.submit('입력')
    })
    act(() => {
      result.current.reset()
    })
    expect(result.current.status).toBe('idle')
    expect(result.current.result).toBeNull()
  })
})
