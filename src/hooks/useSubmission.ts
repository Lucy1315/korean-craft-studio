'use client'

import { useCallback, useRef, useState } from 'react'
import type { MockResult, SubmissionStatus, SubmitFn } from '@/types'

interface SubmissionState {
  status: SubmissionStatus
  result: MockResult | null
}

const initialState: SubmissionState = { status: 'idle', result: null }

// 폼 제출 상태 기계: idle → submitting → success | error. 제출 중 재제출은 무시한다.
export function useSubmission<TInput>(submitFn: SubmitFn<TInput>) {
  const [state, setState] = useState<SubmissionState>(initialState)
  const inFlight = useRef(false)

  const submit = useCallback(
    async (input: TInput) => {
      if (inFlight.current) return
      inFlight.current = true
      setState({ status: 'submitting', result: null })
      try {
        const result = await submitFn(input)
        setState({ status: result.ok ? 'success' : 'error', result })
      } catch {
        // 제출 함수가 예외를 던져도 submitting에 갇히지 않게 오류 결과로 바꾼다.
        setState({
          status: 'error',
          result: { ok: false, code: 'MOCK_ERROR', message: '접수 중 문제가 생겼습니다. 다시 시도해 주세요.' },
        })
      } finally {
        inFlight.current = false
      }
    },
    [submitFn],
  )

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  return { status: state.status, result: state.result, submit, reset }
}
